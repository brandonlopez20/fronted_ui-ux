import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";

extend({ OrbitControls });

function Controls() {
  const { camera, gl } = useThree();
  const controls = useRef();
  useFrame(() => controls.current.update());
  return <orbitControls ref={controls} args={[camera, gl.domElement]} />;
}

function Tube({ index, tubeVerts, colors, tubeLength, mat }) {
  const pointsRef = useRef();
  const speed = 0.2;
  const startPosZ = -tubeLength * index;
  const endPosZ = tubeLength;
  const resetPosZ = -tubeLength;

  const geo = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", tubeVerts);
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }, [tubeVerts, colors]);

  useFrame(() => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.005;
    pointsRef.current.position.z += speed;
    if (pointsRef.current.position.z > endPosZ) {
      pointsRef.current.position.z = resetPosZ;
    }
  });

  return (
    <points
      ref={pointsRef}
      geometry={geo}
      material={mat}
      rotation-x={Math.PI * 0.5}
      position-z={startPosZ}
    />
  );
}

function Scene() {
  const tubeLength = 200;
  const radius = 3;
  const { camera, gl } = useThree();

  const { verts, colors } = useMemo(() => {
    const tubeGeo = new THREE.CylinderGeometry(
      radius,
      radius,
      tubeLength,
      128,
      4096,
      true
    );
    const verts = tubeGeo.attributes.position.clone();
    const noise = new ImprovedNoise();
    const noisefreq = 0.1;
    const noiseAmp = 0.5;
    const hueNoiseFreq = 0.005;
    const color = new THREE.Color();
    const colors = [];

    const p = new THREE.Vector3();
    const v3 = new THREE.Vector3();

    for (let i = 0; i < verts.count; i++) {
      p.fromBufferAttribute(verts, i);
      v3.copy(p);
      let vertexNoise = noise.noise(v3.x * noisefreq, v3.y * noisefreq, v3.z);
      v3.addScaledVector(p, vertexNoise * noiseAmp);
      verts.setXYZ(i, v3.x, p.y, v3.z);

      let colorNoise = noise.noise(
        v3.x * hueNoiseFreq,
        v3.y * hueNoiseFreq,
        i * 0.001 * hueNoiseFreq
      );
      color.setHSL(0.5 - colorNoise, 1, 0.5);
      colors.push(color.r, color.g, color.b);
    }
    verts.needsUpdate = true;
    return { verts, colors };
  }, [radius, tubeLength]);

  const mat = useMemo(
    () => new THREE.PointsMaterial({ size: 0.03, vertexColors: true }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 1000;
    camera.position.x = Math.cos(t * 0.001) * 1.5;
    camera.position.y = Math.sin(t * 0.001) * 1.5;
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [camera, gl]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <Controls />
      <Tube index={0} tubeVerts={verts} colors={colors} tubeLength={tubeLength} mat={mat} />
      <Tube index={1} tubeVerts={verts} colors={colors} tubeLength={tubeLength} mat={mat} />
    </>
  );
}

export default function WormholeEffect() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <Canvas
        camera={{ position: [0.5, 0.5, 15], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
        fog={new THREE.FogExp2(0x000000, 0.025)}
      >
        <Scene />
      </Canvas>

      {/* Texto HTML encima del Canvas */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          textAlign: "center",
          pointerEvents: "none", // que no interfiera con controles
          userSelect: "none",
          maxWidth: "90vw",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          padding: "1rem",
          borderRadius: "1rem",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
          Experiencia Inmersiva
        </h1>
        <p style={{ fontSize: "12px", margin: 0,   backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
          Con una atracción de usuario única que me permite capturar la mirada de cualquier usuario
        </p>
      </div>
    </div>
  );
}
