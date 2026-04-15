"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── simplex 3D noise (Ashima / Stefan Gustavson) ─── */
const noise3D = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uNoiseStrength;
uniform vec3 uAttractPoint;
uniform float uAttractStrength;
varying float vDisplacement;
varying vec3 vWorldPos;
${noise3D}
void main(){
  vec3 pos = position;
  // organic noise morph
  float n = snoise(pos * 0.8 + uTime * 0.18) * uNoiseStrength;
  n += snoise(pos * 1.6 + uTime * 0.1) * uNoiseStrength * 0.2;
  pos += normal * n;
  // gravity pull — Gaussian falloff
  vec3 worldP = (modelMatrix * vec4(pos, 1.0)).xyz;
  vec3 toA = uAttractPoint - worldP;
  float d = length(toA);
  float pull = uAttractStrength * exp(-d * d * 0.2);
  pull = min(pull, 0.35);
  pos += normalize(toA) * pull;
  vDisplacement = n;
  vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vDisplacement;
varying vec3 vWorldPos;
void main(){
  float t = vDisplacement * 2.5 + 0.5;
  vec3 color = mix(uColorA, uColorB, smoothstep(0.3, 0.7, t));
  gl_FragColor = vec4(color, uOpacity);
}`;

/* ─── palette ─── */
const WIRE_DARK = {
  a: new THREE.Color("#2f8f86"),
  b: new THREE.Color("#7aebd9"),
};
const WIRE_LIGHT = {
  a: new THREE.Color("#4b7f79"),
  b: new THREE.Color("#8fcfc5"),
};
const GLOW_DARK = new THREE.Color("#0d4a44");
const GLOW_LIGHT = new THREE.Color("#94c8c0");

/* ─── inner glow sphere ─── */
const glowVertex = /* glsl */ `
varying vec3 vNorm;
void main(){
  vNorm = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const glowFragment = /* glsl */ `
uniform vec3 uGlowColor;
uniform float uOpacity;
varying vec3 vNorm;
void main(){
  float intensity = pow(0.6 - dot(vNorm, vec3(0.0, 0.0, 1.0)), 2.0);
  gl_FragColor = vec4(uGlowColor, intensity * 0.3 * uOpacity);
}`;

function Blob({
  scrollProgress,
  mousePos,
  isGrabbed,
  grabDelta,
  grabVelocity,
}: {
  scrollProgress: React.RefObject<number>;
  mousePos: React.RefObject<{ x: number; y: number }>;
  isGrabbed: React.RefObject<boolean>;
  grabDelta: React.RefObject<{ x: number; y: number }>;
  grabVelocity: React.RefObject<{ x: number; y: number }>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const glowMesh = useRef<THREE.Mesh>(null);
  const baseRotation = useRef({ x: 0, y: 0 });
  const attractPoint = useRef(new THREE.Vector3(3, 0, 2));
  const spinVelocity = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseStrength: { value: 0.12 },
      uAttractPoint: { value: new THREE.Vector3(3, 0, 2) },
      uAttractStrength: { value: 0 },
      uColorA: { value: WIRE_DARK.a.clone() },
      uColorB: { value: WIRE_DARK.b.clone() },
      uOpacity: { value: 1 },
    }),
    [],
  );

  const glowUniforms = useMemo(
    () => ({
      uGlowColor: { value: GLOW_DARK.clone() },
      uOpacity: { value: 1 },
    }),
    [],
  );

  useFrame(({ clock, camera }) => {
    if (!mesh.current) return;
    const mat = mesh.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.getElapsedTime();

    const mp = mousePos.current;
    const grabbed = isGrabbed.current;

    if (grabbed) {
      // grabbed mode — direct rotation from mouse delta, normalized by screen size
      const dx = grabDelta.current.x * 0.008;
      const dy = grabDelta.current.y * 0.008;
      spinVelocity.current = { x: dy, y: dx };
      baseRotation.current.x += dy;
      baseRotation.current.y += dx;
      grabDelta.current = { x: 0, y: 0 };

      // disable gravity pull when grabbed
      mat.uniforms.uAttractStrength.value *= 0.9;
    } else {
      // apply inertia from grab release
      baseRotation.current.x += spinVelocity.current.x;
      baseRotation.current.y += spinVelocity.current.y;
      spinVelocity.current.x *= 0.94;
      spinVelocity.current.y *= 0.94;
      // damp tiny velocities to zero
      if (Math.abs(spinVelocity.current.x) < 0.0001) spinVelocity.current.x = 0;
      if (Math.abs(spinVelocity.current.y) < 0.0001) spinVelocity.current.y = 0;

      // natural spin when idle (only when not spinning from grab)
      const totalSpin = Math.abs(spinVelocity.current.x) + Math.abs(spinVelocity.current.y);
      if (totalSpin < 0.001) {
        baseRotation.current.y += 0.002;
        baseRotation.current.x += 0.001;
      }

      // gravity pull
      const mouseNDC = new THREE.Vector3(mp.x, mp.y, 0.5);
      mouseNDC.unproject(camera);
      const dir = mouseNDC.sub(camera.position).normalize();
      const t = -camera.position.z / dir.z;
      const target = camera.position.clone().add(dir.multiplyScalar(t));
      attractPoint.current.lerp(target, 0.06);
      mat.uniforms.uAttractPoint.value.copy(attractPoint.current);

      const distToSphere = attractPoint.current.distanceTo(
        mesh.current.position,
      );
      const nearStrength = distToSphere < 5 ? 1.2 * (1 - distToSphere / 5) : 0;
      mat.uniforms.uAttractStrength.value +=
        (nearStrength - mat.uniforms.uAttractStrength.value) * 0.04;
    }

    // rotation — smooth toward target
    const tiltFactor = grabbed ? 0 : 1;
    const targetTiltX = baseRotation.current.x + mp.y * 0.15 * tiltFactor;
    const targetTiltY = baseRotation.current.y + mp.x * 0.15 * tiltFactor;
    mesh.current.rotation.x += (targetTiltX - mesh.current.rotation.x) * 0.08;
    mesh.current.rotation.y += (targetTiltY - mesh.current.rotation.y) * 0.08;

    // sync glow sphere rotation
    if (glowMesh.current) {
      glowMesh.current.rotation.copy(mesh.current.rotation);
      glowMesh.current.scale.copy(mesh.current.scale);
      glowMesh.current.visible = mesh.current.visible;
    }

    // scroll-based fade & scale
    const sp = Math.min(scrollProgress.current ?? 0, 1);
    const baseOpacity = Math.max(1 - sp, 0);
    const scale = 1 - sp * 0.12;
    mesh.current.scale.setScalar(scale);
    mesh.current.visible = baseOpacity > 0.01;
    mat.uniforms.uNoiseStrength.value = 0.12 * (1 - sp * 0.4);

    // theme-aware colors
    const isLight =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("light");
    const wirePalette = isLight ? WIRE_LIGHT : WIRE_DARK;
    const glowColor = isLight ? GLOW_LIGHT : GLOW_DARK;
    const wireOpacity = isLight ? baseOpacity * 0.72 : baseOpacity;
    const glowOpacity = isLight ? baseOpacity * 0.55 : baseOpacity;
    mat.uniforms.uOpacity.value = wireOpacity;
    mat.uniforms.uColorA.value.lerp(wirePalette.a, 0.03);
    mat.uniforms.uColorB.value.lerp(wirePalette.b, 0.03);

    // glow opacity
    if (glowMesh.current) {
      const glowMat = glowMesh.current.material as THREE.ShaderMaterial;
      glowMat.uniforms.uOpacity.value = glowOpacity;
      glowMat.uniforms.uGlowColor.value.lerp(glowColor, 0.03);
    }
  });

  return (
    <group position={[1.8, 0, 0]}>
      {/* Inner glow sphere */}
      <mesh ref={glowMesh}>
        <icosahedronGeometry args={[1.3, 16]} />
        <shaderMaterial
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Wireframe sphere */}
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.35, 12]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          wireframe
        />
      </mesh>
    </group>
  );
}

