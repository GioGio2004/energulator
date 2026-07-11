import type { OnboardingData } from "../OnboardingFlow";

export default function Step1({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (d: OnboardingData) => void;
}) {
  const tariffs = [
    "Standard Regional Rate",
    "Time-of-Use (TOU)",
    "Tiered Rate Plan",
    "Net Energy Metering (NEM)",
    "Fixed Rate Plan",
    "Seasonal Rate",
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="inline-flex items-center gap-2 bg-[#2d5a27]/10 rounded-full px-3 py-1 mb-3">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-bold text-[#2d5a27] uppercase tracking-widest">
            Energy Profile
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] leading-tight mb-2">
          What's your current energy tariff?
        </h2>
        <p className="text-base sm:text-lg text-[#555] leading-relaxed">
          Most households are on the Standard Regional Rate — we've pre-selected
          it for you.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="tariff-select"
          className="text-base font-bold text-[#1a1a1a]"
        >
          Energy Tariff
        </label>
        <div className="relative">
          <select
            id="tariff-select"
            value={data.tariff}
            onChange={(e) => setData({ ...data, tariff: e.target.value })}
            className="w-full appearance-none bg-white border-2 border-[#2d5a27]/25 focus:border-[#2d5a27] rounded-2xl px-4 py-4 text-lg font-semibold text-[#1a1a1a] outline-none cursor-pointer transition-all shadow-sm"
          >
            {tariffs.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2d5a27]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-[#f0f7ee] border border-[#2d5a27]/20 rounded-2xl p-4 flex gap-3 items-start">
        <span className="text-xl mt-0.5">✅</span>
        <div>
          <p className="font-bold text-[#1a1a1a] text-sm">
            Smart Default Applied
          </p>
          <p className="text-sm text-[#555] mt-0.5 leading-relaxed">
            We pre-selected the most common tariff for your region. Change it
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
