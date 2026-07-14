"use client";

import * as THREE from "three";
import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

type GroupProps = ThreeElements["group"];

export type IselandProps = GroupProps & {
  color?: string;
};

export function Iseland({ color = "#4ade80", ...props }: IselandProps) {
  const { scene } = useGLTF("/game-assets/iseland.gltf");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Safely apply color without destroying the Spline geometry mapping
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

useGLTF.preload("/game-assets/iseland.gltf");
