"use client";

import { adminLoginSchema } from "@repo/validation";
import { useAuth } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "../../components/ui/logo";
import { ThemeToggle } from "../../components/ui/theme-toggle";

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
      <div className="min-h-screen flex items-center justify-center bg-(--background) text-(--foreground)">
        <div className="w-5 h-5 border-2 border-[#0969da] dark:border-[#2f81f7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-150">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-[#1f2328] dark:text-[#f0f6fc] mb-4 hover:opacity-90 transition-opacity">
          <Logo size={28} className="rounded" />
          <span>Interactly</span>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-[#1f2328] dark:text-[#f0f6fc]">
          Sign in to Interactly
        </h1>
        <p className="mt-1.5 text-xs text-[#636c76] dark:text-[#8b949e]">
          Enter your credentials to manage and host live quizzes.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] p-6 sm:p-8 rounded-xl shadow-xs">
          {errors.form && (
            <div className="mb-5 bg-[#ffebe9] dark:bg-[#490202]/40 border border-[#ff8182] dark:border-[#da3633]/50 text-[#cf222e] dark:text-[#f85149] px-3.5 py-2.5 rounded-md text-xs font-medium">
              {errors.form}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[#1f2328] dark:text-[#c9d1d9] mb-1.5">
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
                className={`w-full px-3 py-2 rounded-md bg-white dark:bg-[#010409] border text-[#1f2328] dark:text-[#f0f6fc] text-xs placeholder-[#8c959f] dark:placeholder-[#6e7681] focus:outline-none focus:ring-1 transition-colors ${
                  errors.email
                    ? "border-[#cf222e] focus:ring-[#cf222e]"
                    : "border-[#d0d7de] dark:border-[#30363d] focus:border-[#0969da] dark:focus:border-[#2f81f7] focus:ring-[#0969da] dark:focus:ring-[#2f81f7]"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[#cf222e] dark:text-[#f85149] font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[#1f2328] dark:text-[#c9d1d9] mb-1.5">
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
                className={`w-full px-3 py-2 rounded-md bg-white dark:bg-[#010409] border text-[#1f2328] dark:text-[#f0f6fc] text-xs placeholder-[#8c959f] dark:placeholder-[#6e7681] focus:outline-none focus:ring-1 transition-colors ${
                  errors.password
                    ? "border-[#cf222e] focus:ring-[#cf222e]"
                    : "border-[#d0d7de] dark:border-[#30363d] focus:border-[#0969da] dark:focus:border-[#2f81f7] focus:ring-[#0969da] dark:focus:ring-[#2f81f7]"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-[#cf222e] dark:text-[#f85149] font-medium">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2 px-4 rounded-md text-white font-semibold bg-[#1f883d] hover:bg-[#1a7f37] dark:bg-[#238636] dark:hover:bg-[#2ea043] border border-[#1a7f37] dark:border-[#238636] focus:outline-none focus:ring-2 focus:ring-[#238636] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#636c76] dark:text-[#8b949e]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#0969da] dark:text-[#58a6ff] hover:underline transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}