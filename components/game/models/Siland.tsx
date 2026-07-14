"use client";

import * as THREE from "three";
import { useMemo } from "react";
import type { ThreeElements } from "@react-three/fiber";

type GroupProps = ThreeElements["group"];

export type SilandProps = GroupProps & {
  color?: string;
};

const COAST = [
  [-21, -5], [-19, -12], [-13, -18], [-5, -20], [3, -19], [10, -17],
  [17, -12], [21, -5], [20, 3], [17, 11], [10, 17], [2, 20],
  [-7, 19], [-15, 15], [-20, 8], [-22, 1],
] as const;

function makeShape(scale: number) {
  const shape = new THREE.Shape();
  COAST.forEach(([x, y], index) => {
    const px = x * scale;
    const py = y * scale;
    if (index === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  });
  shape.closePath();
  return shape;
}

export function Siland({ color = "#75a95a", ...props }: SilandProps) {
  const layers = useMemo(() => {
    const create = (scale: number, depth: number, bevel: number) =>
      new THREE.ExtrudeGeometry(makeShape(scale), {
        depth,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: bevel,
        bevelThickness: bevel,
        curveSegments: 1,
      });

    return {
      rock: create(1, 1.8, 0.65),
      sand: create(0.94, 0.55, 0.5),
      grass: create(0.88, 0.65, 0.4),
    };
  }, []);

  return (
    <group {...props} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={layers.rock} castShadow receiveShadow position={[0, 0, -1.5]}>
        <meshStandardMaterial color="#736b59" roughness={1} flatShading />
      </mesh>
      <mesh geometry={layers.sand} receiveShadow position={[0, 0, 0.05]}>
        <meshStandardMaterial color="#d8c388" roughness={1} flatShading />
      </mesh>
      <mesh geometry={layers.grass} castShadow receiveShadow position={[0, 0, 0.58]}>
        <meshStandardMaterial color={color} roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}
