import { useState, useEffect } from "react";
import "./App.css";
import Page3D from "./pages/threejs";
import ZustandStyleIntro from "./pages/Zustand";
import WaveBackground from "./pages/animations";
import Presentation from "./pages/presentation";

const Page = ({ children, className }) => (
  <div className={`page ${className}`}>
    {children}
  </div>
);

// Wrapper que muestra loading mientras la página se "carga"
const LoadablePage = ({ children, onLoad }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      if (onLoad) onLoad();
    }, 800); // 800ms loading simulado

    return () => clearTimeout(timer);
  }, [children]);

  return (
    <div className="page-container">
      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="page-content fade-in">{children}</div>
      )}
    </div>
  );
};

const pages = [
  { id: 0, component: <Page className="bg1"><Page3D /></Page> },
  { id: 1, component: <Page className="bg2"><ZustandStyleIntro /></Page> },
  { id: 2, component: <Page className="bg3"><WaveBackground /></Page> },
  { id: 3, component: <Page className="bg1"><Presentation /></Page> },
];

const FullscreenPrompt = ({ onAccept }) => {
  return (
    <div
      onClick={onAccept}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5rem",
        cursor: "pointer",
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      Haz click para entrar en pantalla completa
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState(3);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);

  const totalPages = pages.length;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        setShowFullscreenPrompt(false);
      }).catch(() => {
        // Si el usuario cancela o falla, también ocultamos el prompt para no molestar
        setShowFullscreenPrompt(false);
      });
    } else {
      setShowFullscreenPrompt(false);
    }
  };

  return (
    <div className="container">
      {showFullscreenPrompt && <FullscreenPrompt onAccept={enterFullscreen} />}
      {/* Renderizamos solo la página actual */}
      <LoadablePage key={currentPage}>
        {pages[currentPage].component}
      </LoadablePage>

      <div className="nav-buttons">
        <button onClick={prevPage}>Anterior</button>
        <button onClick={nextPage}>Siguiente</button>
      </div>
    </div>
  );
};

export default App;
