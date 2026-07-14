"use client";

import * as THREE from "three";
import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

type GroupProps = ThreeElements["group"];

export type SilandProps = GroupProps & {
  color?: string;
};

export function Siland({ color = "#4ade80", ...props }: SilandProps) {
  const { scene } = useGLTF("/game-assets/siland_1.gltf");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.8,
          });
        }
      }
    });
  }, [clonedScene, color]);

  return <primitive object={clonedScene} {...props} dispose={null} />;
}

if (typeof window !== "undefined") {
  useGLTF.preload(`${window.location.origin}/game-assets/siland_1.gltf`);
}
