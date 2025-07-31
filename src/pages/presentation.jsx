import React, { useEffect, useState } from "react";

const quotes = [
  "El límite está en tu imaginación.",
  "Transforma ideas en realidad.",
  "La creatividad no tiene fronteras.",
  "Cada línea de código cuenta.",
];

export default function Presentation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Simula animación de entrada
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="presentation-container">
      <div className="presentation-overlay"></div>
      <div className={`presentation-content ${visible ? "show" : ""}`}>
        <h1 className="presentation-title">
          ¡Hola! Soy{" "}
          <span className="presentation-highlight">[Brandon López]</span>
        </h1>
        <h2 className="presentation-subtitle">
          Desarrollador Frontend | UX Lover | Creativo Digital
        </h2>

        <div className="presentation-quotes">
          {quotes.map((quote, index) => (
            <p key={index} className={`presentation-quote delay-${index + 1}`}>
              “{quote}”
            </p>
          ))}
        </div>

        <a href="/brandon_cv.pdf" download className="presentation-button">
          Descargar CV
        </a>
      </div>
    </div>
  );
}
