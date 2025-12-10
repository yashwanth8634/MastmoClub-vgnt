"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

function GraphNetwork() {
  const ref = useRef<any>(null); // ✅ FIXED: Initialized with null to prevent crash
  
  // 1. Generate 300 points in a sphere (Nodes)
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(300 * 3), { radius: 1.2 });
  }, []);

  // 2. Rotate the network slowly
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* The Nodes (Dots) */}
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f0ff" // Cyan
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
      
      {/* To simulate connections, we use a subtle fog/glow instead of heavy lines 
          that kill performance. This looks like a "Data Cloud". */}
    </group>
  );
}

export default function NetworkBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <GraphNetwork />
      </Canvas>
    </div>
  );
}