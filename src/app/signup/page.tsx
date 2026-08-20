"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowLeft,
  UserRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================
  // VALIDATION
  // ============================================================

  const nameValid = name.trim().length >= 2;

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const passwordValid = password.length >= 6;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const formValid =
    nameValid &&
    emailValid &&
    passwordValid &&
    passwordsMatch;

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    // Name validation
    if (!nameValid) {
      setErrorMessage(
        "Please enter a valid name with at least 2 characters.",
      );
      return;
    }

    // Email validation
    if (!emailValid) {
      setErrorMessage(
        "Please enter a valid email address.",
      );
      return;
    }

    // Password validation
    if (!passwordValid) {
      setErrorMessage(
        "Password must contain at least 6 characters.",
      );
      return;
    }

    // Password confirmation validation
    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSigningUp(true);

      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        setSuccessMessage(
          "Account created successfully. Please check your email to confirm your account before logging in.",
        );
      } else {
        setSuccessMessage(
          "Account created successfully. You can now continue to MatchPulse.",
        );
      }

      // Clear form after successful signup
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Signup error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your account.",
      );
    } finally {
      setIsSigningUp(false);
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

        {/* Signup Area */}
        <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
          <div className="w-full max-w-md">
            {/* Signup Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                Create your MatchPulse account
              </p>
            </div>

            {/* Signup Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* ================================================== */}
                {/* NAME */}
                {/* ================================================== */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Name
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      disabled={isSigningUp}
                      required
                      className={`h-12 w-full rounded-xl border bg-zinc-900/70 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        name.length > 0 && nameValid
                          ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
                          : name.length > 0
                            ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                            : "border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/10"
                      }`}
                    />
                  </div>

                  {name.length > 0 && !nameValid && (
                    <p className="mt-2 text-xs text-red-400">
                      Name must contain at least 2 characters.
                    </p>
                  )}

                  {nameValid && (
                    <p className="mt-2 text-xs text-green-400">
                      Name looks good.
                    </p>
                  )}
                </div>

                {/* ================================================== */}
                {/* EMAIL */}
                {/* ================================================== */}

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
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      disabled={isSigningUp}
                      required
                      className={`h-12 w-full rounded-xl border bg-zinc-900/70 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        email.length > 0 && emailValid
                          ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
                          : email.length > 0
                            ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                            : "border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/10"
                      }`}
                    />
                  </div>

                  {email.length > 0 && !emailValid && (
                    <p className="mt-2 text-xs text-red-400">
                      Please enter a valid email address.
                    </p>
                  )}

                  {emailValid && (
                    <p className="mt-2 text-xs text-green-400">
                      Email address looks valid.
                    </p>
                  )}
                </div>

                {/* ================================================== */}
                {/* PASSWORD */}
                {/* ================================================== */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      disabled={isSigningUp}
                      required
                      className={`h-12 w-full rounded-xl border bg-zinc-900/70 pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        password.length > 0 &&
                        passwordValid
                          ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
                          : password.length > 0
                            ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                            : "border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value,
                        )
                      }
                      disabled={isSigningUp}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300 disabled:cursor-not-allowed"
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

                  {password.length > 0 &&
                    !passwordValid && (
                      <p className="mt-2 text-xs text-red-400">
                        Password must contain at least 6
                        characters.
                      </p>
                    )}

                  {passwordValid && (
                    <p className="mt-2 text-xs text-green-400">
                      Password length is valid.
                    </p>
                  )}
                </div>

                {/* ================================================== */}
                {/* CONFIRM PASSWORD */}
                {/* ================================================== */}

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value,
                        )
                      }
                      disabled={isSigningUp}
                      required
                      className={`h-12 w-full rounded-xl border bg-zinc-900/70 pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        confirmPassword.length > 0 &&
                        passwordsMatch
                          ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
                          : confirmPassword.length > 0
                            ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                            : "border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value,
                        )
                      }
                      disabled={isSigningUp}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300 disabled:cursor-not-allowed"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {confirmPassword.length > 0 &&
                    !passwordsMatch && (
                      <p className="mt-2 text-xs text-red-400">
                        Passwords do not match.
                      </p>
                    )}

                  {passwordsMatch && (
                    <p className="mt-2 text-xs text-green-400">
                      Passwords match.
                    </p>
                  )}
                </div>

                {/* ================================================== */}
                {/* VALIDATION SUMMARY */}
                {/* ================================================== */}

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Account Validation
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p
                      className={
                        nameValid
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {nameValid ? "✓" : "✗"} Name
                    </p>

                    <p
                      className={
                        emailValid
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {emailValid ? "✓" : "✗"} Email
                    </p>

                    <p
                      className={
                        passwordValid
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {passwordValid ? "✓" : "✗"} Password
                    </p>

                    <p
                      className={
                        passwordsMatch
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {passwordsMatch ? "✓" : "✗"} Password Match
                    </p>

                    <p
                      className={
                        formValid
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {formValid ? "✓" : "✗"} Form Ready
                    </p>
                  </div>
                </div>

                {/* ================================================== */}
                {/* ERROR */}
                {/* ================================================== */}

                {errorMessage && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <p className="text-sm leading-6 text-red-400">
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* ================================================== */}
                {/* SUCCESS */}
                {/* ================================================== */}

                {successMessage && (
                  <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-green-400"
                    />

                    <p className="text-sm leading-6 text-green-400">
                      {successMessage}
                    </p>
                  </div>
                )}

                {/* ================================================== */}
                {/* SUBMIT */}
                {/* ================================================== */}

                <button
                  type="submit"
                  disabled={!formValid || isSigningUp}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-500 hover:shadow-green-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none"
                >
                  {isSigningUp ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
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

              {/* Login */}
              <div className="text-center">
                <p className="text-sm text-zinc-500">
                  Already have a MatchPulse account?
                </p>

                <Link
                  href="/login"
                  className="mt-2 inline-block text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}