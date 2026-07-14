"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, MapControls, Grid } from "@react-three/drei";
import { Siland } from "@/components/game/models/Siland";
import { VillageAsset } from "@/components/game/models/VillageAsset";
import { Mountain } from "@/components/game/models/Mountain";

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow
        position={[20, 30, 20]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
      />
    </>
  );
}

export default function GameMap() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Canvas shadows>
        {/* Force the sky blue background directly in the 3D renderer */}
        <color attach="background" args={["#bae6fd"]} />

        <OrthographicCamera
          makeDefault
          position={[50, 50, 50]}
          zoom={15} /* Reduced from 60 so you can see the whole map */
          near={-100}
          far={1000} />

        <MapControls
          enableRotate={false}
          enableZoom={true}
          enablePan={true}
          minZoom={5}
          maxZoom={50} />

        <Lighting />

        <Suspense fallback={null}>
          {/* Reverted scale back to 1:1 */}
        <Siland position={[0, 0, 0]} scale={1} color="#4ade80" />
        <Mountain
          position={[0, 0, 0]}
          scale={1}
          color="#9ca3af"
          label="შხარა" />

        {/* Village Layout */}
        <group position={[5, 0, 5]}>
          {/* Central Path */}
          <VillageAsset modelName="path-stones-long.glb" position={[0, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} scale={2} />
          <VillageAsset modelName="path-stones-long.glb" position={[4, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} scale={2} />
          <VillageAsset modelName="path-stones-long.glb" position={[8, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} scale={2} />

          {/* Houses on one side of the path */}
          <VillageAsset modelName="building-type-a.glb" position={[0, 0, -3]} scale={1.5} />
          <VillageAsset modelName="building-type-b.glb" position={[4, 0, -3]} scale={1.5} />
          <VillageAsset modelName="building-type-c.glb" position={[8, 0, -3]} scale={1.5} />

          {/* Houses on the other side of the path */}
          <VillageAsset modelName="building-type-d.glb" position={[0, 0, 3]} rotation={[0, Math.PI, 0]} scale={1.5} />
          <VillageAsset modelName="building-type-e.glb" position={[4, 0, 3]} rotation={[0, Math.PI, 0]} scale={1.5} />
          <VillageAsset modelName="building-type-f.glb" position={[8, 0, 3]} rotation={[0, Math.PI, 0]} scale={1.5} />

          {/* Trees scattered around */}
          <VillageAsset modelName="tree-large.glb" position={[-2, 0, -4]} scale={2} />
          <VillageAsset modelName="tree-small.glb" position={[2, 0, -2]} scale={1.5} />
          <VillageAsset modelName="tree-large.glb" position={[6, 0, -4]} scale={2} />
          <VillageAsset modelName="tree-small.glb" position={[10, 0, -2]} scale={1.5} />

          <VillageAsset modelName="tree-small.glb" position={[-2, 0, 4]} scale={1.5} />
          <VillageAsset modelName="tree-large.glb" position={[2, 0, 2]} scale={2} />
          <VillageAsset modelName="tree-small.glb" position={[6, 0, 4]} scale={1.5} />
          <VillageAsset modelName="tree-large.glb" position={[10, 0, 2]} scale={2} />

          {/* Fences */}
          <VillageAsset modelName="fence-3x3.glb" position={[4, 0, -4]} scale={1.5} />
        </group>
      </Suspense>

      <Grid
        args={[44, 44]}
        position={[0, -0.1, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#86efac"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#22c55e"
        infiniteGrid={false} />
      </Canvas>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <div className="bg-gray-900/90 text-white text-xs font-semibold px-5 py-2 rounded-full">
          🏔 Click the mountain to reveal its name
        </div>
      </div>
    </div>
  );
}
