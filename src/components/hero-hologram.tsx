"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ─── module-level shared state (bypasses React/R3F ref boundary) ─── */
let scrollProg = 0;
let isHovered = false;

/* ─── palette ─── */
const DARK = {
  primary: new THREE.Color("#3db5a9"),
  edge: new THREE.Color("#7aebd9"),
  glow: new THREE.Color("#0d4a44"),
};
const LIGHT = {
  primary: new THREE.Color("#2f8f86"),
  edge: new THREE.Color("#5cc8bb"),
  glow: new THREE.Color("#94c8c0"),
};

/* ─── shaders ─── */
const wireVert = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vY;
void main() {
  vec3 p = position + normal * sin(uTime * 0.8 + position.y * 3.0) * 0.002;
  vNormal = normalize(normalMatrix * normal);
  vWorldPos = (modelMatrix * vec4(p, 1.0)).xyz;
  vY = position.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const wireFrag = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColor;
uniform vec3 uEdgeColor;
uniform float uYMin;
uniform float uYMax;
uniform float uPulse;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vY;
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float facing = dot(viewDir, vNormal);
  float backFade = smoothstep(-0.1, 0.15, facing); // back faces ~20%, front faces 100%
  float fresnel = pow(1.0 - abs(facing), 2.0);
  float scan = smoothstep(0.4, 0.6, sin(vY * 18.0 - uTime * 1.2) * 0.5 + 0.5) * 0.15;
  float band = step(0.99, sin(vY * 40.0 + uTime * 0.6));
  vec3 col = mix(uColor, uEdgeColor, fresnel * 0.6 + uPulse * 0.25) + uEdgeColor * band * 0.3;
  col += uEdgeColor * uPulse * 0.35;
  float bottomFade = smoothstep(uYMin, uYMin + 0.15 * (uYMax - uYMin), vY);
  float a = (0.3 + fresnel * 0.7 + scan + band * 0.15 + uPulse * 0.2) * uOpacity * bottomFade;
  a *= mix(0.18, 1.0, backFade);
  gl_FragColor = vec4(col, a);
}`;

const glowVert = /* glsl */ `
uniform float uPulse;
varying vec3 vNorm;
void main() {
  vNorm = normalize(normalMatrix * normal);
  float expand = 1.06 + uPulse * 0.04;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position * expand, 1.0);
}`;

const glowFrag = /* glsl */ `
uniform vec3 uGlowColor;
uniform float uOpacity;
uniform float uPulse;
varying vec3 vNorm;
void main() {
  float i = pow(0.55 - dot(vNorm, vec3(0.0, 0.0, 1.0)), 2.0);
  float intensity = 0.3 + uPulse * 0.5;
  gl_FragColor = vec4(uGlowColor, i * intensity * uOpacity);
}`;

const ptVert = /* glsl */ `
uniform float uTime;
uniform float uPulse;
attribute float aRandom;
varying float vAlpha;
varying float vBackFade;
void main() {
  vec3 p = position + normal * sin(uTime * 0.8 + position.y * 3.0) * 0.002;
  vec3 viewDir = normalize(cameraPosition - (modelMatrix * vec4(p, 1.0)).xyz);
  vec3 wNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  float facing = dot(viewDir, wNormal);
  vBackFade = smoothstep(-0.1, 0.15, facing);
  vAlpha = 0.3 + 0.7 * step(0.65, sin(uTime * 1.8 + aRandom * 80.0) * 0.5 + 0.5) + uPulse * 0.4;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = max(1.2, (2.5 + uPulse * 1.0) / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const ptFrag = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;
varying float vBackFade;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float a = (1.0 - d * 2.0) * vAlpha * uOpacity * 0.5 * mix(0.15, 1.0, vBackFade);
  gl_FragColor = vec4(uColor, a);
}`;

const ringVert = /* glsl */ `
varying float vAngle;
void main() {
  vAngle = atan(position.x, position.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const ringFrag = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColor;
varying float vAngle;
void main() {
  float dash = sin(vAngle * 12.0 + uTime * 2.0) * 0.5 + 0.5;
  float a = step(0.3, dash) * uOpacity * 0.35;
  gl_FragColor = vec4(uColor, a);
}`;

/* ─── holographic head from GLB model ─── */
function HolographicHead() {
  const group = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF("/low_poly_head.glb");

  const { headGeo, ptGeo, yMin, yMax, boundRadius } = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry && !geo) {
        geo = child.geometry.clone();
      }
    });

    if (!geo) {
      geo = new THREE.BoxGeometry(1, 1, 1);
    }

    // Center the geometry
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const center = new THREE.Vector3();
    box.getCenter(center);
    geo.translate(-center.x, -center.y, -center.z);

    // Scale to fit nicely
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2.8;
    const scale = targetSize / maxDim;
    geo.scale(scale, scale, scale);

    geo.computeBoundingBox();
    geo.computeVertexNormals();

    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      if (y < min) min = y;
      if (y > max) max = y;
    }

    // Build point geometry
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", posAttr.clone());
    pGeo.setAttribute(
      "normal",
      geo.getAttribute("normal")
        ? (geo.getAttribute("normal") as THREE.BufferAttribute).clone()
        : posAttr.clone(),
    );
    const count = posAttr.count;
    const rands = new Float32Array(count);
    // Deterministic pseudo-random per vertex (avoids impure Math.random during render)
    for (let i = 0; i < count; i++) {
      const seed = (i * 2654435761) >>> 0;
      rands[i] = (seed & 0xffff) / 0xffff;
    }
    pGeo.setAttribute("aRandom", new THREE.BufferAttribute(rands, 1));

    // Compute bounding sphere radius for ring sizing
    geo.computeBoundingSphere();
    const r = geo.boundingSphere?.radius ?? 1;

    return { headGeo: geo, ptGeo: pGeo, yMin: min, yMax: max, boundRadius: r };
  }, [scene]);

  // R3F uniforms — mutated every frame in useFrame (standard Three.js pattern)
  // eslint-disable-next-line react-hooks/refs
  const wireU = useRef({
    uTime: { value: 0 },
    uOpacity: { value: 1 },
    uColor: { value: DARK.primary.clone() },
    uEdgeColor: { value: DARK.edge.clone() },
    uYMin: { value: yMin },
    uYMax: { value: yMax },
    uPulse: { value: 0 },
  }).current;

  // eslint-disable-next-line react-hooks/refs
  const glowU = useRef({
    uGlowColor: { value: DARK.glow.clone() },
    uOpacity: { value: 1 },
    uPulse: { value: 0 },
  }).current;

  // eslint-disable-next-line react-hooks/refs
  const ptU = useRef({
    uTime: { value: 0 },
    uColor: { value: DARK.edge.clone() },
    uOpacity: { value: 1 },
    uPulse: { value: 0 },
  }).current;

  // eslint-disable-next-line react-hooks/refs
  const ringU = useRef({
    uTime: { value: 0 },
    uOpacity: { value: 1 },
    uColor: { value: DARK.primary.clone() },
  }).current;

  const ringRadius = boundRadius * 1.05;

  // glow state — combines hover and timed pulse
  const pulseState = useRef({ nextPulse: 4, phase: 0, active: false });
  const hoverGlow = useRef(0);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    wireU.uTime.value = t;
    ptU.uTime.value = t;
    ringU.uTime.value = t;

    // ─── hover glow — smooth lerp in/out ───
    const hoverTarget = isHovered ? 1 : 0;
    hoverGlow.current += (hoverTarget - hoverGlow.current) * 0.06;

    // ─── timed pulse — periodic ambient glow ───
    const ps = pulseState.current;
    if (t > ps.nextPulse && !ps.active && !isHovered) {
      ps.active = true;
      ps.phase = 0;
    }
    let timedPulse = 0;
    if (ps.active) {
      ps.phase += 0.025;
      timedPulse = Math.sin(ps.phase * Math.PI);
      if (ps.phase >= 1) {
        ps.active = false;
        ps.phase = 0;
        ps.nextPulse = t + 5 + Math.random() * 4;
      }
    }

    // combine: hover glow takes priority, timed pulse is ambient
    const pulse = Math.min(Math.max(hoverGlow.current, timedPulse), 1);

    // ─── orbital drift ───
    const orbitY = Math.sin(t * 0.15) * 0.4;
    const breathX = Math.sin(t * 0.4) * 0.08;
    const breathZ = Math.cos(t * 0.25) * 0.03;
    group.current.rotation.y = orbitY;
    group.current.rotation.x = breathX;
    group.current.rotation.z = breathZ;

    // scan ring bob
    if (ringRef.current) {
      const range = yMax - yMin;
      ringRef.current.position.y =
        yMin + ((Math.sin(t * 0.5) * 0.5 + 0.5) * range);
      ringRef.current.rotation.y = t * 0.25;
    }

    // ─── scroll fade ───
    const sp = Math.min(scrollProg, 1);
    const op = Math.max(1 - sp, 0);
    const sc = 1 - sp * 0.08;
    group.current.scale.setScalar(sc);
    group.current.visible = op > 0.01;
    wireU.uOpacity.value = op;
    glowU.uOpacity.value = op;
    ptU.uOpacity.value = op;
    ringU.uOpacity.value = op;
    wireU.uPulse.value = pulse;
    glowU.uPulse.value = pulse;
    ptU.uPulse.value = pulse;

    // theme-aware color transitions
    const isLight =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("light");
    const pal = isLight ? LIGHT : DARK;
    wireU.uColor.value.lerp(pal.primary, 0.03);
    wireU.uEdgeColor.value.lerp(pal.edge, 0.03);
    glowU.uGlowColor.value.lerp(pal.glow, 0.03);
    ptU.uColor.value.lerp(pal.edge, 0.03);
    ringU.uColor.value.lerp(pal.primary, 0.03);
  });

  return (
    <group ref={group} position={[1.8, 0, 0]}>
      {/* inner glow — scaled-up clone for back-face rim */}
      <mesh geometry={headGeo}>
        <shaderMaterial
          vertexShader={glowVert}
          fragmentShader={glowFrag}
          uniforms={glowU}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* wireframe head */}
      <mesh geometry={headGeo}>
        <shaderMaterial
          vertexShader={wireVert}
          fragmentShader={wireFrag}
          uniforms={wireU}
          transparent
          depthWrite={false}
          wireframe
        />
      </mesh>

      {/* vertex highlight points */}
      <points geometry={ptGeo}>
        <shaderMaterial
          vertexShader={ptVert}
          fragmentShader={ptFrag}
          uniforms={ptU}
          transparent
          depthWrite={false}
        />
      </points>

      {/* horizontal scan ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ringRadius, ringRadius + 0.02, 64]} />
        <shaderMaterial
          vertexShader={ringVert}
          fragmentShader={ringFrag}
          uniforms={ringU}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─── exported wrapper ─── */
export function HeroHologram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const isLightTheme =
    mounted &&
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("light");

  // Hydration-safe mount detection
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      scrollProg = window.scrollY / (window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return <div className="absolute inset-0" />;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <div
        aria-hidden
        className={`absolute right-[10%] top-1/2 -translate-y-1/2 h-[60%] w-[45%] rounded-full blur-3xl ${
          isLightTheme
            ? "bg-[radial-gradient(circle,_rgba(143,207,197,0.12),_transparent_68%)]"
            : "bg-[radial-gradient(circle,_rgba(47,143,134,0.2),_transparent_60%)]"
        }`}
      />
      {/* hover detection zone over the hologram area */}
      <div
        className="absolute right-0 top-[10%] h-[80%] w-[50%] pointer-events-auto cursor-default"
        onMouseEnter={() => { isHovered = true; }}
        onMouseLeave={() => { isHovered = false; }}
        onTouchStart={() => { isHovered = true; }}
        onTouchEnd={() => { isHovered = false; }}
      />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <HolographicHead />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/low_poly_head.glb");
