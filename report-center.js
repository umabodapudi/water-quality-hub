"use strict";

const EPA_BASE = "https://data.epa.gov/efservice";
const EPA_SEARCH = "https://enviro.epa.gov/facts/sdwis/search.html";
const EPA_DETAILS = "https://sdwis.epa.gov/ords/sfdw_pub/f";
const REQUEST_TIMEOUT = 20000;

const tabs = document.querySelectorAll("[data-report-tab]");
const panels = document.querySelectorAll(".report-panel");

const stateSelect = document.getElementById("reportState");
const zipInput = document.getElementById("reportZip");
const findButton = document.getElementById("findWaterSystemsButton");
const clearButton = document.getElementById("clearWaterSystemsButton");
const statusBox = document.getElementById("waterSystemStatus");
const resultsBox = document.getElementById("waterSystemResults");
const systemSelect = document.getElementById("waterSystemSelect");
const systemCard = document.getElementById("selectedWaterSystem");

const systemName = document.getElementById("selectedSystemName");
const systemId = document.getElementById("selectedSystemId");
const systemType = document.getElementById("selectedSystemType");
const systemSource = document.getElementById("selectedSystemSource");
const systemPopulation = document.getElementById(
    "selectedSystemPopulation"
);

const annualReportButton = document.getElementById(
    "annualReportButton"
);

const epaButton = document.getElementById("epaSystemButton");

const annualReportUnavailable = document.getElementById(
    "annualReportUnavailable"
);

const reportText = document.getElementById("waterReportText");
const explainButton = document.getElementById(
    "explainReportButton"
);

const exampleButton = document.getElementById(
    "loadReportExampleButton"
);

const clearTextButton = document.getElementById(
    "clearReportTextButton"
);

const explanationStatus = document.getElementById(
    "reportExplanationStatus"
);

const explanationResults = document.getElementById(
    "reportExplanationResults"
);

let currentSystems = [];


/*
|--------------------------------------------------------------------------
| TABS
|--------------------------------------------------------------------------
*/

tabs.forEach((button) => {
    button.addEventListener("click", () => {
        tabs.forEach((tab) => {
            tab.classList.remove("active");
            tab.setAttribute("aria-selected", "false");
        });

        panels.forEach((panel) => {
            panel.classList.remove("active");
        });

        button.classList.add("active");
        button.setAttribute("aria-selected", "true");

        const target = document.getElementById(
            button.dataset.reportTab
        );

        if (target) {
            target.classList.add("active");
        }
    });
});


/*
|--------------------------------------------------------------------------
| STATUS MESSAGES
|--------------------------------------------------------------------------
*/

function showStatus(
    element,
    message,
    type = "info"
) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className =
        `report-status show ${type}`;
}


function showStatusHtml(
    element,
    html,
    type = "info"
) {
    if (!element) {
        return;
    }

    element.innerHTML = html;
    element.className =
        `report-status show ${type}`;
}


function clearStatus(element) {
    if (!element) {
        return;
    }

    element.textContent = "";
    element.className = "report-status";
}


/*
|--------------------------------------------------------------------------
| GENERAL HELPERS
|--------------------------------------------------------------------------
*/

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function normalize(value) {
    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    return String(value).trim();
}


function getValue(record, keys) {
    if (
        !record ||
        typeof record !== "object"
    ) {
        return "";
    }

    for (const key of keys) {
        if (
            record[key] !== undefined &&
            record[key] !== null
        ) {
            return record[key];
        }
    }

    const actualKeys =
        Object.keys(record);

    for (const key of keys) {
        const matchingKey =
            actualKeys.find((actualKey) => {
                return (
                    actualKey.toUpperCase() ===
                    key.toUpperCase()
                );
            });

        if (
            matchingKey &&
            record[matchingKey] !== undefined &&
            record[matchingKey] !== null
        ) {
            return record[matchingKey];
        }
    }

    return "";
}


function formatPopulation(value) {
    const cleanedValue =
        normalize(value).replaceAll(",", "");

    if (!cleanedValue) {
        return "Not listed";
    }

    const population =
        Number(cleanedValue);

    if (!Number.isFinite(population)) {
        return normalize(value);
    }

    return population.toLocaleString();
}


