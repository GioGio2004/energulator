"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  MapControls,
  PerspectiveCamera,
} from "@react-three/drei";
import type { MapControls as MapControlsImpl } from "three-stdlib";
import { Compass, Info, LocateFixed, MousePointer2, X } from "lucide-react";
import { Siland } from "@/components/game/models/Siland";
import { VillageAsset } from "@/components/game/models/VillageAsset";
import { Mountain } from "@/components/game/models/Mountain";

type Landmark = {
  name: string;
  description: string;
};

const LANDMARKS: Record<string, Landmark> = {
  "Harbor Village": {
    name: "Harbor Village",
    description: "A busy coastal settlement where islanders trade, build, and gather.",
  },
  "Cedar Quarter": {
    name: "Cedar Quarter",
    description: "A quiet neighborhood sheltered by the island's oldest trees.",
  },
  "Northwatch Peaks": {
    name: "Northwatch Peaks",
    description: "Snow-tipped mountains watching over Propare Island's northern coast.",
  },
  "Sunrise Ridge": {
    name: "Sunrise Ridge",
    description: "A rugged eastern range with the best view of the morning sea.",
  },
};

const buildings = [
  ["building-type-a.glb", -4, -2.5, 0],
  ["building-type-c.glb", 0, -3.5, 0.15],
  ["building-type-f.glb", 4.2, -2.4, -0.15],
  ["building-type-h.glb", -3.6, 3, Math.PI],
  ["building-type-k.glb", 1, 3.5, Math.PI],
  ["building-type-n.glb", 5.2, 2.4, Math.PI],
] as const;

const trees = [
  [-7, -4, 1.3], [-6, 4, 1.1], [-1.5, 6, 1.35], [7, 4.5, 1.2],
  [7.5, -4, 1.4], [-9, 1, 1.2], [9, 0, 1.1], [2.5, 6.5, 1.1],
] as const;

function Marker({ position, label, onSelect }: { position: [number, number, number]; label: string; onSelect: (label: string) => void }) {
  return (
    <Html position={position} center distanceFactor={18} zIndexRange={[20, 0]}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(label);
        }}
        className="group flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/85 p-1.5 pr-3 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <span className="grid size-7 place-items-center rounded-full bg-amber-300 text-slate-950">
          <LocateFixed size={15} aria-hidden="true" />
        </span>
        <span className="hidden sm:inline">{label}</span>
      </button>
    </Html>
  );
}

function Village({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <group position={[1, 1.45, 1]}>
      {[[-5, 0], [0, 0], [5, 0]].map(([x, z], index) => (
        <VillageAsset key={`path-a-${index}`} modelName="path-stones-long.glb" position={[x, 0.02, z]} rotation={[0, Math.PI / 2, 0]} scale={1.8} />
      ))}
      {[[-2.5, 0], [2.5, 0]].map(([x, z], index) => (
        <VillageAsset key={`path-b-${index}`} modelName="path-short.glb" position={[x, 0.03, z]} scale={1.7} />
      ))}
      {buildings.map(([modelName, x, z, rotation]) => (
        <VillageAsset key={modelName} modelName={modelName} position={[x, 0, z]} rotation={[0, rotation, 0]} scale={1.35} />
      ))}
      {trees.map(([x, z, scale], index) => (
        <VillageAsset key={`tree-${index}`} modelName={index % 3 === 0 ? "tree-large.glb" : "tree-small.glb"} position={[x, 0, z]} scale={scale} />
      ))}
      <VillageAsset modelName="fence-3x3.glb" position={[-4, 0, 4.2]} scale={1.25} />
      <VillageAsset modelName="planter.glb" position={[3, 0, 1.2]} scale={1.4} />
      <VillageAsset modelName="driveway-short.glb" position={[0, 0.02, -6]} scale={1.5} />
      <Marker position={[0, 5.5, -1]} label="Harbor Village" onSelect={onSelect} />
      <Marker position={[-6.5, 4, 4]} label="Cedar Quarter" onSelect={onSelect} />
    </group>
  );
}

