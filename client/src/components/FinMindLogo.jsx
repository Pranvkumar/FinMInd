/**
 * FinMindLogo.jsx — SVG Logo component
 *
 * Renders the FinMind brand mark: a cyan/teal infinity-brain
 * loop icon followed by "FinMind" text. Scalable via className.
 */

const FinMindLogo = ({ className = "h-10", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon — infinity/brain loop */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <defs>
          <linearGradient id="finmind-grad" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        {/* Outer infinity loop */}
        <path
          d="M32 32c-4-3.5-12-10-12-18c0-6.5 4.5-11 10-11c6.5 0 10 5.5 10 13c0 10-8 16-8 16s-8-6-8-16c0-7.5 3.5-13 10-13c5.5 0 10 4.5 10 11c0 8-8 14.5-12 18"
          stroke="url(#finmind-grad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 32c4 3.5 12 10 12 18c0 6.5-4.5 11-10 11c-6.5 0-10-5.5-10-13c0-10 8-16 8-16s8 6 8 16c0 7.5-3.5 13-10 13c-5.5 0-10-4.5-10-11c0-8 8-14.5 12-18"
          stroke="url(#finmind-grad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Text */}
      {showText && (
        <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          FinMind
        </span>
      )}
    </div>
  );
};

export default FinMindLogo;