/*
|--------------------------------------------------------------------------
| EPA REQUEST
|--------------------------------------------------------------------------
*/

async function fetchJson(url) {
    const controller =
        new AbortController();

    const timer =
        setTimeout(() => {
            controller.abort();
        }, REQUEST_TIMEOUT);

    try {
        const response =
            await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                cache: "no-store",
                signal: controller.signal
            });

        if (!response.ok) {
            throw new Error(
                `EPA returned status ${response.status}`
            );
        }

        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(
                "EPA request timed out."
            );
        }

        throw error;
    } finally {
        clearTimeout(timer);
    }
}


/*
|--------------------------------------------------------------------------
| EPA URLS
|--------------------------------------------------------------------------
*/

function geographicUrl(zip) {
    return (
        `${EPA_BASE}/GEOGRAPHIC_AREA/` +
        `ZIP_CODE_SERVED/${encodeURIComponent(zip)}/JSON`
    );
}


function detailsUrl(pwsId) {
    return (
        `${EPA_BASE}/WATER_SYSTEM/` +
        `PWSID/${encodeURIComponent(pwsId)}/JSON`
    );
}


function epaSystemUrl(pwsId) {
    return (
        `${EPA_DETAILS}` +
        "?p=SDWIS_FED_REPORTS_PUBLIC%3APWS_SEARCH" +
        "%3A%3A%3A%3A%3APWSID%3A" +
        encodeURIComponent(pwsId)
    );
}


/*
|--------------------------------------------------------------------------
| CODE TRANSLATION
|--------------------------------------------------------------------------
*/

function translateSystemType(code) {
    const value =
        normalize(code).toUpperCase();

    const labels = {
        C: "Community water system",
        CWS: "Community water system",

        NC: "Non-community water system",

        NTNC:
            "Non-transient non-community water system",

        NTCWS:
            "Non-transient non-community water system",

        TNC:
            "Transient non-community water system",

        TNCWS:
            "Transient non-community water system"
    };

    return (
        labels[value] ||
        normalize(code) ||
        "Not listed"
    );
}


function translateSource(code) {
    const value =
        normalize(code).toUpperCase();

    const labels = {
        GW: "Ground water",
        SW: "Surface water",
        GWP: "Purchased ground water",
        SWP: "Purchased surface water",

        GU:
            "Ground water under direct influence of surface water"
    };

    return (
        labels[value] ||
        normalize(code) ||
        "Not listed"
    );
}


/*
|--------------------------------------------------------------------------
| LOAD SYSTEM DETAILS
|--------------------------------------------------------------------------
*/

async function loadSystemDetails(
    pwsId,
    geographicRecord
) {
    const fallback = {
        pwsId: pwsId,

        name: pwsId,

        systemType:
            translateSystemType(
                getValue(
                    geographicRecord,
                    [
                        "PWS_TYPE_CODE",
                        "PWS_TYPE"
                    ]
                )
            ),

        source: "View EPA details",

        population: "",

        reportUrl: ""
    };

    try {
        const records =
            await fetchJson(
                detailsUrl(pwsId)
            );

        if (
            !Array.isArray(records) ||
            records.length === 0
        ) {
            return fallback;
        }

        const record =
            records[0];

        return {
            pwsId: pwsId,

            name:
                normalize(
                    getValue(
                        record,
                        [
                            "PWS_NAME",
                            "PWSNAME",
                            "SYSTEM_NAME",
                            "NAME"
                        ]
                    )
                ) || fallback.name,

            systemType:
                translateSystemType(
                    getValue(
                        record,
                        [
                            "PWS_TYPE_CODE",
                            "PWS_TYPE",
                            "SYSTEM_TYPE"
                        ]
                    )
                ),

            source:
                translateSource(
                    getValue(
                        record,
                        [
                            "PRIMARY_SOURCE_CODE",
                            "PRIMARY_SOURCE",
                            "SOURCE_WATER_TYPE_CODE",
                            "GW_SW_CODE"
                        ]
                    )
                ),

            population:
                getValue(
                    record,
                    [
                        "POPULATION_SERVED_COUNT",
                        "POPULATION_SERVED",
                        "POPULATION",
                        "POP_SERVED"
                    ]
                ),

            reportUrl: ""
        };
    } catch (error) {
        console.warn(
            `Could not load full details for ${pwsId}`,
            error
        );

        return fallback;
    }
}


