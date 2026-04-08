import { timingSafeEqual } from "node:crypto";

import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import authConfig from "@/auth.config";

type AttemptState = {
  count: number;
  firstAttemptAt: number;
  lockUntil: number;
};

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const attemptStore = new Map<string, AttemptState>();

const FALLBACK_HASH = "$2b$12$yq1n2fuMofI0YUvMqi4YHOdQjRjMZ7fZ2mkVf7M8k3by2u2s6UHfS";

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

        const expectedUsername = process.env.ADMIN_USERNAME;
        const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!expectedUsername || !expectedPasswordHash) {
          return null;
        }

        const isUsernameValid = safeStringEqual(username, expectedUsername);
        const hashToCompare = expectedPasswordHash || FALLBACK_HASH;
        const isPasswordValid = await bcrypt.compare(password, hashToCompare);

        if (!isUsernameValid || !isPasswordValid) {
          registerFailure(key, now);
          return null;
        }

        registerSuccess(key);

        return {
          id: "admin-user",
          name: "Admin",
        };
      },
    }),
  ],
});