import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  MapPin,
  Send,
  UserRound,
} from "lucide-react";

export const metadata = {
  title: "Contact",
  description: "Contact MatchPulse and its creator.",
};

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-5xl px-6 py-12">

      {/* ====================================================
          Header
      ==================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 p-8 md:p-12">

        {/* Glow */}

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative">

          {/* Back */}

          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-green-400"
          >
            <ArrowLeft size={16} />

            Back to MatchPulse
          </Link>

          {/* Title */}

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
              <Mail
                size={28}
                className="text-green-400"
              />
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-white">
                Contact
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                MatchPulse
              </p>
            </div>

          </div>

          {/* Divider */}

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        </div>
      </section>

      {/* ====================================================
          Content
      ==================================================== */}

      <div className="mt-8 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">

        {/* ==================================================
            Creator
            ================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-8">

          {/* Glow */}

          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative">

            {/* Section Icon */}

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
              <UserRound
                size={22}
                className="text-green-400"
              />
            </div>

            {/* Photo */}

            <div className="relative mx-auto mt-8 h-44 w-44 overflow-hidden rounded-3xl border border-white/10 bg-zinc-800 shadow-2xl shadow-black/30">

              {/* ==================================================
                  PHOTO PLACEHOLDER

                  Replace locally with:

                  public/images/andile-placeholder.jpg
                  ================================================== */}

              <Image
                src="/images/andile-placeholder.jpg"
                alt="Andile Mchunu"
                fill
                className="object-cover"
                sizes="176px"
              />

            </div>

            {/* Identity */}

            <div className="mt-6 text-center">

              <h2 className="text-2xl font-black tracking-tight text-white">
                Andile Mchunu
              </h2>

              <p className="mt-1 text-sm font-medium text-green-400">
                Founder & Developer
              </p>

            </div>

            {/* Divider */}

            <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* About */}

            <div className="space-y-4 text-sm leading-7 text-zinc-400">

              <p>
                MatchPulse was created by Andile Mchunu as a project that
                brings together a passion for football and a growing journey
                in software development.
              </p>

              <p>
                The idea behind MatchPulse is simple: create a modern football
                platform where fans can follow live scores, fixtures, results,
                statistics, standings and intelligent match insights in one
                place.
              </p>

              <p>
                Built from the ground up, MatchPulse continues to evolve with
                the goal of delivering a fast, modern and useful football
                experience.
              </p>

            </div>

            {/* Location */}

            <div className="mt-7 flex items-center justify-center gap-2 text-sm text-zinc-500">

              <MapPin
                size={15}
                className="text-green-400"
              />

              South Africa - KwaZulu Natal - Howick

            </div>

          </div>
        </section>

        {/* ==================================================
            Contact Form
            ================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-8">

          {/* Glow */}

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative">

            {/* Form Header */}

            <div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
                <Mail
                  size={22}
                  className="text-green-400"
                />
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-tight text-white">
                Send a Message
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Have feedback, a question, a bug report or an idea for
                MatchPulse? Send a message below.
              </p>

            </div>

            {/* Form */}

            <form
              action="/api/contact"
              method="POST"
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
                  placeholder="Your name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-green-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-green-500/10"
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
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-green-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-green-500/10"
                />

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
                  placeholder="What's this about?"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-green-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-green-500/10"
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
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-green-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-green-500/10"
                />

              </div>

              {/* Submit */}

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-500 hover:shadow-green-500/20 active:translate-y-0"
              >

                <Send
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

                Send Message

              </button>

            </form>

          </div>
        </section>

      </div>
    </main>
  );
}