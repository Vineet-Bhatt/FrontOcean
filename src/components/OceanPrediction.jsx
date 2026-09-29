import React, {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  OrbitControls,
  Html,
} from "@react-three/drei";

import * as THREE from "three";

import "./OceanPrediction.css";


/*
============================================================
SIH DEPTH LEVELS
============================================================

Exact depth levels used for the OceanEmbed visualization.

0, 5, 10, 20, 30, 50, 75, 100,
125, 150, 200, 300, 500, 700, 1000 m
============================================================
*/

const DEPTH_LEVELS = [
  0,
  5,
  10,
  20,
  30,
  50,
  75,
  100,
  125,
  150,
  200,
  300,
  500,
  700,
  1000,
];


/*
============================================================
DEMO TEMPERATURES

FRONTEND DEMO ONLY.

These are NOT real CNN predictions.

They will later be replaced with the Flask backend
response for:

latitude
longitude
date
============================================================
*/

const DEMO_TEMPERATURES = {
  0: 28.5,
  5: 28.1,
  10: 27.4,
  20: 26.1,
  30: 25.2,
  50: 24.3,
  75: 23.5,
  100: 22.8,
  125: 21.7,
  150: 20.6,
  200: 18.4,
  300: 15.2,
  500: 12.6,
  700: 9.8,
  1000: 6.1,
};


/*
============================================================
TEMPERATURE COLOR
============================================================
*/

function temperatureColor(temp) {
  const min = 4;
  const max = 30;

  const normalized = THREE.MathUtils.clamp(
    (temp - min) /
      (max - min),
    0,
    1
  );

  const color = new THREE.Color();

  /*
    hot    -> red
    warm   -> orange
    medium -> yellow/green
    cold   -> cyan/blue
  */

  color.setHSL(
    0.67 -
      normalized * 0.67,
    0.92,
    0.50
  );

  return color;
}


/*
============================================================
DEPTH POSITION
============================================================

0m      = top
1000m   = bottom
============================================================
*/

function depthToY(index) {
  const ratio =
    index /
    (DEPTH_LEVELS.length - 1);

  return (
    2.85 -
    ratio * 5.7
  );
}


/*
============================================================
THERMAL PARTICLES
============================================================
*/

function ThermalParticles() {
  const pointsRef =
    useRef();

  const particleData =
    useMemo(() => {
      const count = 380;

      const positions =
        new Float32Array(
          count * 3
        );

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const x =
          (Math.random() - 0.5) *
          4.6;

        const y =
          (Math.random() - 0.5) *
          5.7;

        const z =
          (Math.random() - 0.5) *
          3.5;

        positions[
          i * 3
        ] = x;

        positions[
          i * 3 + 1
        ] = y;

        positions[
          i * 3 + 2
        ] = z;
      }

      return positions;
    }, []);

  useFrame((state) => {
    if (!pointsRef.current)
      return;

    pointsRef.current.rotation.y =
      state.clock.elapsedTime *
      0.025;

    pointsRef.current.position.y =
      Math.sin(
        state.clock.elapsedTime *
          0.45
      ) *
      0.025;
  });

  return (
    <points
      ref={pointsRef}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={
            particleData.length / 3
          }
          array={particleData}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#6de9f7"
        size={0.025}
        transparent
        opacity={0.30}
        depthWrite={false}
      />
    </points>
  );
}


/*
============================================================
3D THERMAL PLANE
============================================================
*/