/*
|--------------------------------------------------------------------------
| FIND WATER SYSTEMS
|--------------------------------------------------------------------------
*/

async function findWaterSystems() {
    clearStatus(statusBox);

    resultsBox.classList.remove("show");
    systemCard.hidden = true;

    systemSelect.innerHTML = `
        <option value="">
            Select a water system
        </option>
    `;

    currentSystems = [];

    const state =
        stateSelect.value
            .trim()
            .toUpperCase();

    const zip =
        zipInput.value.trim();

    if (!state) {
        showStatus(
            statusBox,
            "Please select a state.",
            "error"
        );

        stateSelect.focus();
        return;
    }

    if (!/^\d{5}$/.test(zip)) {
        showStatus(
            statusBox,
            "Please enter a valid five-digit ZIP code.",
            "error"
        );

        zipInput.focus();
        return;
    }

    findButton.disabled = true;
    findButton.textContent =
        "Searching EPA...";

    showStatus(
        statusBox,
        "Searching EPA public water-system records...",
        "info"
    );

    try {
        const records =
            await fetchJson(
                geographicUrl(zip)
            );
        console.log("EPA URL:", geographicUrl(zip));
console.log("EPA records:", records);

        if (!Array.isArray(records)) {
            throw new Error(
                "EPA returned an unexpected response."
            );
        }

        const unique =
            new Map();

        records.forEach((record) => {
            const pwsId =
                normalize(
                    getValue(
                        record,
                        [
                            "PWSID",
                            "PWS_ID"
                        ]
                    )
                );

            const stateServed =
                normalize(
                    getValue(
                        record,
                        [
                            "STATE_SERVED",
                            "STATE_CODE",
                            "STATE"
                        ]
                    )
                ).toUpperCase();

            if (
                pwsId &&
                (
                    !stateServed ||
                    stateServed === state
                )
            ) {
                if (!unique.has(pwsId)) {
                    unique.set(
                        pwsId,
                        record
                    );
                }
            }
        });

        if (unique.size === 0) {
            showStatusHtml(
                statusBox,
                `
                    No public water systems were returned for
                    <strong>
                        ${escapeHtml(zip)},
                        ${escapeHtml(state)}
                    </strong>.

                    EPA service-area records may be incomplete,
                    the utility may use a nearby ZIP code, or the
                    property may use a private well.

                    <br><br>

                    <a
                        href="${EPA_SEARCH}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Search EPA drinking-water records
                    </a>
                `,
                "warning"
            );

            return;
        }

        showStatus(
            statusBox,
            "Systems found. Loading names and details...",
            "info"
        );

        const requests =
            Array.from(
                unique.entries()
            ).map(
                ([pwsId, record]) => {
                    return loadSystemDetails(
                        pwsId,
                        record
                    );
                }
            );

        currentSystems =
            await Promise.all(requests);

        currentSystems.sort(
            (first, second) => {
                const firstName =
                    first.name ||
                    first.pwsId;

                const secondName =
                    second.name ||
                    second.pwsId;

                return firstName.localeCompare(
                    secondName
                );
            }
        );

        currentSystems.forEach(
            (system, index) => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(index);

                option.textContent =
                    `${system.name || system.pwsId}` +
                    ` — ${system.pwsId}`;

                systemSelect.appendChild(
                    option
                );
            }
        );

        const word =
            currentSystems.length === 1
                ? "system"
                : "systems";

        showStatus(
            statusBox,
            `${currentSystems.length} possible water ${word} found. Select the provider that matches your water bill.`,
            "info"
        );

        resultsBox.classList.add("show");

        if (
            currentSystems.length === 1
        ) {
            systemSelect.value = "0";
            displaySelectedSystem();
        }
    } catch (error) {
        console.error(
            "EPA lookup failed:",
            error
        );

        showStatusHtml(
            statusBox,
            `
                The live EPA lookup could not be completed.

                EPA may be temporarily unavailable or may be
                blocking requests from this webpage.

                <br><br>

                <a
                    href="${EPA_SEARCH}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open EPA Water System Search
                </a>
            `,
            "warning"
        );
    } finally {
        findButton.disabled = false;
        findButton.textContent =
            "Find Water Systems";
    }
}


