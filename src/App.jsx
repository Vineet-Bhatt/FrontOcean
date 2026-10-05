import React, { useState } from "react";
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
    console.log("Prediction input:", data);
    setPredictionInput(data);

    setTimeout(() => {
      document.getElementById("temperature-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    /* =====================================================
       BACKEND API — ADD LATER
       React → POST /predict → Flask → CNN → prediction
       ===================================================== */
  };

  return (
    <main className="app">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="grain" />

      <nav className="navbar">
        <a className="brand" href="#top" aria-label="OceanEmbed home">
          <span className="brand-mark">
            <i /><i /><i />
          </span>
          <span className="brand-text">OCEAN<span>EMBED</span></span>
        </a>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#predict-section">Explore</a>
          <a href="#validation">Validation</a>
        </div>

        <button className="nav-cta" onClick={handlePredict}>
          Explore ocean <span>↗</span>
        </button>
      </nav>

      <section id="top" className="hero">
        <div className="hero-shell">
          <div className="hero-topline">
            <span className="mini-line" />
            <span>OCEAN INTELLIGENCE</span>
            <span className="mini-dot">●</span>
            <span>SUBSURFACE PREDICTION</span>
          </div>

          <div className="hero-grid">
            <div className="hero-copy">
              <div className="kicker">SATELLITE → DEEP LEARNING</div>

              <h1>
                Read the ocean
                <br />
                <em>beneath</em> the surface.
              </h1>

              <p>
                OceanEmbed reconstructs subsurface temperature profiles from
                surface observations, turning satellite signals into a view
                of the ocean below.
              </p>

              <div className="hero-actions">
                <button className="primary-cta" onClick={handlePredict}>
                  <span>Explore the ocean</span>
                  <b>↗</b>
                </button>
                <a className="text-cta" href="#about">
                  How it works <span>↓</span>
                </a>
              </div>

              <div className="hero-metrics">
                <div>
                  <small>DEPTH PROFILE</small>
                  <strong>0–200 m</strong>
                </div>
                <div>
                  <small>GRID RESOLUTION</small>
                  <strong>0.25°</strong>
                </div>
                <div>
                  <small>MODEL</small>
                  <strong>CNN</strong>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-halo" />
              <Earth />

              <div className="visual-tag tag-left">
                <span className="tag-dot" />
                SURFACE SIGNAL
                <b>Satellite</b>
              </div>

              <div className="visual-tag tag-right">
                <span className="tag-dot gold" />
                PREDICTION
                <b>Deep Ocean</b>
              </div>

              <div className="visual-readout">
                <span>MODEL CONFIDENCE</span>
                <strong>96<span>%</span></strong>
              </div>

              <div className="visual-depth">
                <span>DEPTH</span>
                <b>200 m</b>
              </div>
            </div>
          </div>

          <div className="hero-footer">
            <span>01 / OCEAN EMBED</span>
            <span>Bay of Bengal · Arabian Sea</span>
            <span>Scroll to explore ↓</span>
          </div>
        </div>
      </section>

      <section id="about" className="intro-section">
        <div className="section-label">01 — THE IDEA</div>
        <div className="intro-grid">
          <h2>
            From what satellites
            <br />
            <span>see above</span> to what
            <br />
            exists below.
          </h2>
          <div>
            <p>
              Surface observations contain clues about the structure of the
              water column. OceanEmbed uses those signals to estimate
              subsurface temperature where direct measurements are sparse.
            </p>
            <a href="#predict-section">Select an observation ↗</a>
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
