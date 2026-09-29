import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./MapSection.css";


/* =========================================================
   CUSTOM GLOWING OCEAN MARKER
========================================================= */

const oceanMarker = L.divIcon({

  className: "ocean-marker-wrapper",

  html: `
    <div class="ocean-marker">
      <div class="marker-pulse"></div>
      <div class="marker-core"></div>
    </div>
  `,

  iconSize: [30, 30],

  iconAnchor: [15, 15],

});


/* =========================================================
   MAP CLICK HANDLER
========================================================= */

function LocationPicker({ onSelect }) {

  useMapEvents({

    click(event) {

      const { lat, lng } = event.latlng;

      onSelect({

        lat: Number(lat.toFixed(5)),

        lng: Number(lng.toFixed(5)),

      });

    },

  });

  return null;
}


/* =========================================================
   MAIN MAP SECTION
========================================================= */

export default function MapSection({ onPredict }) {

  const [location, setLocation] = useState({

    lat: 20.5937,

    lng: 86.8453,

  });


  const [date, setDate] = useState(

    new Date()
      .toISOString()
      .split("T")[0]

  );


  /* =======================================================
     LOCATION HANDLER
  ======================================================= */

  const handleLocation = (newLocation) => {

    setLocation(newLocation);

  };


  /* =======================================================
     LATITUDE HANDLER
  ======================================================= */

  const handleLatitude = (value) => {

    const lat = Number(value);

    if (
      !Number.isNaN(lat) &&
      lat >= -90 &&
      lat <= 90
    ) {

      setLocation((prev) => ({

        ...prev,

        lat,

      }));

    }

  };


  /* =======================================================
     LONGITUDE HANDLER
  ======================================================= */

  const handleLongitude = (value) => {

    const lng = Number(value);

    if (
      !Number.isNaN(lng) &&
      lng >= -180 &&
      lng <= 180
    ) {

      setLocation((prev) => ({

        ...prev,

        lng,

      }));

    }

  };


  return (

    <section className="map-section">


      {/* ===================================================
          BACKGROUND ATMOSPHERE
      =================================================== */}

      <div className="map-glow map-glow-one"></div>

      <div className="map-glow map-glow-two"></div>



      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="map-heading">

        <div className="section-eyebrow">

          <span className="eyebrow-line"></span>

          OCEAN OBSERVATION

        </div>


        <h2>

          Select a point

          <span>
            {" "}beneath the surface.
          </span>

        </h2>


        <p>

          Choose an ocean location to reconstruct
          subsurface temperature using satellite observations.

        </p>

      </div>



      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="map-layout">


        {/* =================================================
            MAP CARD
        ================================================= */}

        <div className="map-card">


          {/* MAP TOP BAR */}

          <div className="map-topbar">

            <div>

              <span className="live-dot"></span>

              LIVE OCEAN MAP

            </div>


            <span className="map-resolution">

              0.25° × 0.25°

            </span>

          </div>



          {/* =================================================
              LEAFLET MAP
          ================================================= */}

          <MapContainer

            center={[
              location.lat,
              location.lng
            ]}

            zoom={4}

            minZoom={2}

            maxZoom={12}

            scrollWheelZoom={true}

            zoomControl={true}

            className="ocean-map"

          >


            {/* =================================================
                SATELLITE IMAGERY

                ESRI WORLD IMAGERY

                No backend/API endpoint is used here.
            ================================================= */}

            <TileLayer

              attribution="Tiles © Esri"

              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

            />



            {/* =================================================
                LABEL + BOUNDARY OVERLAY

                This layer adds:

                • Country names
                • City names
                • Borders
                • Coastlines

                It sits above the satellite imagery.
            ================================================= */}

            <TileLayer

              attribution="Labels © Esri"

              url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"

            />



            {/* =================================================
                LOCATION CLICK
            ================================================= */}

            <LocationPicker

              onSelect={handleLocation}

            />



            {/* =================================================
                SELECTED LOCATION MARKER
            ================================================= */}

            <Marker

              position={[
                location.lat,
                location.lng
              ]}

              icon={oceanMarker}

            />

          </MapContainer>



          {/* =================================================
              COORDINATE OVERLAY
          ================================================= */}

          <div className="map-coordinate">

            <span>
              SELECTED POINT
            </span>


            <strong>

              {location.lat.toFixed(3)}°

              {" "}

              {location.lat >= 0
                ? "N"
                : "S"}

              {"   "}

              {Math.abs(
                location.lng
              ).toFixed(3)}°

              {" "}

              {location.lng >= 0
                ? "E"
                : "W"}

            </strong>

          </div>



          {/* =================================================
              MAP HINT
          ================================================= */}

          <div className="map-hint">

            Click anywhere on the ocean
            to select a location

          </div>


        </div>



        {/* =================================================
            CONTROL PANEL
        ================================================= */}

        <div className="observation-panel">


          {/* PANEL HEADER */}

          <div className="panel-header">

            <div className="panel-icon">

              ◈

            </div>


            <div>

              <span>

                OBSERVATION

              </span>

              <h3>

                Prediction Input

              </h3>

            </div>

          </div>



          {/* =================================================
              LATITUDE
          ================================================= */}

          <div className="input-group">

            <label>

              LATITUDE

              <span>

                −90° to +90°

              </span>

            </label>


            <div className="coordinate-input">

              <input

                type="number"

                step="0.00001"

                value={location.lat}

                onChange={(e) =>
                  handleLatitude(
                    e.target.value
                  )
                }

              />

              <span>

                °

              </span>

            </div>

          </div>



          {/* =================================================
              LONGITUDE
          ================================================= */}

          <div className="input-group">

            <label>

              LONGITUDE

              <span>

                −180° to +180°

              </span>

            </label>


            <div className="coordinate-input">

              <input

                type="number"

                step="0.00001"

                value={location.lng}

                onChange={(e) =>
                  handleLongitude(
                    e.target.value
                  )
                }

              />

              <span>

                °

              </span>

            </div>

          </div>



          {/* =================================================
              DATE
          ================================================= */}

          <div className="input-group">

            <label>

              OBSERVATION DATE

              <span>

                Satellite acquisition

              </span>

            </label>


            <div className="date-input">

              <input

                type="date"

                value={date}

                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }

              />

            </div>

          </div>



          {/* =================================================
              SELECTED LOCATION
          ================================================= */}

          <div className="selected-location">


            <div className="location-status">

              <span></span>

              LOCATION SELECTED

            </div>



            <div className="location-values">


              <div>

                <small>

                  LAT

                </small>

                <strong>

                  {location.lat.toFixed(3)}°

                </strong>

              </div>



              <div>

                <small>

                  LON

                </small>

                <strong>

                  {location.lng.toFixed(3)}°

                </strong>

              </div>


            </div>

          </div>



          {/* =================================================
              RUN PREDICTION
          ================================================= */}

          <button

            className="run-prediction"

            onClick={() =>

              onPredict?.({

                latitude:
                  location.lat,

                longitude:
                  location.lng,

                date,

              })

            }

          >

            <span>

              RUN PREDICTION

            </span>

            <strong>

              ↗

            </strong>

          </button>



          <div className="prediction-note">

            <span>

              ◆

            </span>

            Powered by satellite observations
            &amp; deep learning

          </div>



          {/* =================================================
              BACKEND API — ADD LATER

              When backend is ready, the selected:

              latitude
              longitude
              date

              will be sent to the Flask backend.

              Example future request:

              POST /predict

              The backend will return predicted
              subsurface temperature values.

              DO NOT ADD BACKEND ENDPOINT HERE YET.
          ================================================= */}

        </div>

      </div>

    </section>

  );

}