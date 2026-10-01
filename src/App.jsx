import { useState } from "react";
import "./App.css";

import Earth from "./components/Earth";
import MapSection from "./components/MapSection";
import OceanPrediction from "./components/OceanPrediction";
import ValidationSection from "./components/ValidationSection";

function App() {
  const [predictionInput, setPredictionInput] = useState(null);

  const handlePredict = () => {
    document.getElementById("predict-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleMapPrediction = (data) => {
    setPredictionInput(data);

    requestAnimationFrame(() => {
      document.getElementById("temperature-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <main className="app">
      <nav className="navbar" aria-label="Primary navigation">
        <a className="brand" href="#" aria-label="Ocean Embed home">
          <span className="brand-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-text">
            OCEAN <strong>EMBED</strong>
          </span>
        </a>

        <div className="nav-links">
          <a href="#about">About Us</a>
          <a href="#validation">Validation</a>
          <a href="#heatmap">Heatmap</a>
        </div>
      </nav>

      <section id="about" className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-line" aria-hidden="true" />
            <span>SATELLITE EMBEDDING</span>
            <span className="dot" aria-hidden="true">•</span>
            <span>DEEP OCEAN INTELLIGENCE</span>
          </div>

          <h1 id="hero-title">
            See the <span className="cyan-text">Ocean</span>
            <br />
            Beneath the
            <br />
            <strong>Surface.</strong>
          </h1>

          <p className="hero-description">
            Reconstruct subsurface ocean temperature profiles from surface
            satellite observations using deep learning.
          </p>

          <button className="predict-button" onClick={handlePredict}>
            <span>PREDICT</span>
            <span className="arrow" aria-hidden="true">↗</span>
          </button>

          <div className="hero-stats" aria-label="Model highlights">
            <div className="stat">
              <div className="stat-icon" aria-hidden="true">◉</div>
              <div>
                <small>OBSERVATION</small>
                <strong>Satellite Data</strong>
              </div>
            </div>

            <div className="stat">
              <div className="stat-icon" aria-hidden="true">◇</div>
              <div>
                <small>RESOLUTION</small>
                <strong>0.25° × 0.25°</strong>
              </div>
            </div>

            <div className="stat">
              <div className="stat-icon" aria-hidden="true">◇</div>
              <div>
                <small>MODEL</small>
                <strong>Deep Learning</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="earth-area">
          <Earth />
          <div className="earth-status">
            <span aria-hidden="true" />
            LIVE OCEAN OBSERVATION
          </div>
        </div>
      </section>

      <section id="predict-section" className="predict-section">
        <MapSection onPredict={handleMapPrediction} />
      </section>

      <OceanPrediction predictionInput={predictionInput} />

      <ValidationSection predictionInput={predictionInput} />
    </main>
  );
}

export default App;
