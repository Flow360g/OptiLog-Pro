"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 188, 239)",
  gradientBackgroundEnd = "rgb(99, 133, 255)",
  firstColor = "18, 113, 255",
  secondColor = "108, 188, 239",
  thirdColor = "99, 133, 255",
  fourthColor = "20, 184, 166",
  children,
  className,
  interactive = true,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactiveRef.current) return;

      const { left, top, width, height } =
        interactiveRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      interactiveRef.current.style.setProperty("--mouse-x", x.toString());
      interactiveRef.current.style.setProperty("--mouse-y", y.toString());
    };

    const element = interactiveRef.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [interactive]);

  return (
    <div
      className={cn(
        "relative h-screen flex items-center justify-center overflow-hidden",
        className
      )}
      ref={interactiveRef}
    >
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_var(--mouse-x,0.5)_var(--mouse-y,0.5),rgba(var(--first-color),0.1)_0%,rgba(var(--first-color),0)_50%)] transition-all duration-500"></div>
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(to bottom right, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(at 27% 37%, rgb(${firstColor}) 0px, transparent 50%),
              radial-gradient(at 97% 21%, rgb(${secondColor}) 0px, transparent 50%),
              radial-gradient(at 52% 99%, rgb(${thirdColor}) 0px, transparent 50%),
              radial-gradient(at 10% 29%, rgb(${fourthColor}) 0px, transparent 50%)
            `,
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 w-full h-full animate-pulse-slow mix-blend-overlay">
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(at 27% 37%, rgb(${firstColor}) 0px, transparent 50%),
                  radial-gradient(at 97% 21%, rgb(${secondColor}) 0px, transparent 50%),
                  radial-gradient(at 52% 99%, rgb(${thirdColor}) 0px, transparent 50%),
                  radial-gradient(at 10% 29%, rgb(${fourthColor}) 0px, transparent 50%)
                `,
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};