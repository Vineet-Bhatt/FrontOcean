import React, { useEffect, useMemo, useState } from "react";

import "./ValidationSection.css";

/*
============================================================
OCEAN EMBED — VALIDATION DASHBOARD
============================================================

IMPORTANT FLOW:

The user selects:

    Latitude
    Longitude
    Date

ONLY ON THE MAIN MAP PAGE.

Those values are passed here through:

    predictionInput

This validation page DOES NOT have another
latitude / longitude / date input.

It only displays and validates the SAME
selected observation.

------------------------------------------------------------
BACKEND API — ADD LATER
------------------------------------------------------------

Later the frontend will send predictionInput to:

    POST ENTER_YOUR_BACKEND_URL/validate

Example future request:

{
    latitude: predictionInput.latitude,
    longitude: predictionInput.longitude,
    date: predictionInput.date
}

Backend will return:

    CNN profile
    GLORYS profile
    ARGO profile
    RMSE
    MAE
    Bias
    Improvement

The current depth table below contains DEMO values
for UI development.

Do NOT treat the demo table as actual
location-specific validation data.
============================================================
*/


/*
============================================================
DEPTHS FROM PROJECT / SIH VALIDATION DATA

CNN prediction profile contains:

0, 5, 10, 20, 30, 50, 75,
100, 125, 150, 200, 300,
500, 700, 1000 m

ARGO common comparison excludes 0 m.

Therefore the validation comparison table uses:

5 → 1000 m
============================================================
*/

const VALIDATION_DEPTHS = [
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
DEMO PROFILE

These are ONLY frontend demonstration values.

The actual selected-location values will later
come from the backend.

Do not describe these numbers as actual
ARGO measurements for the selected location.
============================================================
*/

const DEMO_PROFILE = [
  {
    depth: 5,
    cnn: 27.98,
    glorys: 28.05,
    argo: 28.09,
  },
  {
    depth: 10,
    cnn: 27.96,
    glorys: 27.92,
    argo: 26.75,
  },
  {
    depth: 20,
    cnn: 27.92,
    glorys: 27.68,
    argo: 27.02,
  },
  {
    depth: 30,
    cnn: 27.78,
    glorys: 27.41,
    argo: 26.69,
  },
  {
    depth: 50,
    cnn: 27.27,
    glorys: 26.85,
    argo: 25.91,
  },
  {
    depth: 75,
    cnn: 26.37,
    glorys: 26.04,
    argo: 25.20,
  },
  {
    depth: 100,
    cnn: 24.14,
    glorys: 25.28,
    argo: 24.49,
  },
  {
    depth: 125,
    cnn: 21.02,
    glorys: 24.42,
    argo: 23.70,
  },
  {
    depth: 150,
    cnn: 17.98,
    glorys: 23.67,
    argo: 22.84,
  },
  {
    depth: 200,
    cnn: 14.78,
    glorys: 22.08,
    argo: 21.18,
  },
  {
    depth: 300,
    cnn: 12.52,
    glorys: 18.91,
    argo: 17.91,
  },
  {
    depth: 500,
    cnn: 11.02,
    glorys: 14.58,
    argo: 13.48,
  },
  {
    depth: 700,
    cnn: 9.77,
    glorys: 10.92,
    argo: 9.82,
  },
  {
    depth: 1000,
    cnn: 7.76,
    glorys: 7.73,
    argo: 6.69,
  },
];


/*
============================================================
ESTABLISHED POOLED ARGO VALIDATION

From the project's latest fair validator:

CNN RMSE:
1.0416 °C

GLORYS RMSE:
1.1605 °C

Improvement:
10.24 %

CNN MAE:
0.7004 °C

CNN Bias:
+0.4195 °C
============================================================
*/

const POOLED_METRICS = {
  cnnRmse: 1.0416,
  glorysRmse: 1.1605,
  improvement: 10.24,
  mae: 0.7004,
  bias: 0.4195,
};


/*
============================================================
FORMAT LOCATION
============================================================
*/

function formatCoordinate(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "--";
  }

  return Number(value).toFixed(3);
}


/*
============================================================
FORMAT DATE

2024-01-10
→
10 JAN 2024
============================================================
*/