function ThermalPlane({
  depth,
  index,
  temperature,
  selectedDepth,
}) {
  const selected =
    depth === selectedDepth;

  const y =
    depthToY(index);

  /*
    Build a slightly irregular thermal surface.
  */

  const geometry =
    useMemo(() => {
      const width = 4.35;
      const height = 3.25;

      const geo =
        new THREE.PlaneGeometry(
          width,
          height,
          30,
          24
        );

      const positions =
        geo.attributes.position;

      const colors = [];

      for (
        let i = 0;
        i < positions.count;
        i++
      ) {
        const x =
          positions.getX(i);

        const z =
          positions.getY(i);

        /*
          Demo spatial variation.
          Backend values will replace this later.
        */

        const variation =
          Math.sin(
            x * 2.2 +
              index * 0.55
          ) *
            0.45 +

          Math.cos(
            z * 2.0 -
              index * 0.30
          ) *
            0.32 +

          Math.sin(
            (x + z) *
              1.7
          ) *
            0.18;

        const localTemp =
          temperature +
          variation;

        const color =
          temperatureColor(
            localTemp
          );

        colors.push(
          color.r,
          color.g,
          color.b
        );
      }

      geo.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(
          colors,
          3
        )
      );

      return geo;
    }, [
      temperature,
      index,
    ]);

  return (
    <group
      position={[
        0,
        y,
        0,
      ]}
    >

      {/* ==================================================
          MAIN THERMAL FIELD
      ================================================== */}

      <mesh
        geometry={geometry}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          transparent
          opacity={
            selected
              ? 0.92
              : 0.11
          }
          roughness={0.3}
          metalness={0.02}
          emissive={
            selected
              ? temperatureColor(
                  temperature
                )
              : new THREE.Color(
                  "#000000"
                )
          }
          emissiveIntensity={
            selected
              ? 0.18
              : 0
          }
        />
      </mesh>


      {/* ==================================================
          SCIENTIFIC GRID
      ================================================== */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          0.025,
          0,
        ]}
      >
        <planeGeometry
          args={[
            4.40,
            3.30,
            18,
            12,
          ]}
        />

        <meshBasicMaterial
          color={
            selected
              ? "#dffcff"
              : "#5ce2f1"
          }
          wireframe
          transparent
          opacity={
            selected
              ? 0.24
              : 0.035
          }
        />
      </mesh>


      {/* ==================================================
          SELECTED DEPTH GLOW
      ================================================== */}

      {selected && (
        <mesh
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
          position={[
            0,
            0.04,
            0,
          ]}
        >
          <planeGeometry
            args={[
              4.55,
              3.45,
            ]}
          />

          <meshBasicMaterial
            color={
              temperatureColor(
                temperature
              )
            }
            transparent
            opacity={0.12}
            blending={
              THREE.AdditiveBlending
            }
          />
        </mesh>
      )}


      {/* ==================================================
          DEPTH LABEL

          IMPORTANT:
          0m gets a dedicated larger label so it
          does not disappear inside the top surface.
      ================================================== */}

      <Html
        position={[
          2.45,
          selected ? 0.08 : 0,
          1.65,
        ]}
        center
        distanceFactor={8}
      >

        <div
          className={
            selected
              ? "depth-hud selected"
              : "depth-hud"
          }
        >

          <span>
            {depth === 0
              ? "SURFACE"
              : "DEPTH"}
          </span>

          <strong>
            {depth} m
          </strong>

          {selected && (
            <em>
              {temperature.toFixed(
                1
              )}
              °C
            </em>
          )}

        </div>

      </Html>

    </group>
  );
}


/*
============================================================
OCEAN VOLUME
============================================================
*/

function OceanVolume() {
  return (
    <group>

      {/* Main glass-like volume */}

      <mesh>
        <boxGeometry
          args={[
            4.55,
            5.82,
            3.48,
          ]}
        />

        <meshPhysicalMaterial
          color="#087d9b"
          transparent
          opacity={0.035}
          roughness={0.12}
          transmission={0.18}
          thickness={1.2}
          side={THREE.DoubleSide}
        />
      </mesh>


      {/* Vertical side edges */}

      {[
        [-2.27, 0, -1.74],
        [2.27, 0, -1.74],
        [-2.27, 0, 1.74],
        [2.27, 0, 1.74],
      ].map(
        (position, index) => (
          <mesh
            key={index}
            position={position}
          >
            <cylinderGeometry
              args={[
                0.012,
                0.012,
                5.8,
                8,
              ]}
            />

            <meshBasicMaterial
              color="#4dd9ec"
              transparent
              opacity={0.24}
            />
          </mesh>
        )
      )}


      {/* Surface cap */}

      <mesh
        position={[
          0,
          2.88,
          0,
        ]}
      >
        <boxGeometry
          args={[
            4.58,
            0.025,
            3.52,
          ]}
        />

        <meshBasicMaterial
          color="#7aeeff"
          transparent
          opacity={0.40}
        />
      </mesh>

    </group>
  );
}


/*
============================================================
DEPTH AXIS
============================================================
*/

