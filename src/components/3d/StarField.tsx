"use client";

import { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { Points, PointMaterial } from "@react-three/drei";

function generateSpherePoints(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
}

function Stars() {
  const ref = useRef<any>(null);

  // ✅ OPTIMIZATION 1: useMemo ensures this heavy math runs ONLY once.
  // Reduced to 4002 points (divisible by 3) for better mobile FPS.
  const sphere = useMemo(() => generateSpherePoints(4002, 1.2), []);

  useFrame((state, delta) => {
    if (ref.current) {
      // ✅ OPTIMIZATION 2: Cap delta time. 
      // If user switches tabs and comes back, this prevents the stars from spinning wildly.
      const timeStep = Math.min(delta, 0.1); 
      
      ref.current.rotation.x -= timeStep / 10;
      ref.current.rotation.y -= timeStep / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={0.0025}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function StarField() {
  const pathname = usePathname();

  if (pathname.includes("/admin")) {
    return null;
  }
  if (pathname.includes("/join")) {
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
      {/* ✅ OPTIMIZATION 3: 'dpr' limits pixel density.
         [1, 2] means on high-res iPhones (3x screens), we limit to 2x.
         This saves HUGE amounts of battery and GPU power.
      */}
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]} gl={{ antialias: false }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
      </Canvas>
    </div>
  );
}