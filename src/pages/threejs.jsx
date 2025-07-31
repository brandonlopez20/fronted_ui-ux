import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import getStarfield from '../components/getStarfield';
import { getFresnelMat } from '../components/getFresnelMat';

extend({ OrbitControls });

function Earth() {
  const earthGroup = useRef();
  const earthMesh = useRef();
  const lightsMesh = useRef();
  const cloudsMesh = useRef();
  const glowMesh = useRef();
  const starsRef = useRef();

  const loader = new THREE.TextureLoader();
  const detail = 12;
  const geometry = new THREE.IcosahedronGeometry(1, detail);

  const material = new THREE.MeshPhongMaterial({
    map: loader.load('./textures/00_earthmap1k.jpg'),
    specularMap: loader.load('./textures/02_earthspec1k.jpg'),
    bumpMap: loader.load('./textures/01_earthbump1k.jpg'),
    bumpScale: 0.04,
  });

  const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load('./textures/03_earthlights1k.jpg'),
    blending: THREE.AdditiveBlending,
  });

  const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load('./textures/04_earthcloudmap.jpg'),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
  });

  const fresnelMat = getFresnelMat();
  const stars = getStarfield({ numStars: 10000, color: 0xffffff }); // Asegura estrellas blancas

  useEffect(() => {
    if (earthGroup.current) {
      earthGroup.current.rotation.z = (-23.4 * Math.PI) / 180;
    }
  }, []);

  useFrame(() => {
    if (earthMesh.current) earthMesh.current.rotation.y += 0.002;
    if (lightsMesh.current) lightsMesh.current.rotation.y += 0.002;
    if (cloudsMesh.current) cloudsMesh.current.rotation.y += 0.0023;
    if (glowMesh.current) glowMesh.current.rotation.y += 0.002;
    if (starsRef.current) starsRef.current.rotation.y -= 0.0002;
  });

  return (
    <>
      <group ref={earthGroup}>
        <mesh ref={earthMesh} geometry={geometry} material={material} />
        <mesh ref={lightsMesh} geometry={geometry} material={lightsMat} />
        <mesh ref={cloudsMesh} geometry={geometry} material={cloudsMat} scale={1.003} />
        <mesh ref={glowMesh} geometry={geometry} material={fresnelMat} scale={1.01} />
      </group>
      <primitive object={stars} ref={starsRef} />
      <directionalLight position={[-2, 0.5, 1.5]} intensity={2.0} />
    </>
  );
}

export default function EarthScene() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: 'black' }}>
      {/* UI superior izquierda */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        zIndex: 10,
        maxWidth: '400px',
        fontFamily: 'sans-serif',
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}>
           <h1 style={{ margin: 0, fontSize: "2rem" }}>Modelos 3D</h1>
        <p style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
          Creacion de modelos 3D con obj y mtl que llaman mucho la atencion de los usuarios.
        </p>
      </div>

      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'black' }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.LinearSRGBColorSpace,
        }}
      >
        <OrbitControls enableZoom={true} />
        <ambientLight intensity={0.1} />
        <Earth />
      </Canvas>
    </div>
  );
}
