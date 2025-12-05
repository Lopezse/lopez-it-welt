"use client";

import Image from "next/image";

interface LinkedInIconProps {
  className?: string;
}

export default function LinkedInIcon({ className = "" }: LinkedInIconProps) {
  // Extrahiere Größe aus className (z.B. "h-4 w-4" -> 16px, "h-5 w-5" -> 20px)
  const getSize = () => {
    if (className.includes("h-4") || className.includes("w-4")) return 16;
    if (className.includes("h-5") || className.includes("w-5")) return 20;
    return 20; // Default
  };

  const size = getSize();
  
  // Entferne Größen-Klassen, da wir width/height direkt setzen
  const cleanedClassName = className
    .replace(/\b(h-\d+|w-\d+)\b/g, "")
    .trim();

  return (
    <div className={`inline-flex items-center justify-center ${cleanedClassName}`}>
      <Image
        src="/LinkedIn_icon.svg.webp"
        alt="LinkedIn"
        width={size}
        height={size}
        className="rounded"
      />
    </div>
  );
}

