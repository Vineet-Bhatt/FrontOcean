import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { BackSide, Color, TextureLoader } from "three";

const EARTH_TEXTURE =
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_NORMAL =
  "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg";
const EARTH_SPECULAR =
  "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg";
const EARTH_SPECULAR_COLOR = new Color("#315b78");

function EarthMesh() {
  const [colorMap, normalMap, specularMap] = useLoader(TextureLoader, [
    EARTH_TEXTURE,
    EARTH_NORMAL,
    EARTH_SPECULAR,
  ]);
  const earthRef = useRef();

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group ref={earthRef}>
      <mesh>
        <sphereGeometry args={[2.55, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          specular={EARTH_SPECULAR_COLOR}
          shininess={18}
        />
      </mesh>

      <mesh scale={[1.025, 1.025, 1.025]}>
        <sphereGeometry args={[2.55, 64, 64]} />
        <meshBasicMaterial
          color="#35d9ff"
          transparent
          opacity={0.055}
          side={BackSide}
        />
      </mesh>
    </group>
  );
}

function EarthFallback() {
  const earthRef = useRef();

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2.55, 48, 48]} />
      <meshStandardMaterial color="#087fa3" roughness={0.7} metalness={0.05} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 3, 5]} intensity={3} color="#ffffff" />
      <directionalLight
        position={[-4, -2, -4]}
        intensity={0.45}
        color="#1bb9e8"
      />

      <Stars
        radius={80}
        depth={40}
        count={450}
        factor={1.2}
        saturation={0}
        fade
        speed={0.25}
      />

      <Suspense fallback={<EarthFallback />}>
        <EarthMesh />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </>
  );
}

export default function Earth() {
  return (
    <div className="earth-canvas">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 38, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