/*
|--------------------------------------------------------------------------
| DISPLAY SELECTED SYSTEM
|--------------------------------------------------------------------------
*/

function displaySelectedSystem() {
    if (systemSelect.value === "") {
        systemCard.hidden = true;
        return;
    }

    const selectedIndex =
        Number(systemSelect.value);

    const system =
        currentSystems[selectedIndex];

    if (!system) {
        systemCard.hidden = true;
        return;
    }

    systemName.textContent =
        system.name ||
        system.pwsId ||
        "Public water system";

    systemId.textContent =
        system.pwsId ||
        "Not listed";

    systemType.textContent =
        system.systemType ||
        "Not listed";

    systemSource.textContent =
        system.source ||
        "Not listed";

    systemPopulation.textContent =
        formatPopulation(
            system.population
        );

    if (system.reportUrl) {
        annualReportButton.href =
            system.reportUrl;

        annualReportButton.hidden =
            false;

        annualReportUnavailable.hidden =
            true;
    } else {
        annualReportButton.removeAttribute(
            "href"
        );

        annualReportButton.hidden =
            true;

        annualReportUnavailable.hidden =
            false;
    }

    epaButton.href =
        epaSystemUrl(
            system.pwsId
        );

    systemCard.hidden = false;
}


/*
|--------------------------------------------------------------------------
| CLEAR FINDER
|--------------------------------------------------------------------------
*/

function clearFinder() {
    stateSelect.value = "";
    zipInput.value = "";

    systemSelect.innerHTML = `
        <option value="">
            Select a water system
        </option>
    `;

    currentSystems = [];

    resultsBox.classList.remove("show");
    systemCard.hidden = true;

    clearStatus(statusBox);
}


/*
|--------------------------------------------------------------------------
| REPORT EXPLAINER
|--------------------------------------------------------------------------
*/

const reportTerms = [
    {
        title:
            "Maximum Contaminant Level (MCL)",

        pattern:
            /\bMCL\b|maximum contaminant level/i,

        explanation:
            "The enforceable limit for a contaminant in public drinking water."
    },

    {
        title:
            "Maximum Contaminant Level Goal (MCLG)",

        pattern:
            /\bMCLG\b|maximum contaminant level goal/i,

        explanation:
            "A non-enforceable public-health goal that may be lower than the legal limit."
    },

    {
        title:
            "Action Level",

        pattern:
            /action level/i,

        explanation:
            "A concentration that triggers treatment, monitoring, public education, or another required action."
    },

    {
        title:
            "Treatment Technique",

        pattern:
            /treatment technique|\bTT\b/i,

        explanation:
            "A required treatment process or operating practice used instead of, or together with, a numerical limit."
    },

    {
        title:
            "Violation",

        pattern:
            /violation|violated|noncompliance|non-compliance/i,

        explanation:
            "The text mentions a possible regulatory or monitoring violation. Check the dates, contaminant, corrective action, and current status."
    },

    {
        title:
            "Non-detect",

        pattern:
            /\bND\b|non[- ]?detect|below detection|not detected/i,

        explanation:
            "The laboratory did not detect the contaminant above its reporting or detection limit. This does not always mean absolute zero."
    },

    {
        title:
            "Health Advisory",

        pattern:
            /health advisory/i,

        explanation:
            "Public-health guidance that is not always an enforceable drinking-water standard."
    },

    {
        title:
            "90th Percentile",

        pattern:
            /90th percentile|90 percentile/i,

        explanation:
            "For lead and copper, the 90th percentile is compared with the applicable action level."
    }
];


function createExplanationCard(
    title,
    explanation
) {
    const card =
        document.createElement(
            "article"
        );

    card.className =
        "explanation-card";

    const heading =
        document.createElement(
            "h3"
        );

    heading.textContent =
        title;

    const paragraph =
        document.createElement(
            "p"
        );

    paragraph.textContent =
        explanation;

    card.appendChild(heading);
    card.appendChild(paragraph);

    return card;
}


