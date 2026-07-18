"use strict";

/*
|--------------------------------------------------------------------------
| EPA SETTINGS
|--------------------------------------------------------------------------
*/

const EPA_BASE =
    "https://data.epa.gov/efservice";

const EPA_PUBLIC_SEARCH =
    "https://sdwis.epa.gov/ords/sfdw_pub/" +
    "r/sfdw/sdwis_fed_reports_public/200";

const REQUEST_TIMEOUT =
    20000;


/*
|--------------------------------------------------------------------------
| HTML ELEMENTS
|--------------------------------------------------------------------------
*/

const tabs =
    document.querySelectorAll("[data-report-tab]");

const panels =
    document.querySelectorAll(".report-panel");

const stateSelect =
    document.getElementById("reportState");

const locationTypeSelect =
    document.getElementById("locationType");

const locationInput =
    document.getElementById("reportLocation");

const findButton =
    document.getElementById("findWaterSystemsButton");

const clearButton =
    document.getElementById("clearWaterSystemsButton");

const statusBox =
    document.getElementById("waterSystemStatus");

const resultsBox =
    document.getElementById("waterSystemResults");

const systemSelect =
    document.getElementById("waterSystemSelect");

const systemCard =
    document.getElementById("selectedWaterSystem");

const systemName =
    document.getElementById("selectedSystemName");

const systemId =
    document.getElementById("selectedSystemId");

const systemType =
    document.getElementById("selectedSystemType");

const systemSource =
    document.getElementById("selectedSystemSource");

const systemPopulation =
    document.getElementById("selectedSystemPopulation");

const epaSystemButton =
    document.getElementById("epaSystemButton");

const reportText =
    document.getElementById("waterReportText");

const explainButton =
    document.getElementById("explainReportButton");

const exampleButton =
    document.getElementById("loadReportExampleButton");

const clearTextButton =
    document.getElementById("clearReportTextButton");

const explanationStatus =
    document.getElementById("reportExplanationStatus");

const explanationResults =
    document.getElementById("reportExplanationResults");

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
            tab.setAttribute(
                "aria-selected",
                "false"
            );
        });

        panels.forEach((panel) => {
            panel.classList.remove("active");
        });

        button.classList.add("active");

        button.setAttribute(
            "aria-selected",
            "true"
        );

        const target =
            document.getElementById(
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

    element.textContent =
        message;

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

    element.innerHTML =
        html;

    element.className =
        `report-status show ${type}`;
}


function clearStatus(element) {
    if (!element) {
        return;
    }

    element.textContent = "";
    element.className =
        "report-status";
}


/*
|--------------------------------------------------------------------------
| GENERAL HELPERS
|--------------------------------------------------------------------------
*/

function normalize(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).trim();
}


function normalizeForComparison(value) {
    return normalize(value)
        .toUpperCase()
        .replace(/\bCOUNTY\b/g, "")
        .replace(/\bCITY OF\b/g, "")
        .replace(/\bTOWN OF\b/g, "")
        .replace(/\bSAINT\b/g, "ST")
        .replace(/[.'’]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}


function getValue(record, possibleKeys) {
    if (
        !record ||
        typeof record !== "object"
    ) {
        return "";
    }

    for (const key of possibleKeys) {
        if (
            record[key] !== undefined &&
            record[key] !== null
        ) {
            return record[key];
        }
    }

    const recordKeys =
        Object.keys(record);

    for (const expectedKey of possibleKeys) {
        const actualKey =
            recordKeys.find((recordKey) => {
                return (
                    recordKey.toUpperCase() ===
                    expectedKey.toUpperCase()
                );
            });

        if (
            actualKey &&
            record[actualKey] !== undefined &&
            record[actualKey] !== null
        ) {
            return record[actualKey];
        }
    }

    return "";
}


function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function formatPopulation(value) {
    const cleaned =
        normalize(value).replaceAll(",", "");

    if (!cleaned) {
        return "Not listed";
    }

    const number =
        Number(cleaned);

    if (!Number.isFinite(number)) {
        return normalize(value);
    }

    return number.toLocaleString();
}


/*
|--------------------------------------------------------------------------
| EPA REQUEST
|--------------------------------------------------------------------------
*/

async function fetchJson(url) {
    const controller =
        new AbortController();

    const timeout =
        window.setTimeout(() => {
            controller.abort();
        }, REQUEST_TIMEOUT);

    try {
        console.log(
            "EPA request:",
            url
        );

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
                `EPA returned status ${response.status}.`
            );
        }

        const data =
            await response.json();

        console.log(
            "EPA response:",
            data
        );

        return data;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(
                "The EPA request timed out."
            );
        }

        throw error;
    } finally {
        window.clearTimeout(timeout);
    }
}


/*
|--------------------------------------------------------------------------
| EPA URLS
|--------------------------------------------------------------------------
*/

function createCountyUrl(countyName) {
    return (
        `${EPA_BASE}/SDW_COUNTY_SERVED/` +
        `COUNTYSERVED/${encodeURIComponent(countyName)}/JSON`
    );
}


