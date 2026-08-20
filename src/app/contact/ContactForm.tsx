"use client";

import { useState } from "react";
import {
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ContactForm() {
  const [captcha, setCaptcha] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const captchaValid = captcha.trim() === "MatchPulse";

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const nameValid = name.trim().length >= 2;
  const subjectValid = subject.trim().length >= 2;
  const messageValid =
    message.trim().length >= 10 &&
    message.trim().length <= 5000;

  const formValid =
    nameValid &&
    emailValid &&
    subjectValid &&
    messageValid &&
    captchaValid;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!nameValid) {
      setErrorMessage("Please enter a valid name.");
      return;
    }

    if (!emailValid) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!subjectValid) {
      setErrorMessage("Please enter a valid subject.");
      return;
    }

    if (message.trim().length < 10) {
      setErrorMessage(
        "Your message must contain at least 10 characters."
      );
      return;
    }

    if (message.trim().length > 5000) {
      setErrorMessage(
        "Your message cannot exceed 5000 characters."
      );
      return;
    }

    if (!captchaValid) {
      setErrorMessage(
        "Please type MatchPulse exactly as shown."
      );
      return;
    }

    try {
      setIsSending(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          captcha: captcha.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to send your message."
        );
      }

      setSuccessMessage(
        "Your message has been sent successfully. Thank you for contacting MatchPulse."
      );

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setCaptcha("");
    } catch (error) {
      console.error("Contact form error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending your message."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5"
    >
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          disabled={isSending}
          className={`h-12 w-full rounded-xl border bg-white/[0.03] px-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:bg-white/[0.05] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            name.length > 0 && nameValid
              ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
              : name.length > 0
                ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                : "border-white/10 focus:border-green-500/60 focus:ring-green-500/10"
          }`}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          disabled={isSending}
          className={`h-12 w-full rounded-xl border bg-white/[0.03] px-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:bg-white/[0.05] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            email.length > 0 && emailValid
              ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
              : email.length > 0
                ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                : "border-white/10 focus:border-green-500/60 focus:ring-green-500/10"
          }`}
        />

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

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Subject
        </label>

        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="What's this about?"
          disabled={isSending}
          className={`h-12 w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:bg-white/[0.05] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            subject.length > 0 && subjectValid
              ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
              : subject.length > 0
                ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                : "border-white/10 focus:border-green-500/60 focus:ring-green-500/10"
          }`}
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Message
        </label>

        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your message..."
          disabled={isSending}
          className={`w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none transition-all placeholder:text-zinc-600 focus:bg-white/[0.05] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            message.length > 0 && messageValid
              ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
              : message.length > 0
                ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                : "border-white/10 focus:border-green-500/60 focus:ring-green-500/10"
          }`}
        />

        <p className="mt-2 text-xs text-zinc-600">
          {message.length}/5000 characters
        </p>
      </div>

      {/* Captcha */}
      <div>
        <label
          htmlFor="captcha"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Verification
        </label>

        <div className="mb-3 flex items-center gap-3 rounded-xl border border-green-500/10 bg-green-500/5 px-4 py-3">
          <ShieldCheck
            size={18}
            className="shrink-0 text-green-400"
          />

          <p className="text-sm text-zinc-400">
            Type{" "}
            <span className="font-bold text-green-400">
              MatchPulse
            </span>{" "}
            below to verify you are human.
          </p>
        </div>

        <input
          id="captcha"
          name="captcha"
          type="text"
          required
          value={captcha}
          onChange={(event) => setCaptcha(event.target.value)}
          placeholder="Type MatchPulse"
          autoComplete="off"
          disabled={isSending}
          className={`h-12 w-full rounded-xl border bg-white/[0.03] px-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:bg-white/[0.05] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            captcha.length > 0 && captchaValid
              ? "border-green-500/60 focus:border-green-500/60 focus:ring-green-500/10"
              : captcha.length > 0
                ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                : "border-white/10 focus:border-green-500/60 focus:ring-green-500/10"
          }`}
        />

        {captcha.length > 0 && !captchaValid && (
          <p className="mt-2 text-xs text-red-400">
            Please type MatchPulse exactly as shown.
          </p>
        )}

        {captchaValid && (
          <p className="mt-2 text-xs text-green-400">
            Verification successful.
          </p>
        )}
      </div>

      {/* Validation Debug */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Form Validation
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <p className={nameValid ? "text-green-400" : "text-red-400"}>
            {nameValid ? "✓" : "✗"} Name
          </p>

          <p className={emailValid ? "text-green-400" : "text-red-400"}>
            {emailValid ? "✓" : "✗"} Email
          </p>

          <p
            className={
              subjectValid ? "text-green-400" : "text-red-400"
            }
          >
            {subjectValid ? "✓" : "✗"} Subject
          </p>

          <p
            className={
              messageValid ? "text-green-400" : "text-red-400"
            }
          >
            {messageValid ? "✓" : "✗"} Message
          </p>

          <p
            className={
              captchaValid ? "text-green-400" : "text-red-400"
            }
          >
            {captchaValid ? "✓" : "✗"} Verification
          </p>

          <p
            className={
              formValid ? "text-green-400" : "text-red-400"
            }
          >
            {formValid ? "✓" : "✗"} Form Ready
          </p>
        </div>
      </div>

      {/* Error */}
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

      {/* Success */}
      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 bg-green-500/5 px-4 py-3">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-green-400"
          />

          <p className="text-sm leading-6 text-green-400">
            {successMessage}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!formValid || isSending}
        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-500 hover:shadow-green-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none"
      >
        {isSending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending...
          </>
        ) : (
          <>
            <Send
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}