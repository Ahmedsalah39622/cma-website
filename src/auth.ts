import { timingSafeEqual } from "node:crypto";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import authConfig from "@/auth.config";
import { db } from "@/db";
import { users } from "@/db/schema";

type AttemptState = {
  count: number;
  firstAttemptAt: number;
  lockUntil: number;
};

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const attemptStore = new Map<string, AttemptState>();

function getAttemptKey(username: string): string {
  return username.trim().toLowerCase();
}

function isLocked(key: string, now: number): boolean {
  const state = attemptStore.get(key);
  if (!state) return false;

  if (state.lockUntil > now) {
    return true;
  }

  if (state.lockUntil <= now) {
    attemptStore.delete(key);
  }

  return false;
}

function registerFailure(key: string, now: number): void {
  const current = attemptStore.get(key);

  if (!current || now - current.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    attemptStore.set(key, {
      count: 1,
      firstAttemptAt: now,
      lockUntil: 0,
    });
    return;
  }

  const nextCount = current.count + 1;
  const shouldLock = nextCount >= MAX_ATTEMPTS;

  attemptStore.set(key, {
    count: nextCount,
    firstAttemptAt: current.firstAttemptAt,
    lockUntil: shouldLock ? now + LOCK_TIME_MS : 0,
  });
}

function registerSuccess(key: string): void {
  attemptStore.delete(key);
}

function safeStringEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret:
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? "cma-admin-dev-secret-change-me" : undefined),
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 15,
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "").trim();
        const password = String(credentials?.password ?? "");
        const key = getAttemptKey(username || "unknown-user");
        const now = Date.now();

        if (!username || !password) {
          return null;
        }

        if (isLocked(key, now)) {
          return null;
        }

        const [matchedUser] = await db
          .select({
            id: users.id,
            username: users.username,
            passwordHash: users.passwordHash,
            role: users.role,
          })
          .from(users)
          .where(eq(users.username, username))
          .limit(1);

        if (!matchedUser) {
          registerFailure(key, now);
          return null;
        }

        const isUsernameValid = safeStringEqual(username, matchedUser.username);
        const isPasswordValid = await bcrypt.compare(password, matchedUser.passwordHash);

        if (!isUsernameValid || !isPasswordValid) {
          registerFailure(key, now);
          return null;
        }

        registerSuccess(key);

        return {
          id: matchedUser.id,
          name: matchedUser.username,
          role: matchedUser.role,
        };
      },
    }),
  ],
});