function createCityUrl(cityName) {
    return (
        `${EPA_BASE}/GEOGRAPHIC_AREA/` +
        `CITY_SERVED/${encodeURIComponent(cityName)}/JSON`
    );
}


function createSystemDetailsDataUrl(pwsId) {
    return (
        `${EPA_BASE}/WATER_SYSTEM/` +
        `PWSID/${encodeURIComponent(pwsId)}/JSON`
    );
}


function createEpaSystemPageUrl(pwsId) {
    return (
        "https://sdwis.epa.gov/ords/sfdw_pub/f" +
        "?p=SDWIS_FED_REPORTS_PUBLIC:PWS_SEARCH" +
        ":::::PWSID:" +
        encodeURIComponent(pwsId)
    );
}


/*
|--------------------------------------------------------------------------
| SYSTEM LABELS
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
| SYSTEM RECORD CREATION
|--------------------------------------------------------------------------
*/

function createSystemFromCountyRecord(record) {
    return {
        pwsId:
            normalize(
                getValue(record, [
                    "PWSID",
                    "PWS_ID"
                ])
            ),

        name:
            normalize(
                getValue(record, [
                    "PWSNAME",
                    "PWS_NAME",
                    "SYSTEM_NAME"
                ])
            ),

        state:
            normalize(
                getValue(record, [
                    "STATE",
                    "STATE_SERVED"
                ])
            ).toUpperCase(),

        county:
            normalize(
                getValue(record, [
                    "COUNTYSERVED",
                    "COUNTY_SERVED"
                ])
            ),

        population:
            getValue(record, [
                "POPULATIONSERVED",
                "POPULATION_SERVED",
                "POPULATION_SERVED_COUNT"
            ]),

        systemType: "Not listed",
        source: "Not listed"
    };
}


function createSystemFromCityRecord(record) {
    return {
        pwsId:
            normalize(
                getValue(record, [
                    "PWSID",
                    "PWS_ID"
                ])
            ),

        name: "",

        state:
            normalize(
                getValue(record, [
                    "STATE_SERVED",
                    "STATE"
                ])
            ).toUpperCase(),

        city:
            normalize(
                getValue(record, [
                    "CITY_SERVED",
                    "CITY"
                ])
            ),

        population: "",

        systemType:
            translateSystemType(
                getValue(record, [
                    "PWS_TYPE_CODE",
                    "PWS_TYPE"
                ])
            ),

        source: "Not listed"
    };
}


/*
|--------------------------------------------------------------------------
| LOAD ADDITIONAL SYSTEM DETAILS
|--------------------------------------------------------------------------
*/

async function addSystemDetails(system) {
    if (!system.pwsId) {
        return system;
    }

    try {
        const records =
            await fetchJson(
                createSystemDetailsDataUrl(
                    system.pwsId
                )
            );

        if (
            !Array.isArray(records) ||
            records.length === 0
        ) {
            return system;
        }

        const record =
            records[0];

        return {
            ...system,

            name:
                normalize(
                    getValue(record, [
                        "PWS_NAME",
                        "PWSNAME",
                        "SYSTEM_NAME",
                        "NAME"
                    ])
                ) ||
                system.name ||
                system.pwsId,

            population:
                getValue(record, [
                    "POPULATION_SERVED_COUNT",
                    "POPULATION_SERVED",
                    "POPULATION",
                    "POP_SERVED"
                ]) ||
                system.population,

            systemType:
                translateSystemType(
                    getValue(record, [
                        "PWS_TYPE_CODE",
                        "PWS_TYPE",
                        "SYSTEM_TYPE"
                    ]) ||
                    system.systemType
                ),

            source:
                translateSource(
                    getValue(record, [
                        "PRIMARY_SOURCE_CODE",
                        "PRIMARY_SOURCE",
                        "SOURCE_WATER_TYPE_CODE",
                        "GW_SW_CODE"
                    ]) ||
                    system.source
                )
        };
    } catch (error) {
        console.warn(
            `Full details were unavailable for ${system.pwsId}.`,
            error
        );

        return {
            ...system,
            name:
                system.name ||
                system.pwsId
        };
    }
}


/*
|--------------------------------------------------------------------------
| SEARCH BY COUNTY
|--------------------------------------------------------------------------
*/

async function searchByCounty(
    state,
    location
) {
    const records =
        await fetchJson(
            createCountyUrl(location)
        );

    if (!Array.isArray(records)) {
        return [];
    }

    const wantedCounty =
        normalizeForComparison(location);

    return records
        .map(createSystemFromCountyRecord)
        .filter((system) => {
            const sameState =
                !system.state ||
                system.state === state;

            const sameCounty =
                normalizeForComparison(
                    system.county
                ) === wantedCounty;

            return (
                system.pwsId &&
                sameState &&
                sameCounty
            );
        });
}


/*
|--------------------------------------------------------------------------
| SEARCH BY CITY
|--------------------------------------------------------------------------
*/

async function searchByCity(
    state,
    location
) {
    const records =
        await fetchJson(
            createCityUrl(location)
        );

    if (!Array.isArray(records)) {
        return [];
    }

    const wantedCity =
        normalizeForComparison(location);

    return records
        .map(createSystemFromCityRecord)
        .filter((system) => {
            const sameState =
                !system.state ||
                system.state === state;

            const sameCity =
                normalizeForComparison(
                    system.city
                ) === wantedCity;

            return (
                system.pwsId &&
                sameState &&
                sameCity
            );
        });
}


