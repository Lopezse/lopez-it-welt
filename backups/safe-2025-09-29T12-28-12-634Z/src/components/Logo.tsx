interface LogoProps {
  size?: "small" | "medium" | "large";
  showTagline?: boolean;
  className?: string;
}

export default function Logo({ size = "medium", showTagline = true, className = "" }: LogoProps) {
  const sizeConfig = {
    small: {
      iconSize: 32,
      fontSize: 16,
      taglineSize: 10,
      gap: 8,
    },
    medium: {
      iconSize: 50,
      fontSize: 24,
      taglineSize: 12,
      gap: 12,
    },
    large: {
      iconSize: 100,
      fontSize: 48,
      taglineSize: 20,
      gap: 16,
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`logo-container size-${size} ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${config.gap}px`,
      }}
    >
      {/* LW Icon */}
      <div
        className="logo-icon"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: `${config.iconSize}px`,
          width: `${config.iconSize}px`,
          flexShrink: 0,
        }}
      >
        <svg
          width={config.iconSize}
          height={config.iconSize}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007BFF" />
              <stop offset="100%" stopColor="#0056B3" />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007BFF" />
              <stop offset="100%" stopColor="#0056B3" />
            </linearGradient>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LW Quadrat */}
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="20"
            ry="20"
            fill="url(#blueGradient)"
            filter="url(#neonGlow)"
          />
          <text
            x="50"
            y="60"
            fontFamily="Montserrat, Arial, sans-serif"
            fontSize="36"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
            textRendering="optimizeLegibility"
          >
            LW
          </text>
        </svg>
      </div>

      {/* Text Content */}
      <div
        className="logo-text"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          className="logo-main"
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontSize: `${config.fontSize}px`,
            fontWeight: "600",
            margin: 0,
            padding: 0,
            lineHeight: "1.1",
          }}
        >
          <span className="logo-lopez" style={{ color: "#FFD700" }}>
            Lopez
          </span>{" "}
          <span
            className="logo-itwelt"
            style={{
              background: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: "700",
              color: "#007BFF",
              display: "inline-block",
            }}
          >
            IT Welt
          </span>
        </div>

        {showTagline && (
          <div
            className="logo-tagline"
            style={{
              fontFamily: "Montserrat, Arial, sans-serif",
              fontSize: `${config.taglineSize}px`,
              fontWeight: "300",
              color: "#666666",
              margin: 0,
              padding: 0,
              marginTop: "2px",
              lineHeight: "1.0",
            }}
          >
            Digitale Lösungen. Global. Sicher.
          </div>
        )}
      </div>
    </div>
  );
}