function DepthAxis({
  selectedDepth,
}) {
  return (
    <group
      position={[
        -2.62,
        0,
        0,
      ]}
    >

      {/* Axis */}

      <mesh>
        <cylinderGeometry
          args={[
            0.009,
            0.009,
            5.85,
            8,
          ]}
        />

        <meshBasicMaterial
          color="#67e7f5"
          transparent
          opacity={0.58}
        />
      </mesh>


      {DEPTH_LEVELS.map(
        (depth, index) => {
          const y =
            depthToY(index);

          const active =
            depth ===
            selectedDepth;

          return (
            <group
              key={depth}
              position={[
                0,
                y,
                0,
              ]}
            >

              {/* Tick */}

              <mesh
                position={[
                  0.09,
                  0,
                  0,
                ]}
              >
                <boxGeometry
                  args={[
                    active
                      ? 0.30
                      : 0.17,
                    active
                      ? 0.025
                      : 0.015,
                    0.015,
                  ]}
                />

                <meshBasicMaterial
                  color={
                    active
                      ? "#ffffff"
                      : "#5eddeb"
                  }
                />
              </mesh>


              {/* 0m axis label */}

              <Html
                position={[
                  -0.12,
                  0,
                  0,
                ]}
                center
              >

                <div
                  className={
                    active
                      ? "axis-depth active"
                      : "axis-depth"
                  }
                >
                  {depth} m
                </div>

              </Html>

            </group>
          );
        }
      )}

    </group>
  );
}


/*
============================================================
SCANNING LINE
============================================================
*/

function ScanLine() {
  const ref =
    useRef();

  useFrame((state) => {
    if (!ref.current)
      return;

    ref.current.position.y =
      2.82 -
      ((state.clock.elapsedTime *
        0.75) %
        5.6);
  });

  return (
    <mesh
      ref={ref}
      position={[
        0,
        2.8,
        0,
      ]}
    >
      <boxGeometry
        args={[
          4.7,
          0.008,
          3.55,
        ]}
      />

      <meshBasicMaterial
        color="#68efff"
        transparent
        opacity={0.18}
        blending={
          THREE.AdditiveBlending
        }
      />
    </mesh>
  );
}


/*
============================================================
3D SCENE
============================================================
*/

function ThermalScene({
  temperatures,
  selectedDepth,
}) {
  const groupRef =
    useRef();

  useFrame(
    (_, delta) => {
      if (!groupRef.current)
        return;

      /*
        Very slow automatic rotation.

        User can still manually rotate with mouse.
      */

      groupRef.current.rotation.y +=
        delta * 0.035;
    }
  );

  return (
    <>

      <ambientLight
        intensity={0.75}
      />

      <directionalLight
        position={[
          6,
          8,
          7,
        ]}
        intensity={2.6}
      />

      <directionalLight
        position={[
          -5,
          2,
          -5,
        ]}
        intensity={1.0}
        color="#24d1ec"
      />

      <pointLight
        position={[
          0,
          3,
          4,
        ]}
        intensity={1.3}
        color="#7cefff"
      />

      <group
        ref={groupRef}
      >

        <OceanVolume />

        <ThermalParticles />

        <DepthAxis
          selectedDepth={
            selectedDepth
          }
        />

        <ScanLine />


        {DEPTH_LEVELS.map(
          (depth, index) => (
            <ThermalPlane
              key={depth}
              depth={depth}
              index={index}
              temperature={
                temperatures[
                  depth
                ]
              }
              selectedDepth={
                selectedDepth
              }
            />
          )
        )}

      </group>


      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={6.5}
        maxDistance={13}
        minPolarAngle={0.55}
        maxPolarAngle={2.6}
        target={[
          0,
          0,
          0,
        ]}
      />

    </>
  );
}


/*
============================================================
TEMPERATURE LEGEND
============================================================
*/

function TemperatureLegend() {
  return (
    <div className="scientific-legend">

      <div className="legend-heading">
        TEMPERATURE
        <strong>°C</strong>
      </div>

      <div className="legend-body">

        <div className="legend-gradient"></div>

        <div className="legend-labels">

          <span>30</span>
          <span>28</span>
          <span>24</span>
          <span>20</span>
          <span>16</span>
          <span>12</span>
          <span>8</span>
          <span>4</span>
          <span>0</span>

        </div>

      </div>

      <div className="legend-caption">
        WARM → COLD
      </div>

    </div>
  );
}


/*
============================================================
MAIN COMPONENT
============================================================
*/

