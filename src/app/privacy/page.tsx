import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "MatchPulse Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-5xl px-6 py-12">

      {/* ====================================================
          Header
      ==================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 p-8 md:p-12">

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-green-400"
          >
            <ArrowLeft size={16} />
            Back to MatchPulse
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
              <ShieldCheck
                size={28}
                className="text-green-400"
              />
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-white">
                Privacy Policy
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                MatchPulse
              </p>
            </div>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
        </div>
      </section>

      {/* ====================================================
          Content
      ==================================================== */}

      <article className="mt-8 rounded-3xl border border-white/10 bg-zinc-900/70 p-8 md:p-12">

        <p className="text-sm text-zinc-500">
          Last updated: August 19, 2026
        </p>

        <div className="mt-8 space-y-10 text-sm leading-7 text-zinc-400">

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              1. Introduction
            </h2>

            <p>
              MatchPulse is a football information platform providing live
              scores, fixtures, results, statistics, standings, team
              information and AI-powered football predictions.
            </p>

            <p className="mt-4">
              This Privacy Policy explains how information may be collected,
              used and protected when you use MatchPulse.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              2. Information We May Collect
            </h2>

            <p>
              Depending on the features you use, MatchPulse may process
              information associated with your account, such as your email
              address, authentication information, favourite teams and
              notification preferences.
            </p>

            <p className="mt-4">
              We may also process technical information necessary to operate
              and secure the platform, such as browser information, device
              information and basic usage data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              3. How Information Is Used
            </h2>

            <p>
              Information may be used to provide and improve MatchPulse
              services, authenticate users, maintain favourite teams,
              deliver requested notifications, protect the platform and
              improve the overall user experience.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              4. Third-Party Services
            </h2>

            <p>
              MatchPulse may rely on third-party services for football data,
              authentication, database infrastructure, analytics and
              artificial intelligence functionality.
            </p>

            <p className="mt-4">
              These services may process information according to their own
              privacy policies and applicable terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              5. AI Predictions
            </h2>

            <p>
              MatchPulse may use artificial intelligence to generate football
              predictions and analytical insights. Information relating to
              football fixtures and statistics may be processed by the
              services used to generate these predictions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              6. Data Security
            </h2>

            <p>
              We take reasonable technical and organisational measures to
              protect information handled by the platform. However, no
              internet-based service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              7. Data Retention
            </h2>

            <p>
              Information is retained only for as long as reasonably necessary
              to provide the relevant services, comply with applicable
              obligations and maintain the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              8. Your Rights
            </h2>

            <p>
              Depending on applicable law, you may have rights relating to
              personal information held about you, including rights to access,
              correct or request deletion of certain information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              9. Changes to This Policy
            </h2>

            <p>
              This Privacy Policy may be updated from time to time as
              MatchPulse develops and new features or services are introduced.
              Updated versions will be made available on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              10. Contact
            </h2>

            <p>
              If you have questions about this Privacy Policy or the handling
              of information by MatchPulse, please contact the MatchPulse
              project owner through the appropriate support channel.
            </p>
          </section>

        </div>
      </article>
    </main>
  );
}