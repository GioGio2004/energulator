"use client";

import * as THREE from "three";
import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

type GroupProps = ThreeElements["group"];

export type VillageAssetProps = GroupProps & {
  modelName: string;
};

export function VillageAsset({ modelName, ...props }: VillageAssetProps) {
  // Pass the full path using the renamed folder
  const path = `/GLB-format/${modelName}`;
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Retain original colors but ensure they cast/receive shadows
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).color) {
           const mat = mesh.material as THREE.MeshStandardMaterial;
           mesh.material = new THREE.MeshStandardMaterial({
             color: mat.color,
             map: mat.map,
             roughness: 0.8,
           });
        }
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} {...props} dispose={null} />;
}
