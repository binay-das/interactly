"use client";

import { adminLoginSchema } from "@repo/validation";
import { useAuth } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { user, login, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationResult = adminLoginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in. Check your credentials.";
      setErrors({ form: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/" className="inline-block text-xl font-bold tracking-tight text-zinc-100 mb-6">
          Interactly
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Sign in to your account
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Enter your email and password to access the portal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 rounded-xl shadow-sm">
          {errors.form && (
            <div className="mb-5 bg-red-950/40 border border-red-800/50 text-red-300 px-3.5 py-2.5 rounded-md text-xs font-medium">
              {errors.form}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@interactly.com"
                className={`w-full px-3 py-2 rounded-md bg-zinc-950 border text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-zinc-800 focus:border-zinc-500 focus:ring-zinc-500"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3 py-2 rounded-md bg-zinc-950 border text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-zinc-800 focus:border-zinc-500 focus:ring-zinc-500"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2 px-4 rounded-md text-zinc-950 font-medium bg-zinc-100 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-zinc-200 underline underline-offset-4 hover:text-white transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}