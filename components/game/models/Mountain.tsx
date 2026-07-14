"use client";

import * as THREE from "three";
import React, { useEffect, useMemo, useState } from "react";
import { useGLTF, Html } from "@react-three/drei";
import type { ThreeElements, ThreeEvent } from "@react-three/fiber";

type GroupProps = ThreeElements["group"];

export type MountainProps = GroupProps & {
  /** Override material color. Defaults to warm gray #9ca3af */
  color?: string;
  /** Label text shown in the tooltip. Defaults to შხარა */
  label?: string;
};

export function Mountain({
  color = "#9ca3af",
  label = "შხარა",
  ...props
}: MountainProps) {
  const { scene } = useGLTF("/game-assets/mountain.gltf");
  const [showLabel, setShowLabel] = useState(false);

  // Clone so multiple instances are independent
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Apply shared material to all pyramid meshes
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.85,
          metalness: 0.0,
        });
      }
    });
  }, [clonedScene, color]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setShowLabel((prev) => !prev);
  };

  return (
    <group {...props} dispose={null}>
      <primitive object={clonedScene} onClick={handleClick} />

      {/* Tooltip — positioned above the mountain group */}
      {showLabel && (
        <Html
          position={[0, 2.5, 0]}
          center
          distanceFactor={8}
          zIndexRange={[100, 0]}
          occlude
        >
          <div
            className="
              bg-gray-900/95 text-white
              rounded-md px-4 py-2
              text-sm font-semibold
              shadow-xl shadow-black/40
              ring-1 ring-white/10
              backdrop-blur-sm
              cursor-pointer
              select-none
              transition-all duration-200
              hover:bg-gray-800/95
              whitespace-nowrap
            "
            onClick={() => setShowLabel(false)}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload("/game-assets/mountain.gltf");
