import React, { useState } from "react";
import "./App.css";

import Earth from "./components/Earth";
import MapSection from "./components/MapSection";
import OceanPrediction from "./components/OceanPrediction";
import ValidationSection from "./components/ValidationSection";

function App() {
  const [predictionInput, setPredictionInput] = useState(null);

  /* =====================================================
     HERO → MAP
  ===================================================== */

  const handlePredict = () => {
    document
      .getElementById("predict-section")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };


  /* =====================================================
     MAP → TEMPERATURE PREDICTION
  ===================================================== */

  const handleMapPrediction = (data) => {
    console.log("Prediction input:", data);

    setPredictionInput(data);

    setTimeout(() => {
      document
        .getElementById("temperature-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);


    /* =====================================================
       BACKEND API — ADD LATER

       Later frontend will send:

       latitude
       longitude
       date

       to Flask backend.

       Future flow:

       React
          ↓
       POST /predict
          ↓
       Flask Backend
          ↓
       CNN Model
          ↓
       Temperature Prediction
          ↓
       React Visualization

       DO NOT ADD REAL API ENDPOINT YET.
    ===================================================== */
  };


  return (
    <main className="app">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="brand-text">
            OCEAN <strong>EMBED</strong>
          </div>

        </div>


        <div className="nav-links">

          <a href="#about">
            About Us
          </a>

          <a href="#validation">
            Validation
          </a>

          <a href="#heatmap">
            Heatmap
          </a>

        </div>

      </nav>



      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="hero">

        <div className="hero-content">


          <div className="eyebrow">

            <span className="eyebrow-line"></span>

            <span>
              SATELLITE EMBEDDING
            </span>

            <span className="dot">
              •
            </span>

            <span>
              DEEP OCEAN INTELLIGENCE
            </span>

          </div>


          <h1>

            See the

            <span className="cyan-text">
              {" "}Ocean
            </span>

            <br />

            Beneath the

            <br />

            <strong>
              Surface.
            </strong>

          </h1>


          <p className="hero-description">

            Reconstruct subsurface ocean temperature profiles
            from surface satellite observations using deep learning.

          </p>


          <button
            className="predict-button"
            onClick={handlePredict}
          >

            <span>
              PREDICT
            </span>

            <span className="arrow">
              ↗
            </span>

          </button>



          {/* HERO STATS */}

          <div className="hero-stats">


            <div className="stat">

              <div className="stat-icon">
                ◉
              </div>

              <div>

                <small>
                  OBSERVATION
                </small>

                <strong>
                  Satellite Data
                </strong>

              </div>

            </div>



            <div className="stat">

              <div className="stat-icon">
                ◇
              </div>

              <div>

                <small>
                  RESOLUTION
                </small>

                <strong>
                  0.25° × 0.25°
                </strong>

              </div>

            </div>



            <div className="stat">

              <div className="stat-icon">
                ◇
              </div>

              <div>

                <small>
                  MODEL
                </small>

                <strong>
                  Deep Learning
                </strong>

              </div>

            </div>


          </div>

        </div>



        {/* =================================================
            EARTH
        ================================================= */}

        <div className="earth-area">

          <Earth />

          <div className="earth-status">

            <span></span>

            LIVE OCEAN OBSERVATION

          </div>

        </div>

      </section>



      {/* =================================================
          OCEAN MAP SECTION
      ================================================= */}

      <section
        id="predict-section"
        className="predict-section"
      >

        <MapSection
          onPredict={handleMapPrediction}
        />

      </section>



      {/* =================================================
          SUBSURFACE TEMPERATURE PREDICTION

          NEW UPGRADE
      ================================================= */}

      <OceanPrediction
        predictionInput={predictionInput}
      />

            <section
        id="predict-section"
        className="predict-section"
      >
        <MapSection
          onPredict={handleMapPrediction}
        />
      </section>

      <OceanPrediction
        predictionInput={predictionInput}
      />

      <ValidationSection
        predictionInput={predictionInput}
      />



      

        

    </main>
  );
}

export default App;