function explainReport() {
    clearStatus(explanationStatus);

    explanationResults.innerHTML = "";

    const text =
        reportText.value.trim();

    if (!text) {
        showStatus(
            explanationStatus,
            "Paste report text before selecting Explain This Text.",
            "error"
        );

        reportText.focus();
        return;
    }

    let count = 0;

    reportTerms.forEach((term) => {
        if (term.pattern.test(text)) {
            explanationResults.appendChild(
                createExplanationCard(
                    term.title,
                    term.explanation
                )
            );

            count += 1;
        }
    });

    const unitMatches =
        text.match(
            /\b(?:mg\s*\/\s*l|[µμu]g\s*\/\s*l|ng\s*\/\s*l|ppm|ppb|ppt|ntu|pci\s*\/\s*l)\b/gi
        ) || [];

    const units =
        Array.from(
            new Set(
                unitMatches.map((unit) => {
                    return unit
                        .replace(/\s+/g, "")
                        .toUpperCase();
                })
            )
        );

    if (units.length > 0) {
        explanationResults.appendChild(
            createExplanationCard(
                "Units found",
                `${units.join(", ")}. Compare a result with a standard only when both use compatible units.`
            )
        );

        count += 1;
    }

    const measurements =
        text.match(
            /\b(?:<|≤|>|≥)?\s*\d+(?:\.\d+)?\s*(?:mg\s*\/\s*l|[µμu]g\s*\/\s*l|ng\s*\/\s*l|ppm|ppb|ppt|ntu|pci\s*\/\s*l)\b/gi
        ) || [];

    if (measurements.length > 0) {
        const uniqueMeasurements =
            Array.from(
                new Set(measurements)
            ).slice(0, 15);

        explanationResults.appendChild(
            createExplanationCard(
                "Measurements found",
                uniqueMeasurements.join(", ")
            )
        );

        count += 1;
    }

    if (
        /exceed(?:ed|ance|s)?|above (?:the )?(?:mcl|action level|limit)/i.test(
            text
        )
    ) {
        explanationResults.appendChild(
            createExplanationCard(
                "Possible exceedance",
                "The text may describe a result above a limit or action level. Review the original report for the affected contaminant, dates, required actions, and health information."
            )
        );

        count += 1;
    }

    if (count === 0) {
        showStatus(
            explanationStatus,
            "No common drinking-water terms or measurements were recognized. Try pasting a larger section.",
            "warning"
        );

        return;
    }

    showStatus(
        explanationStatus,
        "The report text was reviewed. Check the original report for dates, sampling locations, units, footnotes, and regulatory comparisons.",
        "info"
    );
}


function loadExample() {
    reportText.value =
        "Lead: 5 ppb. Action Level: 15 ppb. " +
        "MCLG: 0 ppb. Arsenic: ND. " +
        "The system had no MCL violations during the reporting year.";

    explainReport();
}


function clearReport() {
    reportText.value = "";
    explanationResults.innerHTML = "";

    clearStatus(
        explanationStatus
    );
}


/*
|--------------------------------------------------------------------------
| EVENT LISTENERS
|--------------------------------------------------------------------------
*/

if (findButton) {
    findButton.addEventListener(
        "click",
        findWaterSystems
    );
}

if (clearButton) {
    clearButton.addEventListener(
        "click",
        clearFinder
    );
}

if (systemSelect) {
    systemSelect.addEventListener(
        "change",
        displaySelectedSystem
    );
}

if (zipInput) {
    zipInput.addEventListener(
        "input",
        () => {
            zipInput.value =
                zipInput.value
                    .replace(/\D/g, "")
                    .slice(0, 5);
        }
    );

    zipInput.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                findWaterSystems();
            }
        }
    );
}

if (explainButton) {
    explainButton.addEventListener(
        "click",
        explainReport
    );
}

if (exampleButton) {
    exampleButton.addEventListener(
        "click",
        loadExample
    );
}

if (clearTextButton) {
    clearTextButton.addEventListener(
        "click",
        clearReport
    );
}
