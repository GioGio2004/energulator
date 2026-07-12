"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface GameItem {
  id: string;
  name: string;
  icon: string;
  category: "electricity" | "water" | "gas";
}

const ITEMS: GameItem[] = [
  { id: "1", name: "Television", icon: "📺", category: "electricity" },
  { id: "2", name: "Shower", icon: "🚿", category: "water" },
  { id: "3", name: "Gas Stove", icon: "🍳", category: "gas" },
  { id: "4", name: "Lightbulb", icon: "💡", category: "electricity" },
  { id: "5", name: "Radiator", icon: "🌡️", category: "gas" },
];

export default function UtilitySortingGame({ moduleId, locale }: { moduleId: string, locale: string }) {
  const router = useRouter();
  const completeLesson = useMutation(api.game.completeLesson);
  const updateActiveModule = useMutation(api.game.updateActiveModule);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const currentItem = ITEMS[currentIndex];

  // eslint-disable-next-line react-hooks/refs
  const handleCategorySelect = contextSafe((category: "electricity" | "water" | "gas", buttonElement: HTMLElement | null) => {
    if (!currentItem || isSubmitting) return;

    if (currentItem.category === category) {
      // Correct! Animate item dropping into the bucket
      if (buttonElement && itemRef.current) {
        const itemBounds = itemRef.current.getBoundingClientRect();
        const btnBounds = buttonElement.getBoundingClientRect();
        
        const deltaX = btnBounds.left + btnBounds.width / 2 - (itemBounds.left + itemBounds.width / 2);
        const deltaY = btnBounds.top + btnBounds.height / 2 - (itemBounds.top + itemBounds.height / 2);

        gsap.to(itemRef.current, {
          x: deltaX,
          y: deltaY,
          scale: 0.2,
          opacity: 0,
          rotation: 360,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            // Reset position instantly
            gsap.set(itemRef.current, { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 });
            
            if (currentIndex + 1 < ITEMS.length) {
              setCurrentIndex(currentIndex + 1);
            } else {
              handleGameComplete();
            }
          }
        });

        // Little bounce on the button
        gsap.fromTo(buttonElement, 
          { scale: 0.9 }, 
          { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
      }
    } else {
      // Incorrect! Shake the item
      if (itemRef.current) {
        gsap.fromTo(itemRef.current,
          { x: -10 },
          { x: 10, clearProps: "x", duration: 0.1, repeat: 3, yoyo: true, ease: "none" }
        );
      }
    }
  });

  const handleGameComplete = async () => {
    setIsFinished(true);
    setIsSubmitting(true);
    try {
      await completeLesson({ lessonId: moduleId, wattsEarned: 50 });
      // If this is the first module, unlock the second one for demo purposes
      if (moduleId === "module_electricity_1") {
        await updateActiveModule({ moduleId: "module_meter_1" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExit = () => {
    router.push(`/${locale}/dashboard`);
  };

  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-[#ffc800] rounded-full flex items-center justify-center mb-8 shadow-xl shadow-[#ffc800]/40 animate-bounce">
          <span className="text-6xl">🏆</span>
        </div>
        <h2 className="text-4xl font-black text-[#2d5a27] mb-4">Mission Complete!</h2>
        <p className="text-xl text-[#555] font-bold mb-8">+50 Watts Earned</p>
        <button
          onClick={handleExit}
          disabled={isSubmitting}
          className="bg-[#58cc02] border-b-[6px] border-[#46a302] hover:bg-[#61e002] active:border-b-0 active:translate-y-[6px] text-white font-black text-xl rounded-2xl py-4 px-12 transition-all"
        >
          {isSubmitting ? "SAVING..." : "CONTINUE"}
        </button>
      </div>
    );
  }

  const progress = (currentIndex / ITEMS.length) * 100;

  return (
    <div ref={containerRef} className="flex-1 flex flex-col bg-[#edf3eb]">
      {/* Header */}
      <div className="h-16 flex items-center px-4 pt-safe mt-4 justify-between">
        <button onClick={handleExit} className="text-3xl text-gray-400 hover:text-gray-600">
          ✕
        </button>
        <div className="flex-1 mx-4 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#58cc02] transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="w-8" /> {/* Balance spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-black text-[#2d5a27] mb-8 text-center">
          What kind of utility does this use?
        </h2>

        {/* Item Card */}
        <div 
          ref={itemRef}
          className="w-64 h-64 bg-white rounded-[2rem] border-4 border-gray-200 shadow-xl flex flex-col items-center justify-center p-6 mb-12"
        >
          <span className="text-8xl drop-shadow-md mb-4">{currentItem?.icon}</span>
          <span className="text-2xl font-bold text-gray-800 tracking-wide text-center">{currentItem?.name}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="pb-safe mb-8 px-6 grid grid-cols-3 gap-4">
        <button 
          onClick={(e) => handleCategorySelect("electricity", e.currentTarget)}
          className="flex flex-col items-center justify-center bg-[#ffc800] border-b-[6px] border-[#cc9e00] hover:brightness-110 active:border-b-0 active:translate-y-[6px] rounded-[1.5rem] p-4 transition-all"
        >
          <span className="text-4xl mb-2 drop-shadow-sm">⚡</span>
          <span className="text-xs font-black text-white tracking-wider">POWER</span>
        </button>

        <button 
          onClick={(e) => handleCategorySelect("water", e.currentTarget)}
          className="flex flex-col items-center justify-center bg-[#1cb0f6] border-b-[6px] border-[#1899d6] hover:brightness-110 active:border-b-0 active:translate-y-[6px] rounded-[1.5rem] p-4 transition-all"
        >
          <span className="text-4xl mb-2 drop-shadow-sm">💧</span>
          <span className="text-xs font-black text-white tracking-wider">WATER</span>
        </button>

        <button 
          onClick={(e) => handleCategorySelect("gas", e.currentTarget)}
          className="flex flex-col items-center justify-center bg-[#ff4b4b] border-b-[6px] border-[#ea1515] hover:brightness-110 active:border-b-0 active:translate-y-[6px] rounded-[1.5rem] p-4 transition-all"
        >
          <span className="text-4xl mb-2 drop-shadow-sm">🔥</span>
          <span className="text-xs font-black text-white tracking-wider">GAS</span>
        </button>
      </div>
    </div>
  );
}
