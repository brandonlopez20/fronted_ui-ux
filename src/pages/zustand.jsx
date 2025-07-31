import React, { useRef, useEffect, useState } from "react";

export default function ParallaxImageLayers() {
  const layer1 = useRef(null);
  const layer2 = useRef(null);
  const layer3 = useRef(null);

  const requestRef = useRef();
  const previousTimeRef = useRef();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);

  const autoPos = useRef({ x: 0, y: 0 });
  const autoDir = useRef({ x: 0.0012, y: 0.0008 });

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const delta = time - previousTimeRef.current;

      if (!isHover) {
        autoPos.current.x += autoDir.current.x * delta;
        autoPos.current.y += autoDir.current.y * delta;

        if (Math.abs(autoPos.current.x) > 0.5) autoDir.current.x *= -1;
        if (Math.abs(autoPos.current.y) > 0.5) autoDir.current.y *= -1;

        setMousePos((prev) => ({
          x: prev.x + (autoPos.current.x - prev.x) * 0.04,
          y: prev.y + (autoPos.current.y - prev.y) * 0.04,
        }));
      }
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isHover]);

  useEffect(() => {
    if (layer1.current)
      layer1.current.style.transform = `translate(${mousePos.x * 20}px, ${
        mousePos.y * 20
      }px) scale(1.05)`;

    if (layer2.current)
      layer2.current.style.transform = `translate(${mousePos.x * 50}px, ${
        mousePos.y * 50
      }px) scale(1.1)`;

    if (layer3.current)
      layer3.current.style.transform = `translate(${mousePos.x * 100}px, ${
        mousePos.y * 100
      }px) scale(1.15)`;
  }, [mousePos]);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  return (
    <div
      style={containerStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img
        ref={layer1}
        src="fondo.jpg"
        alt="fondo"
        style={{
          ...imageLayerStyle,
          zIndex: 1,
          filter: "blur(6px)",
        }}
      />

      <img
        ref={layer2}
        src="tucan.png"
        alt="objeto"
        style={{
          ...imageLayerStyle,
          zIndex: 2,
          width: "60vw",
          height: "auto",
          top: "30%",
          left: "10%",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          color: "#fff",
          textAlign: "center",
          padding: "1rem 2rem",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderRadius: "12px",
          pointerEvents: "none",
          maxWidth: "90vw",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Efectos Parallax</h1>
        <p style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
          Animación interactiva con realidad aumentada en capas
        </p>
      </div>

      <img
        ref={layer3}
        src="selva2.png"
        alt="frente"
        style={{
          ...imageLayerStyle,
          zIndex: 3,
          filter: "drop-shadow(10px 5px 5px #000)",
        }}
      />
    </div>
  );
}

const containerStyle = {
  width: "100vw",
  height: "100vh",
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#000",
};

const imageLayerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.4s ease-out",
  pointerEvents: "none",
};
