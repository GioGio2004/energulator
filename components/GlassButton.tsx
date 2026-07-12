import React, { ButtonHTMLAttributes, forwardRef } from "react";

export type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`relative flex items-center justify-center rounded-[27.5px] px-8 py-3 font-medium transition-all md:hover:scale-[1.02] active:scale-[0.98] ${className}`}
        style={{
          minWidth: "166px",
          minHeight: "55px",
          background:
            "linear-gradient(135deg, rgba(217, 217, 217, 0.5) 0%, rgba(255, 255, 255, 0.2) 99%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0px 20px 40px 0px rgba(0, 0, 0, 0.1)",
        }}
        {...props}
      >
        {/* Inner Border Stroke Layer */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[27.5px]"
          style={{
            padding: "1px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(153,153,153,0.6) 100%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        <span className="relative z-10">{children}</span>
      </button>
    );
  },
);

GlassButton.displayName = "GlassButton";

export default GlassButton;
