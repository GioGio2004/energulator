"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import type { ThreeElements, ThreeEvent } from "@react-three/fiber";

type GroupProps = ThreeElements["group"];

export type MountainProps = GroupProps & {
  color?: string;
  label?: string;
  onSelect?: (label: string) => void;
};

const PEAKS = [
  { position: [0, 1.8, 0] as const, radius: 3.7, height: 7.2 },
  { position: [-3.2, 1.2, 1.3] as const, radius: 2.7, height: 5.4 },
  { position: [3, 1.1, 1] as const, radius: 2.5, height: 5 },
  { position: [0.8, 0.8, -2.4] as const, radius: 2.2, height: 4.3 },
];

export function Mountain({
  color = "#6f776f",
  label = "Highland Peaks",
  onSelect,
  ...props
}: MountainProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect?.(label);
  };

  return (
    <group
      {...props}
      onClick={handleClick}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {PEAKS.map((peak, index) => (
        <group key={index} position={peak.position}>
          <mesh castShadow receiveShadow rotation={[0, index * 0.72, 0]} scale={hovered ? 1.025 : 1}>
            <coneGeometry args={[peak.radius, peak.height, 7, 2]} />
            <meshStandardMaterial color={color} roughness={1} flatShading />
          </mesh>
          <mesh position={[0, peak.height * 0.28, 0]} rotation={[0, index * 0.72, 0]}>
            <coneGeometry args={[peak.radius * 0.34, peak.height * 0.3, 7]} />
            <meshStandardMaterial color="#e9eee8" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
      {hovered && (
        <Html position={[0, 7, 0]} center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/90 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
