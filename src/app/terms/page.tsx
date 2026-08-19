import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "MatchPulse Terms of Service",
};

export default function TermsPage() {
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
              <FileText
                size={28}
                className="text-green-400"
              />
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-white">
                Terms of Service
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
              1. Acceptance of Terms
            </h2>

            <p>
              By accessing or using MatchPulse, you agree to these Terms of
              Service. If you do not agree with these terms, you should not
              use the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              2. MatchPulse Services
            </h2>

            <p>
              MatchPulse provides football-related information including
              live scores, fixtures, results, statistics, standings,
              team information and AI-generated football predictions.
            </p>

            <p className="mt-4">
              Features may change, be temporarily unavailable or be
              discontinued as the platform evolves.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              3. Accuracy of Information
            </h2>

            <p>
              MatchPulse obtains football information from external data
              providers and other services. While reasonable efforts may be
              made to present accurate information, MatchPulse does not
              guarantee that all information will always be complete, current
              or error-free.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              4. AI Predictions Disclaimer
            </h2>

            <p>
              AI-generated predictions are informational and entertainment
              features only. They are not guarantees of match outcomes,
              financial returns or future performance.
            </p>

            <p className="mt-4">
              Users should not treat MatchPulse predictions as professional
              financial, investment or betting advice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              5. Responsible Use
            </h2>

            <p>
              MatchPulse should be used responsibly. Users are responsible
              for complying with all laws and regulations applicable to them
              when using football information or prediction features.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              6. User Accounts
            </h2>

            <p>
              Where account functionality is available, users are responsible
              for maintaining the security of their account credentials and
              for activity performed through their account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              7. Acceptable Use
            </h2>

            <p>
              Users must not misuse MatchPulse, interfere with its operation,
              attempt to gain unauthorised access, abuse APIs or services,
              scrape restricted information, or use the platform for unlawful
              purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              8. Intellectual Property
            </h2>

            <p>
              MatchPulse branding, interface design, software and original
              content are protected by applicable intellectual property laws.
              Third-party football data, logos and other materials remain the
              property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              9. Availability
            </h2>

            <p>
              MatchPulse is provided on an availability basis. We do not
              guarantee uninterrupted access, permanent availability of any
              feature or uninterrupted operation of third-party services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              10. Limitation of Liability
            </h2>

            <p>
              To the extent permitted by applicable law, MatchPulse and its
              operators are not responsible for losses arising from reliance
              on football information, AI predictions, service interruptions,
              third-party data or other information provided through the
              platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              11. Changes to These Terms
            </h2>

            <p>
              These Terms of Service may be updated as MatchPulse develops.
              Continued use of the platform following an update constitutes
              acceptance of the revised terms to the extent permitted by
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              12. Contact
            </h2>

            <p>
              Questions regarding these Terms of Service can be directed to
              the MatchPulse project owner through the appropriate support
              channel.
            </p>
          </section>

        </div>
      </article>
    </main>
  );
}