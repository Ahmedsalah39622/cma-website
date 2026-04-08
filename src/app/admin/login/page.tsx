"use client";

import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") || "/admin/dashboard",
    [searchParams]
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid username or password.");
      return;
    }

    router.replace(result.url || callbackUrl);
    router.refresh();
  }

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center px-6 overflow-hidden bg-[radial-gradient(circle_at_10%_20%,#362f12_0%,#0a0a0a_36%),radial-gradient(circle_at_90%_10%,#1a2236_0%,rgba(10,10,10,0)_42%),#080808]">
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-[#d4af37]/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -right-16 w-80 h-80 bg-[#2e6cd2]/20 blur-3xl rounded-full" />

      <div className="relative w-full max-w-md bg-[linear-gradient(170deg,rgba(255,255,255,.12),rgba(255,255,255,.03)_45%,rgba(255,255,255,.02))] border border-white/15 rounded-[2rem] p-8 backdrop-blur-xl shadow-[0_35px_90px_rgba(0,0,0,.55)]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/35 bg-[#d4af37]/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="text-xs text-[#f1de9d] tracking-wide">SECURE ACCESS</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Sign In</h1>
        <p className="text-white/65 mb-8">Enter your credentials to access the control dashboard.</p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm text-white/70 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl bg-black/35 border border-white/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/70 focus:border-[#d4af37]/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-white/70 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl bg-black/35 border border-white/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/70 focus:border-[#d4af37]/50 transition-colors"
            />
          </div>

          {error ? <p className="text-red-300 text-sm">Invalid credentials. Please try again.</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#f7db6a] to-[#d4af37] text-black hover:brightness-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-[11px] text-white/40 leading-relaxed pt-1">
            Unauthorized access attempts are blocked and monitored.
          </p>
        </form>
      </div>
    </div>
  );
}