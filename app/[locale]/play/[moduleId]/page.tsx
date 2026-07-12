"use client";

import { useParams } from "next/navigation";
import UtilitySortingGame from "@/components/game/UtilitySortingGame";
import RoomExplorer from "@/components/game/RoomExplorer";
import HouseGame from "@/components/game/steps/secondstep";

export default function PlayRoute() {
  const params = useParams();
  const moduleId = (params?.moduleId as string) || "module_electricity_1";
  const locale = (params?.locale as string) || "en";

  // Level 1 — Spline Room Explorer
  if (moduleId === "module_electricity_1") {
    return (
      <div className="fixed inset-0 z-[100] overflow-hidden">
        <RoomExplorer />
      </div>
    );
  }

  // Level 2 — The Whole House
  if (moduleId === "module_meter_1") {
    return (
      <div className="fixed inset-0 z-[100] overflow-hidden flex flex-col">
        <HouseGame />
      </div>
    );
  }

  // Fallback for all other modules
  return (
    <div className="fixed inset-0 z-[100] bg-[#edf3eb] overflow-hidden flex flex-col">
      <UtilitySortingGame moduleId={moduleId} locale={locale} />
    </div>
  );
}
