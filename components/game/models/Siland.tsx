"use client";

import * as THREE from "three";
import { useMemo } from "react";
import type { ThreeElements } from "@react-three/fiber";

type GroupProps = ThreeElements["group"];

export type SilandProps = GroupProps & {
  color?: string;
};

const SQUARE_COAST = [
  [-20, -17],
  [17, -17],
  [20, -14],
  [20, 14],
  [17, 17],
  [-17, 17],
  [-20, 14],
  [-20, -14],
] as const;

function makeShape(scale: number) {
  const shape = new THREE.Shape();
  SQUARE_COAST.forEach(([x, y], index) => {
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
      rock: create(1, 2.8, 0.45),
      sand: create(0.965, 0.45, 0.3),
      grass: create(0.94, 0.55, 0.24),
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
