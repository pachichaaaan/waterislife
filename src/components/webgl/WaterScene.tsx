"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { env } from "@/lib/env";
import { fragmentShader, vertexShader } from "./waterShaders";

// Raw passthrough colour so the shader palette matches the CSS hex exactly.
THREE.ColorManagement.enabled = false;

const hex = (h: string) => {
  const n = parseInt(h.replace("#", ""), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255
  );
};

// frame-rate independent easing toward a target
const approach = (cur: number, target: number, rate: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-rate * dt));

function WaterPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const state = useRef({ dep: 0, heat: 0, theme: 0, mx: 0.5, my: 0.55 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDepletion: { value: 0 },
      uHeat: { value: 0 },
      uTheme: { value: 0 },
      uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0.5, 0.55) },
      cDeep: { value: hex("#0A1A2E") },
      cAqua: { value: hex("#4CE0D7") },
      cTide: { value: hex("#3AA8FF") },
      cFoam: { value: hex("#EAF6FF") },
      cAmber: { value: hex("#FF7A18") },
      cMolten: { value: hex("#FF3B2F") },
      cAsh: { value: hex("#FFF3E6") },
    }),
    []
  );

  useFrame((_, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const dt = Math.min(delta, 0.05);
    const s = state.current;

    s.dep = approach(s.dep, env.depletion, 3.2, dt);
    s.heat = approach(s.heat, env.heat, 3.2, dt);
    s.theme = approach(s.theme, env.theme, 3.2, dt);
    s.mx = approach(s.mx, env.mouseX, 7.0, dt);
    s.my = approach(s.my, env.mouseY, 7.0, dt);

    const u = mat.uniforms;
    u.uTime.value += dt;
    u.uDepletion.value = s.dep;
    u.uHeat.value = s.heat;
    u.uTheme.value = s.theme;
    u.uMouse.value.set(s.mx, s.my);
    u.uAspect.value = size.width / size.height;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function WaterScene() {
  return (
    <Canvas
      className="!fixed inset-0"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        gl.setClearColor(0x000000, 0);
      }}
      frameloop="always"
    >
      <WaterPlane />
    </Canvas>
  );
}