function World({ onSelect, controlsRef }: { onSelect: (label: string) => void; controlsRef: React.RefObject<MapControlsImpl | null> }) {
  return (
    <>
      <color attach="background" args={["#9dc8d2"]} />
      <fog attach="fog" args={["#9dc8d2", 48, 92]} />
      <PerspectiveCamera makeDefault position={[35, 32, 38]} fov={38} near={0.1} far={180} />
      <MapControls
        ref={controlsRef}
        makeDefault
        target={[0, 0, 0]}
        minDistance={23}
        maxDistance={68}
        minPolarAngle={0.55}
        maxPolarAngle={1.3}
        enableDamping
        dampingFactor={0.08}
        screenSpacePanning={false}
      />
      <hemisphereLight intensity={1.25} color="#f6f1dc" groundColor="#617d75" />
      <directionalLight castShadow position={[20, 34, 18]} intensity={2.1} shadow-mapSize={[1024, 1024]} shadow-camera-far={90} shadow-camera-left={-35} shadow-camera-right={35} shadow-camera-top={35} shadow-camera-bottom={-35} />
      <Environment preset="dawn" environmentIntensity={0.35} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.25, 0]} receiveShadow>
        <circleGeometry args={[78, 64]} />
        <meshStandardMaterial color="#4e91a3" roughness={0.38} metalness={0.08} />
      </mesh>
      <Siland />
      <Mountain position={[-11, 1.15, -8]} scale={0.78} label="Northwatch Peaks" onSelect={onSelect} />
      <Mountain position={[12.5, 1.05, -5]} scale={0.58} label="Sunrise Ridge" color="#777b6d" onSelect={onSelect} />
      <Suspense fallback={null}>
        <Village onSelect={onSelect} />
      </Suspense>
      <ContactShadows position={[0, 1.2, 0]} opacity={0.35} scale={44} blur={2.5} far={18} />
    </>
  );
}

export default function GameMap() {
  const controlsRef = useRef<MapControlsImpl>(null);
  const [selected, setSelected] = useState<Landmark | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const selectLandmark = useCallback((label: string) => {
    setSelected(LANDMARKS[label] ?? { name: label, description: "A landmark on Propare Island." });
  }, []);

  const resetCamera = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.object.position.set(35, 32, 38);
    controls.target.set(0, 0, 0);
    controls.update();
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-sky-200 font-sans text-slate-950">
      <Canvas shadows dpr={[1, 1.6]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <World onSelect={selectLandmark} controlsRef={controlsRef} />
      </Canvas>

      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
        <div className="rounded-2xl border border-white/30 bg-slate-950/85 px-4 py-3 text-white shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">Explore</p>
          <h1 className="text-balance text-lg font-bold sm:text-xl">Propare Island</h1>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button type="button" onClick={resetCamera} aria-label="Reset camera" className="grid size-11 place-items-center rounded-full border border-white/30 bg-slate-950/85 text-white shadow-xl backdrop-blur-md transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
            <Compass size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setShowHelp((value) => !value)} aria-label="Show controls" aria-expanded={showHelp} className="grid size-11 place-items-center rounded-full border border-white/30 bg-slate-950/85 text-white shadow-xl backdrop-blur-md transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
            <Info size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {showHelp && (
        <div className="absolute right-4 top-20 max-w-64 rounded-2xl border border-white/20 bg-slate-950/90 p-4 text-sm leading-relaxed text-white shadow-2xl backdrop-blur-md sm:right-6 sm:top-24">
          <div className="flex items-center gap-2 font-semibold"><MousePointer2 size={17} aria-hidden="true" /> Island controls</div>
          <p className="mt-2 text-white/70">Drag to move, pinch or scroll to zoom, and use two fingers or right-drag to orbit.</p>
        </div>
      )}

      {selected && (
        <aside className="absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] rounded-2xl border border-white/25 bg-slate-950/90 p-4 text-white shadow-2xl backdrop-blur-lg sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-80">
          <button type="button" onClick={() => setSelected(null)} aria-label="Close landmark information" className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
            <X size={17} aria-hidden="true" />
          </button>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Landmark discovered</p>
          <h2 className="mt-1 pr-8 text-lg font-bold">{selected.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{selected.description}</p>
        </aside>
      )}

      {!selected && !showHelp && (
        <div className="pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-slate-950/80 px-4 py-2 text-xs font-medium text-white/80 shadow-xl backdrop-blur-md">
          Select a marker to discover the island
        </div>
      )}
    </main>
  );
}
