"use client";

import { useParams } from "next/navigation";
import UtilitySortingGame from "@/components/game/UtilitySortingGame";

export default function PlayRoute() {
  const params = useParams();
  const moduleId = (params?.moduleId as string) || "module_electricity_1";
  const locale = (params?.locale as string) || "en";

  return (
    <div className="fixed inset-0 z-[100] bg-[#edf3eb] overflow-hidden flex flex-col">
      <UtilitySortingGame moduleId={moduleId} locale={locale} />
    </div>
  );
}
