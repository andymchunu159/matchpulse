"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const passwordValid = password.length >= 6;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const formValid =
    passwordValid && passwordsMatch;

  // ============================================================
  // CHECK PASSWORD RECOVERY SESSION
  // ============================================================

  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setErrorMessage(
            "This password reset link is invalid or has expired. Please request a new password reset link.",
          );
        }
      } catch (error) {
        console.error(
          "Password recovery session error:",
          error,
        );

        setErrorMessage(
          "Unable to verify your password reset session. Please request a new reset link.",
        );
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkSession();
  }, [supabase]);

  // ============================================================
  // UPDATE PASSWORD
  // ============================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!passwordValid) {
      setErrorMessage(
        "Password must contain at least 6 characters.",
      );
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsUpdating(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      setSuccessMessage(
        "Your password has been updated successfully. Redirecting you to Login...",
      );

      setPassword("");
      setConfirmPassword("");

      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(
        "Password update error:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating your password. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (isCheckingSession) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-180px] h-[400px] w-[400px] -translate-x-1/2 -translate-y-0 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="absolute bottom-[-200px] left-[-150px] h-[400px] w-[400px] rounded-full bg-emerald-600/5 blur-3xl" />
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-4">
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-green-500" />
            Verifying password reset...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[400px] -translate-x-1/2 -translate-y-0 rounded-full bg-emerald-500/10 blur-3xl" />

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

        {/* Reset Password Area */}
        <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Reset Password
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                Create a new password for your MatchPulse
                account.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />

                  <p className="text-sm leading-6 text-red-400">
                    {errorMessage}
                  </p>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-green-400" />

                  <p className="text-sm leading-6 text-green-400">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Only show form when no session error */}
              {!errorMessage && !successMessage && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-zinc-200"
                    >
                      New Password
                    </label>

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
                        autoComplete="new-password"
                        placeholder="Create a new password"
                        value={password}
                        onChange={(event) => {
                          setPassword(
                            event.target.value,
                          );
                          setErrorMessage("");
                        }}
                        disabled={isUpdating}
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
                        disabled={isUpdating}
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

                    {password.length > 0 &&
                      !passwordValid && (
                        <p className="mt-2 text-xs text-red-400">
                          Password must contain at least 6
                          characters.
                        </p>
                      )}

                    {passwordValid && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-green-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Password length is valid.
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-2 block text-sm font-medium text-zinc-200"
                    >
                      Confirm New Password
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
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(
                            event.target.value,
                          );
                          setErrorMessage("");
                        }}
                        disabled={isUpdating}
                        required
                        className={`h-12 w-full rounded-xl border bg-zinc-900/70 pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                          confirmPassword.length > 0 &&
                          passwordsMatch
                            ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
                            : confirmPassword.length > 0
                              ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                              : "border-white/10 focus:border-green-500/60 focus:ring-green-500/10"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) => !value,
                          )
                        }
                        disabled={isUpdating}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-green-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Passwords match.
                      </p>
                    )}
                  </div>

                  {/* Update Password */}
                  <button
                    type="submit"
                    disabled={!formValid || isUpdating}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-500 hover:shadow-green-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none"
                  >
                    {isUpdating ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>
              )}

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}