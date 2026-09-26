
import { useEffect, useRef, useState } from "react";

export default function AnimatedSun({
  text = "W trakcie...",
  textTimeout = "Koniec",
  size = 260,
  speed = 0.35,
  timeout = 5000,
}) {
  const svgRef = useRef(null);
  const rotationRef = useRef(0);
  const frameRef = useRef(null);
  const lastTimeRef = useRef(null);

  const [isFinished, setIsFinished] = useState(false);

  const rays = [
    { length: 34, width: 13, color: "#FFD84A", offset: 0 },
    { length: 43, width: 11, color: "#FFC928", offset: 45 },
    { length: 37, width: 15, color: "#FFB800", offset: 90 },
    { length: 48, width: 10, color: "#FFE66D", offset: 135 },
    { length: 40, width: 12, color: "#FFD02E", offset: 180 },
    { length: 45, width: 14, color: "#FFBE18", offset: 225 },
    { length: 35, width: 11, color: "#FFE15A", offset: 270 },
    { length: 44, width: 13, color: "#FFC21C", offset: 315 },
  ];

  // Kończymy animację po timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinished(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  // Obrót
  useEffect(() => {
    if (isFinished) {
      return;
    }

    const animate = (time) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      rotationRef.current += (delta / 1000) * speed * 360;

      const rotatingGroup =
        svgRef.current?.querySelector("[data-sun-rotation]");

      if (rotatingGroup) {
        rotatingGroup.setAttribute(
          "transform",
          `rotate(${rotationRef.current} 130 130)`
        );
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [speed, isFinished]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 260 260"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={isFinished ? textTimeout : text}
    >
      <defs>
        <radialGradient
          id="sunGradient"
          cx="35%"
          cy="30%"
          r="75%"
        >
          <stop
            offset="0%"
            stopColor={isFinished ? "#FFE0D8" : "#FFF7A8"}
          />
          <stop
            offset="28%"
            stopColor={isFinished ? "#FFB09E" : "#FFE86A"}
          />
          <stop
            offset="58%"
            stopColor={isFinished ? "#FF6B4A" : "#FFD02E"}
          />
          <stop
            offset="82%"
            stopColor={isFinished ? "#E83E24" : "#FFB800"}
          />
          <stop
            offset="100%"
            stopColor={isFinished ? "#B91C1C" : "#F59E00"}
          />
        </radialGradient>

        <filter
          id="sunGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            stdDeviation="8"
            result="blur"
          />

          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 1
              0 1 0 0 0.65
              0 0 1 0 0
              0 0 0 0.45 0
            "
          />
        </filter>
      </defs>

      {/* Cała obracająca się część */}
      <g data-sun-rotation>
        {/* Poświata */}
        <circle
          cx="130"
          cy="130"
          r="67"
          fill={isFinished ? "#FF3B22" : "#FFD42A"}
          opacity="0.35"
          filter="url(#sunGlow)"
        />

        {/* Promienie */}
        {rays.map((ray, index) => {
          const angle = (ray.offset * Math.PI) / 180;

          const innerRadius = 58;
          const outerRadius = 58 + ray.length;

          return (
            <line
              key={index}
              x1={130 + Math.cos(angle) * innerRadius}
              y1={130 + Math.sin(angle) * innerRadius}
              x2={130 + Math.cos(angle) * outerRadius}
              y2={130 + Math.sin(angle) * outerRadius}
              stroke={
                isFinished
                  ? [
                      "#FF8066",
                      "#FF6245",
                      "#FF4930",
                      "#E83E24",
                      "#FF7358",
                      "#D92D20",
                      "#FF947D",
                      "#C92A1D",
                    ][index]
                  : ray.color
              }
              strokeWidth={ray.width}
              strokeLinecap="round"
            />
          );
        })}

        {/* Środek słońca */}
        <circle
          cx="130"
          cy="130"
          r="58"
          fill="url(#sunGradient)"
        />

        {/* Highlight */}
        <ellipse
          cx="112"
          cy="108"
          rx="24"
          ry="17"
          fill={isFinished ? "#FFE1DB" : "#FFF9B0"}
          opacity="0.3"
        />
      </g>

      {/* Napis pozostaje nieruchomy */}
      <text
        x="130"
        y="130"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="22"
        fontWeight="800"
        letterSpacing="1"
        fill={isFinished ? "#7F1D1D" : "#8A5600"}
        pointerEvents="none"
      >
        {isFinished ? textTimeout : text}
      </text>
    </svg>
  );
}