export function HeroSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const isGrabbed = useRef(false);
  const grabDelta = useRef({ x: 0, y: 0 });
  const grabVelocity = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [grabCursor, setGrabCursor] = useState(false);

  const isLightTheme =
    mounted &&
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("light");

  // Update body cursor when hovering/grabbing sphere
  useEffect(() => {
    if (!mounted) return;
    document.body.style.cursor = grabCursor ? "grab" : "";
    return () => { document.body.style.cursor = ""; };
  }, [grabCursor, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      scrollProgress.current = window.scrollY / (window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const isNearSphere = (clientX: number, clientY: number) => {
      // sphere is roughly in the right 40-90% of width, 10-80% of height
      const nx = clientX / window.innerWidth;
      const ny = clientY / window.innerHeight;
      return nx > 0.4 && nx < 0.95 && ny > 0.05 && ny < 0.85;
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };

      if (isGrabbed.current) {
        grabDelta.current = {
          x: e.clientX - lastMousePos.current.x,
          y: e.clientY - lastMousePos.current.y,
        };
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // cursor feedback
      setGrabCursor(isGrabbed.current || isNearSphere(e.clientX, e.clientY));
    };

    const onMouseDown = (e: MouseEvent) => {
      if (isNearSphere(e.clientX, e.clientY)) {
        isGrabbed.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        grabDelta.current = { x: 0, y: 0 };
        setGrabCursor(true);
      }
    };

    const onMouseUp = () => {
      isGrabbed.current = false;
      setGrabCursor(false);
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      mousePos.current = {
        x: (touch.clientX / window.innerWidth) * 2 - 1,
        y: -((touch.clientY / window.innerHeight) * 2 - 1),
      };
      if (isGrabbed.current) {
        grabDelta.current = {
          x: touch.clientX - lastMousePos.current.x,
          y: touch.clientY - lastMousePos.current.y,
        };
        lastMousePos.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      if (isNearSphere(touch.clientX, touch.clientY)) {
        isGrabbed.current = true;
        lastMousePos.current = { x: touch.clientX, y: touch.clientY };
        grabDelta.current = { x: 0, y: 0 };
      }
    };

    const onTouchEnd = () => {
      isGrabbed.current = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0" />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {/* Ambient glow behind the sphere */}
      <div
        aria-hidden
        className={`absolute right-[10%] top-1/2 -translate-y-1/2 h-[60%] w-[45%] rounded-full blur-3xl ${
          isLightTheme
            ? "bg-[radial-gradient(circle,_rgba(143,207,197,0.12),_transparent_68%)]"
            : "bg-[radial-gradient(circle,_rgba(47,143,134,0.2),_transparent_60%)]"
        }`}
      />
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <Blob
          scrollProgress={scrollProgress}
          mousePos={mousePos}
          isGrabbed={isGrabbed}
          grabDelta={grabDelta}
          grabVelocity={grabVelocity}
        />
      </Canvas>
    </div>
  );
}