function formatDate(date) {
  if (!date) {
    return "--";
  }

  const parsed = new Date(
    `${date}T00:00:00`
  );

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed
    .toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    )
    .toUpperCase();
}


/*
============================================================
MAIN COMPONENT
============================================================
*/

export default function ValidationSection({
  predictionInput,
}) {

  /*
  ==========================================================
  SELECTED DEPTH
  ==========================================================
  */

  const [selectedDepth, setSelectedDepth] =
    useState(100);


  /*
  ==========================================================
  VALIDATION STATE

  Since this section is for the already-selected
  prediction, validation automatically becomes
  available when predictionInput exists.
  ==========================================================
  */

  const [isValidated, setIsValidated] =
    useState(false);


  /*
  ==========================================================
  RESET VALIDATION WHEN USER CHANGES MAIN LOCATION
  ==========================================================
  */

  useEffect(() => {
    setIsValidated(false);
    setSelectedDepth(100);
  }, [
    predictionInput?.latitude,
    predictionInput?.longitude,
    predictionInput?.date,
  ]);


  /*
  ==========================================================
  LOCATION STATUS

  NIO project domain:

      Latitude  5°–30°
      Longitude 45°–105°
  ==========================================================
  */

  const insideNio =
    predictionInput &&
    Number(predictionInput.latitude) >= 5 &&
    Number(predictionInput.latitude) <= 30 &&
    Number(predictionInput.longitude) >= 45 &&
    Number(predictionInput.longitude) <= 105;


  /*
  ==========================================================
  SELECTED TABLE ROW
  ==========================================================
  */

  const selectedRow = useMemo(() => {

    return (
      DEMO_PROFILE.find(
        (item) =>
          item.depth === selectedDepth
      ) ||
      DEMO_PROFILE[0]
    );

  }, [selectedDepth]);


  /*
  ==========================================================
  AUTO VALIDATION

  In final backend implementation this will be
  replaced by the API request.

  For now it activates the analysis UI when
  a prediction location exists.
  ==========================================================
  */

  useEffect(() => {

    if (
      predictionInput &&
      insideNio
    ) {
      setIsValidated(true);
    }

  }, [
    predictionInput,
    insideNio,
  ]);


  /*
  ==========================================================
  NO LOCATION SELECTED
  ==========================================================
  */

  if (!predictionInput) {

    return (
      <section
        id="validation"
        className="validation-section"
      >

        <div className="validation-empty">

          <div className="validation-empty-icon">
            ◈
          </div>

          <div>

            <span>
              MODEL VALIDATION
            </span>

            <h2>
              Select an ocean location
              first.
            </h2>

            <p>
              Run a prediction from the
              observation map to generate
              the validation comparison.
            </p>

          </div>

        </div>

      </section>
    );
  }


  return (
    <section
      id="validation"
      className="validation-section"
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="validation-header">

        <div className="validation-eyebrow">

          <span></span>

          MODEL VALIDATION

          <span></span>

        </div>


        <h2>

          Validate the
          <br />

          <strong>
            ocean reconstruction.
          </strong>

        </h2>


        <p>

          Independent comparison of the
          selected OceanEmbed reconstruction
          against GLORYS and ARGO observations.

        </p>

      </div>


      {/* ==================================================
          SELECTED OBSERVATION
          
          IMPORTANT:
          NO INPUTS HERE.
          
          These are directly inherited from
          the main prediction page.
      ================================================== */}

      <div className="selected-observation">

        <div className="observation-main">

          <span>
            VALIDATION FOR SELECTED OBSERVATION
          </span>

          <strong>

            {formatCoordinate(
              predictionInput.latitude
            )}

            ° N

            <i>•</i>

            {formatCoordinate(
              predictionInput.longitude
            )}

            ° E

          </strong>

        </div>


        <div className="observation-date">

          <span>
            OBSERVATION DATE
          </span>

          <strong>
            {formatDate(
              predictionInput.date
            )}
          </strong>

        </div>


        <div
          className={
            insideNio
              ? "domain-badge valid"
              : "domain-badge invalid"
          }
        >

          <span></span>

          {insideNio
            ? "SUPPORTED NIO DOMAIN"
            : "OUTSIDE NIO DOMAIN"}

        </div>

      </div>


      {/* ==================================================
          DOMAIN WARNING
      ================================================== */}

      {!insideNio && (

        <div className="validation-warning">

          <span>!</span>

          The selected coordinate is outside
          the supported NIO domain
          <strong>
            5°–30°N / 45°–105°E
          </strong>

        </div>

      )}


      {/* ==================================================
          VALIDATION STATUS
      ================================================== */}

      {insideNio && isValidated && (

        <div className="validation-success">

          <span>✓</span>

          Validation profile loaded for the
          selected observation.

        </div>

      )}


      {/* ==================================================
          COMPARISON TABLE
      ================================================== */}

      <div className="validation-card">

        <div className="card-heading">

          <div>

            <span>
              DEPTH-WISE TEMPERATURE COMPARISON
            </span>

            <h3>
              CNN vs GLORYS vs ARGO
            </h3>

          </div>


          <div className="unit-badge">
            TEMPERATURE · °C
          </div>

        </div>


        <div className="comparison-table-wrap">

          <table className="comparison-table">

            <thead>

              <tr>

                <th>
                  DEPTH
                </th>

                <th>

                  <div className="model-heading cnn">

                    <span></span>

                    CNN

                  </div>

                </th>

                <th>

                  <div className="model-heading glorys">

                    <span></span>

                    GLORYS

                  </div>

                </th>

                <th>

                  <div className="model-heading argo">

                    <span></span>

                    ARGO

                  </div>

                </th>

                <th>
                  CNN − ARGO
                </th>

                <th>
                  GLORYS − ARGO
                </th>

              </tr>

            </thead>


            <tbody>

              {DEMO_PROFILE.map(
                (row) => {

                  const cnnError =
                    row.cnn -
                    row.argo;

                  const glorysError =
                    row.glorys -
                    row.argo;

                  const active =
                    selectedDepth ===
                    row.depth;


                  return (

                    <tr
                      key={row.depth}
                      className={
                        active
                          ? "active-row"
                          : ""
                      }
                      onClick={() =>
                        setSelectedDepth(
                          row.depth
                        )
                      }
                    >

                      <td>

                        <strong>
                          {row.depth}
                        </strong>

                        <small>
                          m
                        </small>

                      </td>


                      <td className="cnn-value">

                        {row.cnn.toFixed(2)}

                      </td>


                      <td className="glorys-value">

                        {row.glorys.toFixed(2)}

                      </td>


                      <td className="argo-value">

                        {row.argo.toFixed(2)}

                      </td>


                      <td
                        className={
                          Math.abs(
                            cnnError
                          ) <
                          Math.abs(
                            glorysError
                          )
                            ? "closer"
                            : ""
                        }
                      >

                        {cnnError >= 0
                          ? "+"
                          : ""}

                        {cnnError.toFixed(2)}

                      </td>


                      <td>

                        {glorysError >= 0
                          ? "+"
                          : ""}

                        {glorysError.toFixed(2)}

                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

        </div>


        <div className="table-footnote">

          <span>●</span>

          CNN = OceanEmbed prediction

          <span>•</span>

          GLORYS = ocean analysis reference

          <span>•</span>

          ARGO = independent observation

        </div>

      </div>


      {/* ==================================================
          SELECTED DEPTH
      ================================================== */}

      <div className="selected-depth-panel">

        <div className="selected-depth-info">

          <span>
            SELECTED DEPTH
          </span>

          <strong>
            {selectedRow.depth} m
          </strong>

        </div>


        <div className="selected-temperature cnn">

          <span>
            CNN
          </span>

          <strong>
            {selectedRow.cnn.toFixed(2)}
            °C
          </strong>

        </div>


        <div className="selected-temperature glorys">

          <span>
            GLORYS
          </span>

          <strong>
            {selectedRow.glorys.toFixed(2)}
            °C
          </strong>

        </div>


        <div className="selected-temperature argo">

          <span>
            ARGO
          </span>

          <strong>
            {selectedRow.argo.toFixed(2)}
            °C
          </strong>

        </div>

      </div>


      {/* ==================================================
          POOLED MODEL METRICS
      ================================================== */}

      <div className="metrics-section">

        <div className="metrics-header">

          <div>

            <span>
              ESTABLISHED POOLED ARGO VALIDATION
            </span>

            <h3>
              Model Performance
            </h3>

          </div>

          <div className="metric-source">
            INDEPENDENT VALIDATOR
          </div>

        </div>


        <div className="metrics-grid">

          <div className="metric-card cnn-card">

            <span>
              CNN RMSE
            </span>

            <strong>
              {POOLED_METRICS.cnnRmse.toFixed(4)}
              °C
            </strong>

            <small>
              CNN vs ARGO
            </small>

          </div>


          <div className="metric-card glorys-card">

            <span>
              GLORYS RMSE
            </span>

            <strong>
              {POOLED_METRICS.glorysRmse.toFixed(4)}
              °C
            </strong>

            <small>
              GLORYS vs ARGO
            </small>

          </div>


          <div className="metric-card improvement-card">

            <span>
              CNN IMPROVEMENT
            </span>

            <strong>
              {POOLED_METRICS.improvement.toFixed(2)}
              %
            </strong>

            <small>
              relative to GLORYS
            </small>

          </div>


          <div className="metric-card">

            <span>
              CNN MAE
            </span>

            <strong>
              {POOLED_METRICS.mae.toFixed(4)}
              °C
            </strong>

            <small>
              Mean Absolute Error
            </small>

          </div>


          <div className="metric-card">

            <span>
              CNN BIAS
            </span>

            <strong>
              +
              {POOLED_METRICS.bias.toFixed(4)}
              °C
            </strong>

            <small>
              Mean Bias
            </small>

          </div>

        </div>

      </div>


      {/* ==================================================
          COMPARISON SUMMARY
      ================================================== */}

      <div className="validation-conclusion">

        <div className="conclusion-icon">
          ◈
        </div>


        <div className="conclusion-content">

          <span>
            VALIDATION SUMMARY
          </span>


          <h3>

            CNN reconstruction is closer
            to ARGO than GLORYS in the
            pooled validation.

          </h3>


          <p>

            The established pooled validation
            reports a CNN RMSE of

            <strong>
              {" "}
              1.0416°C
            </strong>

            compared with

            <strong>
              {" "}
              1.1605°C
            </strong>

            for GLORYS. The reported
            improvement relative to GLORYS
            is

            <strong>
              {" "}
              10.24%
            </strong>.

          </p>

        </div>


        <div className="conclusion-stat">

          <span>
            RMSE DIFFERENCE
          </span>

          <strong>
            0.1189°C
          </strong>

          <small>
            pooled CNN − GLORYS comparison
          </small>

        </div>

      </div>


      {/* ==================================================
          VALIDATION METHODOLOGY
      ================================================== */}

      <div className="validation-methodology">

        <div>

          <span>
            SELECTED LOCATION
          </span>

          <strong>

            {formatCoordinate(
              predictionInput.latitude
            )}
            ° N ·{" "}

            {formatCoordinate(
              predictionInput.longitude
            )}
            ° E

          </strong>

        </div>


        <div>

          <span>
            OBSERVATION DATE
          </span>

          <strong>
            {formatDate(
              predictionInput.date
            )}
          </strong>

        </div>


        <div>

          <span>
            COMMON DEPTH RANGE
          </span>

          <strong>
            5 — 1000 m
          </strong>

        </div>


        <div>

          <span>
            REFERENCE
          </span>

          <strong>
            GLORYS + ARGO
          </strong>

        </div>

      </div>


      {/* ==================================================
          BACKEND API — ADD LATER

          IMPORTANT:

          This is the exact point where the
          frontend will eventually request
          location-specific validation.

          Example:

          const response = await fetch(
            "ENTER_YOUR_BACKEND_URL/validate",
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

          Then replace DEMO_PROFILE with:

          result.profile

          and use:

          result.cnn_rmse
          result.glorys_rmse
          result.improvement
          result.mae
          result.bias

          ==================================================
      */}

    </section>
  );
}