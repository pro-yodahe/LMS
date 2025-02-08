"use client";
import { useEffect, useState } from "react";

export const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);

  
  useEffect(() => {
    if (typeof window !== "undefined" && isHovered) {
      const sparkles = document.querySelectorAll(".sparkle");
      sparkles.forEach((sparkle) => {
        sparkle.setAttribute(
          "style",
          `top: ${Math.random() * 80}%; 
          left: ${Math.random() * 80}%; 
          transform: rotate(${Math.random() * 360}deg);`
        );
      });
    }
  }, [isHovered]);

  return (
    <div
      className="group relative flex items-center space-x-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated particles with dynamic movement */}
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className={`sparkle absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full 
            opacity-0 transition-all duration-1000 ${isHovered ? "group-hover:opacity-100" : ""} 
            animate-particle-${i % 3}`}
        />
      ))}

      {/* Main logo GIF container without animation */}
      <div className="relative">
        <img
          src="/logo.gif"
          alt="Yegna School logo"
          className="drop-shadow-lg hover:drop-shadow-xl transition-all duration-300 z-10 relative"
        />
      </div>

      {/* Animated and styled text with unique font and effects */}
      <span
        className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 
        bg-clip-text text-transparent relative transition-all duration-500 group-hover:translate-x-1
        animate-text-glow font-serif" // Changed to a serif font
      >
        Yegna
        <span
          className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400 
          transition-all duration-500 group-hover:w-full group-hover:delay-300"
        />
      </span>
    </div>
  );
};
