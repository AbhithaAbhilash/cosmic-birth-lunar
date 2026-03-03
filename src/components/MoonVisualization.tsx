import { motion } from "framer-motion";

interface MoonVisualizationProps {
  phase: number; // 0-1
  phaseName: string;
}

const MoonVisualization = ({ phase }: MoonVisualizationProps) => {
  // Calculate the shadow overlay based on phase
  // phase 0 = new moon (fully dark), 0.5 = full moon (fully lit)
  const angle = phase * 360;

  // Determine which side is lit and the curve of the terminator
  const getShadowPath = () => {
    const r = 100; // radius
    const cx = 100;
    const cy = 100;

    if (phase < 0.01 || phase > 0.99) {
      // New moon - fully dark
      return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`;
    }

    if (phase > 0.49 && phase < 0.51) {
      // Full moon - no shadow
      return "";
    }

    // Calculate terminator curve
    const terminatorX = Math.cos(angle * (Math.PI / 180)) * r;

    if (phase < 0.5) {
      // Waxing - shadow on the left, shrinking
      const sweep = phase < 0.25 ? 1 : 0;
      return `M ${cx} ${cy - r} A ${Math.abs(terminatorX)} ${r} 0 0 ${sweep} ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`;
    } else {
      // Waning - shadow growing from the right
      const adjustedAngle = (phase - 0.5) * 360;
      const waneX = Math.cos(adjustedAngle * (Math.PI / 180)) * r;
      const sweep = phase < 0.75 ? 0 : 1;
      return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${Math.abs(waneX)} ${r} 0 0 ${sweep} ${cx} ${cy - r}`;
    }
  };

  const shadowPath = getShadowPath();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative float-animation"
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full moon-glow" style={{ margin: "-20px" }} />
      
      <svg
        viewBox="0 0 200 200"
        className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 drop-shadow-2xl"
      >
        <defs>
          {/* Moon surface texture gradient */}
          <radialGradient id="moonSurface" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#f5f0e0" />
            <stop offset="50%" stopColor="#e8dfc8" />
            <stop offset="100%" stopColor="#d4c9a8" />
          </radialGradient>
          
          {/* Crater patterns */}
          <radialGradient id="crater1" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#c8bda0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <filter id="moonBlur">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Moon base */}
        <circle cx="100" cy="100" r="100" fill="url(#moonSurface)" filter="url(#glow)" />
        
        {/* Crater details */}
        <circle cx="65" cy="55" r="12" fill="url(#crater1)" opacity="0.4" />
        <circle cx="120" cy="80" r="18" fill="url(#crater1)" opacity="0.3" />
        <circle cx="85" cy="120" r="10" fill="url(#crater1)" opacity="0.35" />
        <circle cx="140" cy="50" r="8" fill="url(#crater1)" opacity="0.25" />
        <circle cx="50" cy="100" r="14" fill="url(#crater1)" opacity="0.3" />
        <circle cx="110" cy="140" r="11" fill="url(#crater1)" opacity="0.28" />
        <circle cx="75" cy="75" r="6" fill="url(#crater1)" opacity="0.2" />
        <circle cx="130" cy="115" r="9" fill="url(#crater1)" opacity="0.22" />

        {/* Shadow overlay */}
        {shadowPath && (
          <path
            d={shadowPath}
            fill="hsl(230, 25%, 4%)"
            opacity="0.92"
            filter="url(#moonBlur)"
          />
        )}

        {/* Subtle rim light */}
        <circle
          cx="100"
          cy="100"
          r="98"
          fill="none"
          stroke="hsl(45, 60%, 85%)"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>
    </motion.div>
  );
};

export default MoonVisualization;
