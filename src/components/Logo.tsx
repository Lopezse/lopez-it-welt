import Image from "next/image";

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
        <Image
          src="/logo-lw-mark.svg"
          alt="Lopez IT Welt Logo"
          width={config.iconSize}
          height={config.iconSize}
          style={{
            display: "block",
            width: `${config.iconSize}px`,
            height: `${config.iconSize}px`,
          }}
          priority={size === "large"}
        />
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
