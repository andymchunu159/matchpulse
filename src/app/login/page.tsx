"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ============================================================
  // REDIRECT DESTINATION
  // ============================================================

  const requestedDestination = searchParams.get("next");

  /*
   * Only allow internal MatchPulse paths.
   *
   * This prevents an external URL from being supplied through
   * ?next= and avoids creating an open redirect.
   */
  const redirectDestination =
    requestedDestination &&
    requestedDestination.startsWith("/") &&
    !requestedDestination.startsWith("//")
      ? requestedDestination
      : "/";

  // ============================================================
  // VALIDATION
  // ============================================================

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim(),
    );

  const passwordValid = password.length >= 6;

  const formValid =
    emailValid && passwordValid;

  // ============================================================
  // LOGIN
  // ============================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const trimmedEmail = email.trim();

    // ----------------------------------------------------------
    // Email validation
    // ----------------------------------------------------------

    if (!trimmedEmail) {
      setErrorMessage(
        "Please enter your email address.",
      );
      return;
    }

    if (!emailValid) {
      setErrorMessage(
        "Please enter a valid email address.",
      );
      return;
    }

    // ----------------------------------------------------------
    // Password validation
    // ----------------------------------------------------------

    if (!password) {
      setErrorMessage(
        "Please enter your password.",
      );
      return;
    }

    if (!passwordValid) {
      setErrorMessage(
        "Password must contain at least 6 characters.",
      );
      return;
    }

    try {
      setIsLoggingIn(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

      if (error) {
        setErrorMessage(
          error.message ===
            "Invalid login credentials"
            ? "Invalid email or password."
            : error.message,
        );
        return;
      }

      setSuccessMessage(
        "Login successful. Redirecting...",
      );

      // --------------------------------------------------------
      // REDIRECT TO ORIGINAL DESTINATION
      // --------------------------------------------------------

      router.replace(redirectDestination);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        "Something went wrong while logging in. Please try again.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute bottom-[-200px] left-[-150px] h-[400px] w-[400px] rounded-full bg-emerald-600/5 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col">

        {/* Back to MatchPulse */}
        <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6 lg:right-8 lg:top-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to MatchPulse
          </Link>
        </div>

        {/* Login Area */}
        <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
          <div className="w-full max-w-md">

            {/* Login Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Login
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                Login to continue to MatchPulse
              </p>
            </div>

            {/* Login Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      disabled={isLoggingIn}
                      required
                      className={`h-12 w-full rounded-xl border bg-zinc-900/70 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        email.length > 0 && emailValid
                          ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
                          : email.length > 0
                            ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                            : "border-white/10 focus:border-green-500/60 focus:ring-green-500/10"
                      }`}
                    />
                  </div>

                  {/* Email Validation */}
                  {email.length > 0 &&
                    !emailValid && (
                      <p className="mt-2 text-xs text-red-400">
                        Please enter a valid email address.
                      </p>
                    )}

                  {emailValid && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-green-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Email address looks valid.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-zinc-200"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      disabled={isLoggingIn}
                      required
                      className={`h-12 w-full rounded-xl border bg-zinc-900/70 pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        password.length > 0 &&
                        passwordValid
                          ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
                          : password.length > 0
                            ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                            : "border-white/10 focus:border-green-500/60 focus:ring-green-500/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value,
                        )
                      }
                      disabled={isLoggingIn}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Validation */}
                  {password.length > 0 &&
                    !passwordValid && (
                      <p className="mt-2 text-xs text-red-400">
                        Password must contain at least 6 characters.
                      </p>
                    )}

                  {passwordValid && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-green-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Password length is valid.
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />

                    <p className="text-sm leading-6 text-red-400">
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 bg-green-500/5 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-green-400" />

                    <p className="text-sm leading-6 text-green-400">
                      {successMessage}
                    </p>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={!formValid || isLoggingIn}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-500 hover:shadow-green-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none"
                >
                  {isLoggingIn ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs uppercase tracking-wider text-zinc-600">
                  Or
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Sign Up */}
              <div className="text-center">
                <p className="text-sm text-zinc-500">
                  Don't have a MatchPulse account?
                </p>

                <Link
                  href="/signup"
                  className="mt-2 inline-block text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Create an account
                </Link>
              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}