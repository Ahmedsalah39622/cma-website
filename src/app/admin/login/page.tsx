"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, User, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      setError("Invalid credentials. Please try again.");
      return;
    }

    router.replace(result.url || callbackUrl);
    router.refresh();
  }

  if (!mounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes customFadeIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-custom-fade {
          animation: customFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        /* Fix for Webkit Autofill replacing background color */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s;
            -webkit-text-fill-color: white !important;
            caret-color: white;
            background-color: transparent !important;
        }
      `}} />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#030303] selection:bg-amber-500/30">
        {/* Background Animated Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Main glowing orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '11s' }} />
          <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-amber-700/10 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '9s' }} />
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-70" />
        </div>

        <div className="relative z-10 w-full max-w-[420px] animate-custom-fade">
          <div className="relative group">
            {/* Ambient blur behind the card */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-10 overflow-hidden transition-all duration-500">
              {/* Refined Top Shine */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              
              <div className="flex flex-col items-center mb-10 text-center relative z-20">
                <div className="animate-float mb-6 relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.15)] relative backdrop-blur-md">
                    <ShieldCheck className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" strokeWidth={1.5} />
                    <div className="absolute inset-0 rounded-2xl bg-amber-400/10 blur-xl -z-10" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Admin Portal
                  </h1>
                  <p className="text-sm text-gray-400 mt-2.5 font-medium">
                    Please securely identify yourself.
                  </p>
                </div>
              </div>

              <form onSubmit={onSubmit} className="flex flex-col gap-6 relative z-20">
                <div className="flex flex-col gap-5">
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 transition-transform group-focus-within/input:scale-110 duration-300 origin-center">
                      <User className="h-[18px] w-[18px] text-gray-500 group-focus-within/input:text-amber-400 transition-colors duration-300" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      required
                      autoComplete="username"
                      placeholder="Username"
                      className="block w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:bg-white/[0.05] focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all duration-300 outline-none hover:border-white/20 shadow-inner relative"
                    />
                  </div>

                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 transition-transform group-focus-within/input:scale-110 duration-300 origin-center">
                      <KeyRound className="h-[18px] w-[18px] text-gray-500 group-focus-within/input:text-amber-400 transition-colors duration-300" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Password"
                      className="block w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:bg-white/[0.05] focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all duration-300 outline-none hover:border-white/20 shadow-inner relative"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-3 text-red-400 bg-red-500/10 px-4 py-3.5 rounded-xl border border-red-500/20 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <p className="text-[13px] font-medium leading-tight">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-xl font-medium text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out" />
                  
                  {loading ? (
                    <>
                      <Loader2 className="w-[18px] h-[18px] animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center pt-2">
                  <div className="flex items-center space-x-2 text-[11px] text-gray-400 tracking-wide font-medium uppercase mix-blend-screen opacity-80">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span>Secure End-to-End Encryption</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}