/*
|--------------------------------------------------------------------------
| REMOVE DUPLICATES
|--------------------------------------------------------------------------
*/

function removeDuplicateSystems(systems) {
    const unique =
        new Map();

    systems.forEach((system) => {
        if (
            system.pwsId &&
            !unique.has(system.pwsId)
        ) {
            unique.set(
                system.pwsId,
                system
            );
        }
    });

    return Array.from(
        unique.values()
    );
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

    const locationType =
        locationTypeSelect.value;

    const location =
        locationInput.value.trim();

    if (!state) {
        showStatus(
            statusBox,
            "Please select a state.",
            "error"
        );

        stateSelect.focus();
        return;
    }

    if (!location) {
        showStatus(
            statusBox,
            "Please enter a city, town, or county name.",
            "error"
        );

        locationInput.focus();
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
        let systems = [];

        if (locationType === "county") {
            systems =
                await searchByCounty(
                    state,
                    location
                );
        } else {
            systems =
                await searchByCity(
                    state,
                    location
                );
        }

        systems =
            removeDuplicateSystems(systems);

        if (systems.length === 0) {
            showNoResults(
                state,
                location,
                locationType
            );

            return;
        }

        showStatus(
            statusBox,
            "Possible systems found. Loading names and system details...",
            "info"
        );

        const detailRequests =
            systems.map((system) => {
                return addSystemDetails(system);
            });

        currentSystems =
            await Promise.all(
                detailRequests
            );

        currentSystems =
            currentSystems
                .filter((system) => {
                    return Boolean(system.pwsId);
                })
                .sort((first, second) => {
                    const firstName =
                        first.name ||
                        first.pwsId;

                    const secondName =
                        second.name ||
                        second.pwsId;

                    return firstName.localeCompare(
                        secondName
                    );
                });

        populateSystemDropdown();

        const word =
            currentSystems.length === 1
                ? "system"
                : "systems";

        showStatus(
            statusBox,
            `${currentSystems.length} possible water ${word} found. Confirm the correct provider using your water bill.`,
            "info"
        );

        resultsBox.classList.add("show");

        if (currentSystems.length === 1) {
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
                The EPA lookup could not be completed. EPA may be
                temporarily unavailable or may not allow this request
                from the browser.

                <br><br>

                <a
                    href="${EPA_PUBLIC_SEARCH}"
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
| NO RESULTS
|--------------------------------------------------------------------------
*/

function showNoResults(
    state,
    location,
    locationType
) {
    const safeState =
        escapeHtml(state);

    const safeLocation =
        escapeHtml(location);

    const typeLabel =
        locationType === "county"
            ? "county"
            : "city or town";

    showStatusHtml(
        statusBox,
        `
            No public water systems were returned for the
            ${typeLabel}
            <strong>${safeLocation}, ${safeState}</strong>.

            Try checking the spelling, removing the word
            “County,” or searching by the other location type.

            <br><br>

            <a
                href="${EPA_PUBLIC_SEARCH}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Search EPA drinking-water records
            </a>
        `,
        "warning"
    );
}


/*
|--------------------------------------------------------------------------
| POPULATE DROPDOWN
|--------------------------------------------------------------------------
*/

function populateSystemDropdown() {
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

            systemSelect.appendChild(option);
        }
    );
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

    const index =
        Number(systemSelect.value);

    const system =
        currentSystems[index];

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

    epaSystemButton.href =
        createEpaSystemPageUrl(
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
    locationTypeSelect.value =
        "city";

    locationInput.value = "";

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
| REPORT EXPLAINER TERMS
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
            "The text mentions a possible regulatory or monitoring violation. Review the dates, contaminant, corrective action, and current status."
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


/*
|--------------------------------------------------------------------------
| REPORT EXPLAINER
|--------------------------------------------------------------------------
*/

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

    const uniqueUnits =
        Array.from(
            new Set(
                unitMatches.map((unit) => {
                    return unit
                        .replace(/\s+/g, "")
                        .toUpperCase();
                })
            )
        );

    if (uniqueUnits.length > 0) {
        explanationResults.appendChild(
            createExplanationCard(
                "Units found",
                `${uniqueUnits.join(", ")}. Compare a result with a standard only when both use compatible units.`
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
                "The text may describe a result above a limit or action level. Review the original report for the contaminant, dates, required actions, and health information."
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
| EVENTS
|--------------------------------------------------------------------------
*/

findButton.addEventListener(
    "click",
    findWaterSystems
);

clearButton.addEventListener(
    "click",
    clearFinder
);

systemSelect.addEventListener(
    "change",
    displaySelectedSystem
);

locationInput.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            findWaterSystems();
        }
    }
);

explainButton.addEventListener(
    "click",
    explainReport
);

exampleButton.addEventListener(
    "click",
    loadExample
);

clearTextButton.addEventListener(
    "click",
    clearReport
);