export default function OceanPrediction({
  predictionInput,
}) {
  const [
    selectedDepth,
    setSelectedDepth,
  ] = useState(100);


  /*
    Current demo data.

    Later replaced with backend response.
  */

  const temperatures =
    DEMO_TEMPERATURES;

  const selectedTemperature =
    temperatures[
      selectedDepth
    ];


  return (
    <section
      id="temperature-section"
      className="prediction-section"
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="prediction-header">

        <div className="prediction-eyebrow">

          <span></span>

          SUBSURFACE OCEAN INTELLIGENCE

          <span></span>

        </div>


        <h2>
          See the temperature
          <br />

          <strong>
            beneath the surface.
          </strong>
        </h2>


        <p>
          Three-dimensional reconstruction
          of the subsurface ocean temperature
          field across the SIH target depths.
        </p>

      </div>


      {/* ==================================================
          SCIENTIFIC INPUT BAR
      ================================================== */}

      <div className="prediction-info">

        <div className="info-item">

          <span>
            LATITUDE
          </span>

          <strong>
            {predictionInput
              ? Number(
                  predictionInput.latitude
                ).toFixed(3)
              : "--"}
            °
          </strong>

        </div>


        <div className="info-item">

          <span>
            LONGITUDE
          </span>

          <strong>
            {predictionInput
              ? Number(
                  predictionInput.longitude
                ).toFixed(3)
              : "--"}
            °
          </strong>

        </div>


        <div className="info-item">

          <span>
            OBSERVATION DATE
          </span>

          <strong>
            {predictionInput?.date ||
              "--"}
          </strong>

        </div>


        <div className="info-item">

          <span>
            DEPTH DOMAIN
          </span>

          <strong>
            0 — 1000 m
          </strong>

        </div>


        <div className="info-item">

          <span>
            SELECTED LAYER
          </span>

          <strong>
            {selectedDepth} m
          </strong>

        </div>


        <div className="info-temperature">

          <span>
            TEMPERATURE
          </span>

          <strong>
            {selectedTemperature.toFixed(
              1
            )}
            °C
          </strong>

        </div>

      </div>


      {/* ==================================================
          MAIN 3D SCIENTIFIC VISUALIZATION

          VIDEO = BACKGROUND
          3D FIELD = FOREGROUND
      ================================================== */}

      <div className="scientific-visual">


        {/* VIDEO */}

        <video
          className="temperature-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >

          <source
            src="/ocean_subsurface_demo.mp4"
            type="video/mp4"
          />

          Your browser does not support
          HTML5 video.

        </video>


        {/* Video visual treatment */}

        <div className="video-overlay"></div>


        {/* Grid overlay */}

        <div className="scientific-grid"></div>


        {/* ==================================================
            TOP LEFT TITLE
        ================================================== */}

        <div className="scientific-title">

          <div className="title-top">

            <span className="title-dot"></span>

            OCEAN EMBED

          </div>

          <strong>
            SUBSURFACE TEMPERATURE FIELD
          </strong>

          <small>
            3D RECONSTRUCTION · 0–1000 m
          </small>

        </div>


        {/* ==================================================
            TOP RIGHT STATUS
        ================================================== */}

        <div className="observation-status">

          <span></span>

          MODEL VISUALIZATION

        </div>


        {/* ==================================================
            3D CANVAS
        ================================================== */}

        <div className="temperature-3d">

          <Canvas
            camera={{
              position: [
                7.7,
                4.4,
                7.7,
              ],
              fov: 42,
              near: 0.1,
              far: 100,
            }}
            dpr={[
              1,
              2,
            ]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference:
                "high-performance",
            }}
          >

            <ThermalScene
              temperatures={
                temperatures
              }
              selectedDepth={
                selectedDepth
              }
            />

          </Canvas>

        </div>


        {/* ==================================================
            LEFT DEPTH DOMAIN
        ================================================== */}

        <div className="depth-domain">

          <span>
            DEPTH
          </span>

          <strong>
            0 m
          </strong>

          <i></i>

          <strong>
            1000 m
          </strong>

        </div>


        {/* ==================================================
            TEMPERATURE LEGEND
        ================================================== */}

        <TemperatureLegend />


        {/* ==================================================
            SELECTED DATA HUD
        ================================================== */}

        <div className="selected-hud">

          <div className="hud-header">

            <span></span>

            SELECTED OBSERVATION

          </div>


          <div className="hud-main">

            <div>

              <small>
                DEPTH
              </small>

              <strong>
                {selectedDepth}
                <em>m</em>
              </strong>

            </div>


            <div className="hud-divider"></div>


            <div>

              <small>
                TEMPERATURE
              </small>

              <strong className="hud-temperature">
                {selectedTemperature.toFixed(
                  2
                )}
                <em>°C</em>
              </strong>

            </div>

          </div>

        </div>


        {/* ==================================================
            BOTTOM INSTRUCTION
        ================================================== */}

        <div className="three-d-help">

          <span>
            ◈
          </span>

          DRAG TO ROTATE

          <i></i>

          SCROLL TO ZOOM

          <i></i>

          SELECT DEPTH BELOW

        </div>


        {/* ==================================================
            CORNER TECHNICAL DATA
        ================================================== */}

        <div className="technical-readout">

          <div>
            <span>FIELD</span>
            <strong>SST → SUBSURFACE</strong>
          </div>

          <div>
            <span>DOMAIN</span>
            <strong>0–1000 m</strong>
          </div>

          <div>
            <span>GRID</span>
            <strong>0.25°</strong>
          </div>

        </div>

      </div>


      {/* ==================================================
          DEPTH SELECTOR
      ================================================== */}

      <div className="depth-selector">

        <div className="depth-selector-header">

          <div>

            <span>
              SIH TARGET DEPTHS
            </span>

            <h3>
              Explore the temperature field
            </h3>

          </div>


          <div className="current-depth">

            <span>
              ACTIVE LAYER
            </span>

            <strong>
              {selectedDepth} m
            </strong>

          </div>

        </div>


        <div className="depth-buttons">

          {DEPTH_LEVELS.map(
            (depth) => {

              const active =
                depth ===
                selectedDepth;

              return (
                <button
                  key={depth}
                  className={
                    active
                      ? "depth-button active"
                      : "depth-button"
                  }
                  onClick={() =>
                    setSelectedDepth(
                      depth
                    )
                  }
                >

                  <strong>
                    {depth}
                  </strong>

                  <small>
                    m
                  </small>

                </button>
              );
            }
          )}

        </div>

      </div>


      {/* ==================================================
          SELECTED RESULT
      ================================================== */}

      <div className="result-panel">

        <div className="result-block">

          <span>
            SELECTED DEPTH
          </span>

          <strong>
            {selectedDepth} m
          </strong>

        </div>


        <div className="result-line"></div>


        <div className="result-block">

          <span>
            RECONSTRUCTED TEMPERATURE
          </span>

          <strong className="result-temperature">
            {selectedTemperature.toFixed(
              2
            )}
            °C
          </strong>

        </div>


        <div className="result-line"></div>


        <div className="result-block">

          <span>
            DEPTH DOMAIN
          </span>

          <strong>
            0 — 1000 m
          </strong>

        </div>

      </div>


      {/* ==================================================
          DEPTH PROFILE
      ================================================== */}

      <div className="profile-section">

        <div className="profile-heading">

          <div>

            <span>
              TEMPERATURE PROFILE
            </span>

            <h3>
              Depth-wise reconstructed temperature
            </h3>

          </div>


          <div className="profile-unit">
            °C
          </div>

        </div>


        <div className="profile-table">

          <div className="profile-table-head">

            <span>
              DEPTH
            </span>

            <span>
              TEMPERATURE
            </span>

            <span>
              THERMAL FIELD
            </span>

          </div>


          {DEPTH_LEVELS.map(
            (depth) => {

              const temp =
                temperatures[
                  depth
                ];

              const active =
                selectedDepth ===
                depth;

              const width =
                Math.max(
                  7,
                  ((temp - 4) /
                    26) *
                    100
                );

              return (
                <button
                  key={depth}
                  className={
                    active
                      ? "profile-row active"
                      : "profile-row"
                  }
                  onClick={() =>
                    setSelectedDepth(
                      depth
                    )
                  }
                >

                  <span className="table-depth">
                    {depth} m
                  </span>


                  <strong className="table-temp">
                    {temp.toFixed(1)}
                    °C
                  </strong>


                  <span className="table-bar">

                    <span
                      style={{
                        width:
                          `${width}%`,

                        background:
                          temperatureColor(
                            temp
                          ).getStyle(),
                      }}
                    />

                  </span>

                </button>
              );
            }
          )}

        </div>

      </div>


      {/* ==================================================
          BACKEND API — ADD LATER
      ==================================================

      IMPORTANT:

      Frontend currently uses DEMO_TEMPERATURES.

      Later the frontend will send:

      latitude
      longitude
      date

      to the Flask backend.

      Example future implementation:

      const response = await fetch(
        "ENTER_YOUR_BACKEND_URL/predict",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            latitude:
              predictionInput.latitude,

            longitude:
              predictionInput.longitude,

            date:
              predictionInput.date,
          }),
        }
      );

      const result =
        await response.json();

      Expected response:

      {
        "temperatures": {
          "0": 28.5,
          "5": 28.1,
          "10": 27.4,
          "20": 26.1,
          "30": 25.2,
          "50": 24.3,
          "75": 23.5,
          "100": 22.8,
          "125": 21.7,
          "150": 20.6,
          "200": 18.4,
          "300": 15.2,
          "500": 12.6,
          "700": 9.8,
          "1000": 6.1
        }
      }

      Then replace DEMO_TEMPERATURES with
      the backend result.

      DO NOT ADD THE REAL API ENDPOINT YET.

      ================================================== */}

    </section>
  );
}