interface MatchPulseLogoProps {
  className?: string;
}

export default function MatchPulseLogo({
  className = "h-14 w-14",
}: MatchPulseLogoProps) {
  return (
    <div className={`relative ${className}`}>

      {/* Glow */}

      <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-xl transition-all duration-500" />

      {/* Glass Card */}

      <div className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 shadow-2xl" />

      <svg
        viewBox="0 0 64 64"
        className="relative h-full w-full p-2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>

          <linearGradient
            id="matchPulseGradient"
            x1="0"
            y1="0"
            x2="64"
            y2="64"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4ADE80" />
            <stop
              offset="1"
              stopColor="#16A34A"
            />
          </linearGradient>

          <filter id="glow">

            <feGaussianBlur
              stdDeviation="1.2"
              result="blur"
            />

            <feMerge>

              <feMergeNode in="blur" />

              <feMergeNode in="SourceGraphic" />

            </feMerge>

          </filter>

        </defs>

        {/* Angular M */}

        <path
          d="M10 46 L22 18 L32 34 L42 18 L54 46"
          stroke="url(#matchPulseGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulse */}

        <path
          d="M20 46H26L31 35L36 50L40 40H49"
          stroke="#4ADE80"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Football */}

        <circle
          cx="52"
          cy="40"
          r="4.5"
          fill="#4ADE80"
          filter="url(#glow)"
        />

        <circle
          cx="52"
          cy="40"
          r="2"
          fill="#FFFFFF"
        />

      </svg>

    </div>
  );
}