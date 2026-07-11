import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/energular-onboarding-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/55" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="text-sm font-black text-[#2d5a27] tracking-[0.25em] uppercase">
          ⚡ ENERGULATOR
        </p>
        <SignUp />
      </div>
    </div>
  );
}
