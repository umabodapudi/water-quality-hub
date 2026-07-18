"use strict";


/*
|--------------------------------------------------------------------------
| WATER QUALITY HUB — REPORT CENTER
|--------------------------------------------------------------------------
|
| This file works with the report-center.html IDs previously provided.
|
| The water-system finder:
|   1. Reads the selected state and ZIP code.
|   2. Requests ZIP-to-PWS records from EPA Envirofacts.
|   3. Removes duplicate PWS IDs.
|   4. Requests system details for each PWS ID.
|   5. Populates the water-system dropdown.
|   6. Links the selected system to EPA SDWIS details.
|
| No local database and no manually entered ZIP-code list are required.
|
| Important:
| EPA service-area records can be incomplete, and one ZIP code can contain
| multiple public water systems. Users should confirm their provider using
| a water bill, landlord, property manager, or local utility.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| CONFIGURATION
|--------------------------------------------------------------------------
*/

const EPA_ENVIROFACTS_BASE_URL =
    "https://data.epa.gov/efservice";

const EPA_SDWIS_SEARCH_URL =
    "https://enviro.epa.gov/facts/sdwis/search.html";

const EPA_SDWIS_DETAILS_BASE_URL =
    "https://sdwis.epa.gov/ords/sfdw_pub/f";

const EPA_REQUEST_TIMEOUT_MS = 20000;


/*
|--------------------------------------------------------------------------
| PAGE ELEMENTS
|--------------------------------------------------------------------------
*/

const reportTabs =
    document.querySelectorAll("[data-report-tab]");

const reportPanels =
    document.querySelectorAll(".report-panel");

const stateSelect =
    document.getElementById("reportState");

const zipInput =
    document.getElementById("reportZip");

const findSystemsButton =
    document.getElementById("findWaterSystemsButton");

const clearSystemsButton =
    document.getElementById("clearWaterSystemsButton");

const systemStatus =
    document.getElementById("waterSystemStatus");

const systemResults =
    document.getElementById("waterSystemResults");

const systemSelect =
    document.getElementById("waterSystemSelect");

const selectedSystemCard =
    document.getElementById("selectedWaterSystem");

const selectedSystemName =
    document.getElementById("selectedSystemName");

const selectedSystemId =
    document.getElementById("selectedSystemId");

const selectedSystemType =
    document.getElementById("selectedSystemType");

const selectedSystemSource =
    document.getElementById("selectedSystemSource");

const selectedSystemPopulation =
    document.getElementById("selectedSystemPopulation");

const annualReportButton =
    document.getElementById("annualReportButton");

const epaSystemButton =
    document.getElementById("epaSystemButton");

const annualReportUnavailable =
    document.getElementById("annualReportUnavailable");

const reportText =
    document.getElementById("waterReportText");

const explainReportButton =
    document.getElementById("explainReportButton");

const loadExampleButton =
    document.getElementById("loadReportExampleButton");

const clearReportTextButton =
    document.getElementById("clearReportTextButton");

const explanationStatus =
    document.getElementById("reportExplanationStatus");

const explanationResults =
    document.getElementById("reportExplanationResults");

let currentWaterSystems = [];


/*
|--------------------------------------------------------------------------
| ELEMENT CHECK
|--------------------------------------------------------------------------
|
| This gives a useful console error when the JavaScript is loaded on a page
| that does not contain the expected Report Center HTML.
|
*/

const requiredElements = {
    stateSelect,
    zipInput,
    findSystemsButton,
    clearSystemsButton,
    systemStatus,
    systemResults,
    systemSelect,
    selectedSystemCard,
    selectedSystemName,
    selectedSystemId,
    selectedSystemType,
    selectedSystemSource,
    selectedSystemPopulation,
    annualReportButton,
    epaSystemButton,
    annualReportUnavailable,
    reportText,
    explainReportButton,
    loadExampleButton,
    clearReportTextButton,
    explanationStatus,
    explanationResults
};

const missingElements = Object.entries(requiredElements)
    .filter(([, element]) => !element)
    .map(([name]) => name);

if (missingElements.length > 0) {
    console.error(
        "Report Center could not start because these HTML elements are missing:",
        missingElements.join(", ")
    );
}


/*
|--------------------------------------------------------------------------
| TAB CONTROLS
|--------------------------------------------------------------------------
*/

reportTabs.forEach((tabButton) => {
    tabButton.addEventListener("click", () => {
        const targetPanelId =
            tabButton.dataset.reportTab;

        reportTabs.forEach((button) => {
            button.classList.remove("active");
            button.setAttribute("aria-selected", "false");
        });

        reportPanels.forEach((panel) => {
            panel.classList.remove("active");
        });

        tabButton.classList.add("active");
        tabButton.setAttribute("aria-selected", "true");

        const targetPanel =
            document.getElementById(targetPanelId);

        if (targetPanel) {
            targetPanel.classList.add("active");
        }
    });
});


/*
|--------------------------------------------------------------------------
| STATUS HELPERS
|--------------------------------------------------------------------------
*/

function showStatus(
    element,
    message,
    statusType = "info"
) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className =
        `report-status show ${statusType}`;
}


function showStatusHtml(
    element,
    html,
    statusType = "info"
) {
    if (!element) {
        return;
    }

    element.innerHTML = html;
    element.className =
        `report-status show ${statusType}`;
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

function normalizeText(value) {
    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    return String(value).trim();
}


function getRecordValue(record, possibleKeys) {
    if (
        !record ||
        typeof record !== "object"
    ) {
        return "";
    }

    for (const key of possibleKeys) {
        if (
            Object.prototype.hasOwnProperty.call(record, key) &&
            record[key] !== null &&
            record[key] !== undefined
        ) {
            return record[key];
        }
    }

    const uppercaseKeyMap = new Map(
        Object.keys(record).map((key) => [
            key.toUpperCase(),
            key
        ])
    );

    for (const key of possibleKeys) {
        const actualKey =
            uppercaseKeyMap.get(key.toUpperCase());

        if (
            actualKey &&
            record[actualKey] !== null &&
            record[actualKey] !== undefined
        ) {
            return record[actualKey];
        }
    }

    return "";
}


function formatPopulation(value) {
    const normalized =
        normalizeText(value).replaceAll(",", "");

    if (!normalized) {
        return "Not listed";
    }

    const population =
        Number(normalized);

    if (!Number.isFinite(population)) {
        return normalizeText(value);
    }

    return population.toLocaleString();
}


function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function createAbortController(timeoutMilliseconds) {
    const controller =
        new AbortController();

    const timeoutId =
        window.setTimeout(() => {
            controller.abort();
        }, timeoutMilliseconds);

    return {
        controller,
        clear() {
            window.clearTimeout(timeoutId);
        }
    };
}


async function fetchJsonWithTimeout(
    url,
    timeoutMilliseconds = EPA_REQUEST_TIMEOUT_MS
) {
    const requestControl =
        createAbortController(timeoutMilliseconds);

    try {
        const response =
            await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                cache: "no-store",
                signal: requestControl.controller.signal
            });

        if (!response.ok) {
            throw new Error(
                `EPA request failed with status ${response.status}.`
            );
        }

        const data =
            await response.json();

        return data;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(
                "The EPA request took too long and was stopped."
            );
        }

        throw error;
    } finally {
        requestControl.clear();
    }
}


/*
|--------------------------------------------------------------------------
| EPA LINKS
|--------------------------------------------------------------------------
*/

function createEpaSystemDetailsUrl(pwsId) {
    /*
     * This is EPA's SDWIS Federal Reporting Services PWS search format.
     * It opens the selected PWS ID directly.
     */
    const application =
        "SDWIS_FED_REPORTS_PUBLIC";

    const page =
        "PWS_SEARCH";

    const encodedPwsId =
        encodeURIComponent(pwsId);

    return (
        `${EPA_SDWIS_DETAILS_BASE_URL}` +
        `?p=${application}%3A${page}` +
        `%3A%3A%3A%3A%3APWSID%3A${encodedPwsId}`
    );
}


function createEpaFallbackSearchUrl() {
    return EPA_SDWIS_SEARCH_URL;
}


/*
|--------------------------------------------------------------------------
| EPA DATA URL BUILDERS
|--------------------------------------------------------------------------
*/

function createGeographicAreaUrl(zipCode) {
    /*
     * GEOGRAPHIC_AREA contains:
     * PWSID, STATE_SERVED, ZIP_CODE_SERVED, CITY_SERVED,
     * COUNTY_SERVED, PWS_TYPE_CODE and activity information.
     *
     * We query by ZIP first, then verify state in JavaScript.
     */
    return (
        `${EPA_ENVIROFACTS_BASE_URL}` +
        `/GEOGRAPHIC_AREA` +
        `/ZIP_CODE_SERVED/${encodeURIComponent(zipCode)}` +
        `/JSON`
    );
}


function createWaterSystemDetailsUrl(pwsId) {
    /*
     * WATER_SYSTEM commonly contains system name, population,
     * source type, activity status and PWS type.
     */
    return (
        `${EPA_ENVIROFACTS_BASE_URL}` +
        `/WATER_SYSTEM` +
        `/PWSID/${encodeURIComponent(pwsId)}` +
        `/JSON`
    );
}


/*
|--------------------------------------------------------------------------
| EPA RECORD PARSING
|--------------------------------------------------------------------------
*/

function getPwsId(record) {
    return normalizeText(
        getRecordValue(record, [
            "PWSID",
            "PWS_ID"
        ])
    );
}


function getStateServed(record) {
    return normalizeText(
        getRecordValue(record, [
            "STATE_SERVED",
            "STATE_CODE",
            "STATE"
        ])
    ).toUpperCase();
}


function getSystemName(record) {
    return normalizeText(
        getRecordValue(record, [
            "PWS_NAME",
            "PWSNAME",
            "SYSTEM_NAME",
            "NAME"
        ])
    );
}


function getSystemType(record) {
    return normalizeText(
        getRecordValue(record, [
            "PWS_TYPE_CODE",
            "PWS_TYPE",
            "SYSTEM_TYPE"
        ])
    );
}


function getPrimarySource(record) {
    return normalizeText(
        getRecordValue(record, [
            "PRIMARY_SOURCE_CODE",
            "PRIMARY_SOURCE",
            "SOURCE_WATER_TYPE_CODE",
            "GW_SW_CODE",
            "SOURCE_TYPE"
        ])
    );
}


function getPopulation(record) {
    return getRecordValue(record, [
        "POPULATION_SERVED_COUNT",
        "POPULATION_SERVED",
        "POPULATION",
        "POP_SERVED"
    ]);
}


function getActivityCode(record) {
    return normalizeText(
        getRecordValue(record, [
            "PWS_ACTIVITY_CODE",
            "ACTIVITY_STATUS_CODE",
            "ACTIVITY_STATUS"
        ])
    );
}


function translateSystemType(code) {
    const normalized =
        normalizeText(code).toUpperCase();

    const typeLabels = {
        C: "Community water system",
        NC: "Non-community water system",
        NTNC: "Non-transient non-community water system",
        TNC: "Transient non-community water system",
        NTCWS: "Non-transient non-community water system",
        TNCWS: "Transient non-community water system",
        CWS: "Community water system"
    };

    return (
        typeLabels[normalized] ||
        normalizeText(code) ||
        "Not listed"
    );
}


function translateSource(code) {
    const normalized =
        normalizeText(code).toUpperCase();

    const sourceLabels = {
        GW: "Ground water",
        SW: "Surface water",
        GWP: "Purchased ground water",
        SWP: "Purchased surface water",
        GU: "Ground water under direct influence of surface water",
        GU_SW: "Ground water under direct influence of surface water"
    };

    return (
        sourceLabels[normalized] ||
        normalizeText(code) ||
        "Not listed"
    );
}


function isLikelyActive(record) {
    const activityCode =
        getActivityCode(record).toUpperCase();

    if (!activityCode) {
        return true;
    }

    const inactiveCodes = new Set([
        "I",
        "INACTIVE",
        "CLOSED",
        "DEACTIVATED"
    ]);

    return !inactiveCodes.has(activityCode);
}


/*
|--------------------------------------------------------------------------
| SYSTEM DETAIL REQUEST
|--------------------------------------------------------------------------
*/

async function fetchSystemDetails(
    pwsId,
    geographicRecord
) {
    const fallbackSystem = {
        pwsId,
        name: pwsId,
        systemType: translateSystemType(
            getSystemType(geographicRecord)
        ),
        source: "View EPA details",
        population: "",
        reportUrl: "",
        cityServed: normalizeText(
            getRecordValue(geographicRecord, [
                "CITY_SERVED"
            ])
        ),
        countyServed: normalizeText(
            getRecordValue(geographicRecord, [
                "COUNTY_SERVED"
            ])
        )
    };

    try {
        const detailsUrl =
            createWaterSystemDetailsUrl(pwsId);

        const details =
            await fetchJsonWithTimeout(detailsUrl);

        if (
            !Array.isArray(details) ||
            details.length === 0
        ) {
            return fallbackSystem;
        }

        const record =
            details[0];

        return {
            pwsId,
            name:
                getSystemName(record) ||
                fallbackSystem.name,

            systemType:
                translateSystemType(
                    getSystemType(record) ||
                    getSystemType(geographicRecord)
                ),

            source:
                translateSource(
                    getPrimarySource(record)
                ),

            population:
                getPopulation(record),

            reportUrl: "",

            cityServed:
                fallbackSystem.cityServed,

            countyServed:
                fallbackSystem.countyServed
        };
    } catch (error) {
        console.warn(
            `Could not retrieve full EPA details for ${pwsId}:`,
            error
        );

        return fallbackSystem;
    }
}


/*
|--------------------------------------------------------------------------
| WATER-SYSTEM FINDER
|--------------------------------------------------------------------------
*/

async function findWaterSystems() {
    if (
        !stateSelect ||
        !zipInput ||
        !systemStatus ||
        !systemResults ||
        !systemSelect ||
        !selectedSystemCard
    ) {
        return;
    }

    clearStatus(systemStatus);

    systemResults.classList.remove("show");
    selectedSystemCard.hidden = true;

    systemSelect.innerHTML = `
        <option value="">
            Select a water system
        </option>
    `;

    currentWaterSystems = [];

    const selectedState =
        stateSelect.value.trim().toUpperCase();

    const enteredZip =
        zipInput.value.trim();

    if (!selectedState) {
        showStatus(
            systemStatus,
            "Please select a state.",
            "error"
        );

        stateSelect.focus();
        return;
    }

    if (!/^\d{5}$/.test(enteredZip)) {
        showStatus(
            systemStatus,
            "Please enter a valid five-digit ZIP code.",
            "error"
        );

        zipInput.focus();
        return;
    }

    findSystemsButton.disabled = true;
    findSystemsButton.textContent = "Searching EPA...";

    showStatus(
        systemStatus,
        "Searching EPA public water-system records...",
        "info"
    );

    try {
        const geographicUrl =
            createGeographicAreaUrl(enteredZip);

        const geographicRecords =
            await fetchJsonWithTimeout(geographicUrl);

        if (!Array.isArray(geographicRecords)) {
            throw new Error(
                "EPA returned an unexpected response format."
            );
        }

        /*
         * Match the selected state and remove records without PWS IDs.
         */
        let stateMatches =
            geographicRecords.filter((record) => {
                const recordState =
                    getStateServed(record);

                const pwsId =
                    getPwsId(record);

                return (
                    pwsId &&
                    (
                        !recordState ||
                        recordState === selectedState
                    )
                );
            });

        /*
         * Prefer active systems. If activity codes are missing or all
         * matching records appear inactive, keep all state matches so the
         * user is not shown a false "no results" message.
         */
        const activeMatches =
            stateMatches.filter(isLikelyActive);

        if (activeMatches.length > 0) {
            stateMatches = activeMatches;
        }

        /*
         * Keep one geographic record for each PWS ID.
         */
        const uniquePwsRecords =
            new Map();

        stateMatches.forEach((record) => {
            const pwsId =
                getPwsId(record);

            if (
                pwsId &&
                !uniquePwsRecords.has(pwsId)
            ) {
                uniquePwsRecords.set(
                    pwsId,
                    record
                );
            }
        });

        if (uniquePwsRecords.size === 0) {
            showNoWaterSystemsMessage(
                selectedState,
                enteredZip
            );

            return;
        }

        showStatus(
            systemStatus,
            "Possible systems were found. Loading system names and details...",
            "info"
        );

        const detailRequests =
            Array.from(
                uniquePwsRecords.entries()
            ).map(([pwsId, geographicRecord]) => {
                return fetchSystemDetails(
                    pwsId,
                    geographicRecord
                );
            });

        currentWaterSystems =
            await Promise.all(detailRequests);

        currentWaterSystems =
            currentWaterSystems
                .filter((system) => system.pwsId)
                .sort((first, second) => {
                    const firstName =
                        first.name || first.pwsId;

                    const secondName =
                        second.name || second.pwsId;

                    return firstName.localeCompare(
                        secondName
                    );
                });

        if (currentWaterSystems.length === 0) {
            showNoWaterSystemsMessage(
                selectedState,
                enteredZip
            );

            return;
        }

        populateWaterSystemSelect();

        const systemWord =
            currentWaterSystems.length === 1
                ? "system"
                : "systems";

        showStatus(
            systemStatus,
            `${currentWaterSystems.length} possible water ${systemWord} found. Select the provider that matches your water bill.`,
            "info"
        );

        systemResults.classList.add("show");

        /*
         * Automatically display a result when only one possible system
         * is returned.
         */
        if (currentWaterSystems.length === 1) {
            systemSelect.value = "0";
            displaySelectedWaterSystem();
        }
    } catch (error) {
        console.error(
            "EPA water-system lookup failed:",
            error
        );

        showEpaUnavailableMessage(
            selectedState,
            enteredZip
        );
    } finally {
        findSystemsButton.disabled = false;
        findSystemsButton.textContent =
            "Find Water Systems";
    }
}


function populateWaterSystemSelect() {
    currentWaterSystems.forEach(
        (waterSystem, index) => {
            const option =
                document.createElement("option");

            option.value =
                String(index);

            const displayName =
                waterSystem.name ||
                waterSystem.pwsId;

            option.textContent =
                `${displayName} — ${waterSystem.pwsId}`;

            systemSelect.appendChild(option);
        }
    );
}


function showNoWaterSystemsMessage(
    state,
    zip
) {
    const safeState =
        escapeHtml(state);

    const safeZip =
        escapeHtml(zip);

    const fallbackUrl =
        escapeHtml(createEpaFallbackSearchUrl());

    showStatusHtml(
        systemStatus,
        `
            No public water systems were returned for
            <strong>${safeZip}, ${safeState}</strong>.
            EPA service-area records may be incomplete, the selected
            system may use a nearby ZIP code, or the property may use
            a private well.
            <br><br>
            <a
                href="${fallbackUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Search EPA drinking-water records
            </a>
        `,
        "warning"
    );
}


function showEpaUnavailableMessage(
    state,
    zip
) {
    const safeState =
        escapeHtml(state);

    const safeZip =
        escapeHtml(zip);

    const fallbackUrl =
        escapeHtml(createEpaFallbackSearchUrl());

    showStatusHtml(
        systemStatus,
        `
            The live EPA lookup could not be completed for
            <strong>${safeZip}, ${safeState}</strong>.
            EPA may be temporarily unavailable or may be blocking
            requests from this webpage.
            <br><br>
            <a
                href="${fallbackUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Open EPA Water System Search
            </a>
        `,
        "warning"
    );
}


/*
|--------------------------------------------------------------------------
| SELECTED SYSTEM
|--------------------------------------------------------------------------
*/

function displaySelectedWaterSystem() {
    if (
        !systemSelect ||
        !selectedSystemCard
    ) {
        return;
    }

    const selectedIndex =
        systemSelect.value;

    if (selectedIndex === "") {
        selectedSystemCard.hidden = true;
        return;
    }

    const waterSystem =
        currentWaterSystems[
            Number(selectedIndex)
        ];

    if (!waterSystem) {
        selectedSystemCard.hidden = true;
        return;
    }

    selectedSystemName.textContent =
        waterSystem.name ||
        waterSystem.pwsId ||
        "Public water system";

    selectedSystemId.textContent =
        waterSystem.pwsId ||
        "Not listed";

    selectedSystemType.textContent =
        waterSystem.systemType ||
        "Not listed";

    selectedSystemSource.textContent =
        waterSystem.source ||
        "Not listed";

    selectedSystemPopulation.textContent =
        formatPopulation(
            waterSystem.population
        );

    if (waterSystem.reportUrl) {
        annualReportButton.href =
            waterSystem.reportUrl;

        annualReportButton.hidden = false;
        annualReportUnavailable.hidden = true;
    } else {
        annualReportButton.removeAttribute("href");
        annualReportButton.hidden = true;
        annualReportUnavailable.hidden = false;
    }

    epaSystemButton.href =
        createEpaSystemDetailsUrl(
            waterSystem.pwsId
        );

    selectedSystemCard.hidden = false;
}


/*
|--------------------------------------------------------------------------
| CLEAR WATER-SYSTEM FINDER
|--------------------------------------------------------------------------
*/

function clearWaterSystemFinder() {
    if (
        !stateSelect ||
        !zipInput ||
        !systemSelect ||
        !systemResults ||
        !selectedSystemCard
    ) {
        return;
    }

    stateSelect.value = "";
    zipInput.value = "";

    systemSelect.innerHTML = `
        <option value="">
            Select a water system
        </option>
    `;

    currentWaterSystems = [];

    systemResults.classList.remove("show");
    selectedSystemCard.hidden = true;

    clearStatus(systemStatus);
}


/*
|--------------------------------------------------------------------------
| REPORT EXPLAINER DEFINITIONS
|--------------------------------------------------------------------------
*/

const REPORT_TERMS = [
    {
        title: "Maximum Contaminant Level (MCL)",

        pattern:
            /\bMCL\b|maximum contaminant level/i,

        explanation:
            "The enforceable limit for a contaminant in public drinking water."
    },

    {
        title: "Maximum Contaminant Level Goal (MCLG)",

        pattern:
            /\bMCLG\b|maximum contaminant level goal/i,

        explanation:
            "A non-enforceable public-health goal. It may be lower than the legal limit."
    },

    {
        title: "Action Level",

        pattern:
            /action level/i,

        explanation:
            "A concentration that triggers required treatment, monitoring, public education, or another regulatory action. This term is commonly used for lead and copper."
    },

    {
        title: "Treatment Technique",

        pattern:
            /treatment technique|\bTT\b/i,

        explanation:
            "A required treatment process or operating practice used instead of, or together with, a numerical contaminant limit."
    },

    {
        title: "Violation",

        pattern:
            /violation|violated|noncompliance|non-compliance/i,

        explanation:
            "The text mentions a possible regulatory or monitoring violation. Review the surrounding section for the contaminant, dates, corrective action, and whether the violation has been resolved."
    },

    {
        title: "Non-detect",

        pattern:
            /\bND\b|non[- ]?detect|below detection|not detected/i,

        explanation:
            "The laboratory did not detect the contaminant above its reporting or detection limit. This does not always mean the concentration was absolutely zero."
    },

    {
        title: "Health Advisory",

        pattern:
            /health advisory/i,

        explanation:
            "A health advisory provides public-health guidance. It is not always an enforceable drinking-water standard."
    },

    {
        title: "Running Annual Average",

        pattern:
            /running annual average|\bRAA\b|\bLRAA\b/i,

        explanation:
            "An average calculated across multiple monitoring periods, often used to determine regulatory compliance."
    },

    {
        title: "90th Percentile",

        pattern:
            /90th percentile|90 percentile/i,

        explanation:
            "For lead and copper, the 90th percentile is used to compare household tap results with the applicable action level."
    },

    {
        title: "Turbidity",

        pattern:
            /turbidity/i,

        explanation:
            "A measure of water cloudiness. Turbidity can indicate particles in water and can affect treatment and disinfection performance."
    },

    {
        title: "Disinfection Byproducts",

        pattern:
            /disinfection byproducts?|trihalomethanes?|\bTTHM\b|haloacetic acids?|\bHAA5\b/i,

        explanation:
            "Compounds that can form when disinfectants react with natural material in water."
    }
];


/*
|--------------------------------------------------------------------------
| REPORT EXPLAINER HELPERS
|--------------------------------------------------------------------------
*/

function createExplanationCard(
    title,
    explanation
) {
    const card =
        document.createElement("article");

    card.className =
        "explanation-card";

    const heading =
        document.createElement("h3");

    heading.textContent =
        title;

    const paragraph =
        document.createElement("p");

    paragraph.textContent =
        explanation;

    card.appendChild(heading);
    card.appendChild(paragraph);

    return card;
}


function normalizeUnit(unit) {
    return unit
        .replaceAll("μ", "µ")
        .replace(/\s+/g, "")
        .toLowerCase();
}


function getUnitExplanation(unit) {
    const normalized =
        normalizeUnit(unit);

    const unitExplanations = {
        "mg/l":
            "milligrams per liter; approximately equal to parts per million in water",

        "µg/l":
            "micrograms per liter; approximately equal to parts per billion in water",

        "ug/l":
            "micrograms per liter; approximately equal to parts per billion in water",

        "ng/l":
            "nanograms per liter; approximately equal to parts per trillion in water",

        "ppm":
            "parts per million",

        "ppb":
            "parts per billion",

        "ppt":
            "parts per trillion",

        "ntu":
            "nephelometric turbidity units, used to measure cloudiness",

        "pci/l":
            "picocuries per liter, a unit of radioactivity"
    };

    return (
        unitExplanations[normalized] ||
        "a measurement unit used in the report"
    );
}


/*
|--------------------------------------------------------------------------
| REPORT EXPLAINER
|--------------------------------------------------------------------------
*/

function explainWaterReport() {
    if (
        !reportText ||
        !explanationStatus ||
        !explanationResults
    ) {
        return;
    }

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

    let findingCount = 0;

    REPORT_TERMS.forEach((term) => {
        if (term.pattern.test(text)) {
            explanationResults.appendChild(
                createExplanationCard(
                    term.title,
                    term.explanation
                )
            );

            findingCount += 1;
        }
    });

    /*
     * Find common water-quality units.
     */
    const unitMatches =
        text.match(
            /\b(?:mg\s*\/\s*l|[µμu]g\s*\/\s*l|ng\s*\/\s*l|ppm|ppb|ppt|ntu|pci\s*\/\s*l)\b/gi
        ) || [];

    const uniqueUnits =
        Array.from(
            new Set(
                unitMatches.map((unit) =>
                    normalizeUnit(unit)
                )
            )
        );

    if (uniqueUnits.length > 0) {
        const unitDescription =
            uniqueUnits
                .map((unit) => {
                    return (
                        `${unit.toUpperCase()}: ` +
                        getUnitExplanation(unit)
                    );
                })
                .join("; ");

        explanationResults.appendChild(
            createExplanationCard(
                "Units found",
                `${unitDescription}. Compare a result with a standard only when both use compatible units.`
            )
        );

        findingCount += 1;
    }

    /*
     * Find numerical measurements followed by common units.
     */
    const measurementMatches =
        text.match(
            /\b(?:<|≤|>|≥)?\s*\d+(?:\.\d+)?\s*(?:mg\s*\/\s*l|[µμu]g\s*\/\s*l|ng\s*\/\s*l|ppm|ppb|ppt|ntu|pci\s*\/\s*l)\b/gi
        ) || [];

    if (measurementMatches.length > 0) {
        const uniqueMeasurements =
            Array.from(
                new Set(
                    measurementMatches.map(
                        (measurement) =>
                            measurement
                                .replace(/\s+/g, " ")
                                .trim()
                    )
                )
            );

        const displayedMeasurements =
            uniqueMeasurements.slice(0, 15);

        let explanation =
            displayedMeasurements.join(", ");

        if (uniqueMeasurements.length > 15) {
            explanation +=
                `. ${uniqueMeasurements.length - 15} additional measurements were found.`;
        }

        explanationResults.appendChild(
            createExplanationCard(
                "Measurements found",
                explanation
            )
        );

        findingCount += 1;
    }

    /*
     * Detect language that suggests results met standards.
     */
    if (
        /met all|meets all|in compliance|no violations|did not exceed|below (?:the )?(?:mcl|action level|limit)/i.test(text)
    ) {
        explanationResults.appendChild(
            createExplanationCard(
                "Compliance language",
                "The pasted text appears to say that one or more results met an applicable standard. Confirm which contaminant, monitoring period, and standard the statement covers."
            )
        );

        findingCount += 1;
    }

    /*
     * Detect language that suggests an exceedance.
     */
    if (
        /exceed(?:ed|ance|s)?|above (?:the )?(?:mcl|action level|limit)|greater than (?:the )?(?:mcl|action level|limit)/i.test(text)
    ) {
        explanationResults.appendChild(
            createExplanationCard(
                "Possible exceedance",
                "The pasted text appears to mention a result above a limit or action level. Review the original report for the contaminant, affected dates, required actions, and health information."
            )
        );

        findingCount += 1;
    }

    if (findingCount === 0) {
        showStatus(
            explanationStatus,
            "No common drinking-water terms or measurements were recognized. Try pasting a larger section of the report.",
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


function loadReportExample() {
    if (!reportText) {
        return;
    }

    reportText.value =
        "Lead: 5 ppb. Action Level: 15 ppb. " +
        "MCLG: 0 ppb. Arsenic: ND. " +
        "The system had no MCL violations during the reporting year.";

    explainWaterReport();
}


function clearReportExplanation() {
    if (
        !reportText ||
        !explanationResults
    ) {
        return;
    }

    reportText.value = "";
    explanationResults.innerHTML = "";

    clearStatus(explanationStatus);
}


/*
|--------------------------------------------------------------------------
| EVENTS
|--------------------------------------------------------------------------
*/

if (findSystemsButton) {
    findSystemsButton.addEventListener(
        "click",
        findWaterSystems
    );
}

if (clearSystemsButton) {
    clearSystemsButton.addEventListener(
        "click",
        clearWaterSystemFinder
    );
}

if (systemSelect) {
    systemSelect.addEventListener(
        "change",
        displaySelectedWaterSystem
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

if (explainReportButton) {
    explainReportButton.addEventListener(
        "click",
        explainWaterReport
    );
}

if (loadExampleButton) {
    loadExampleButton.addEventListener(
        "click",
        loadReportExample
    );
}

if (clearReportTextButton) {
    clearReportTextButton.addEventListener(
        "click",
        clearReportExplanation
    );
}
'''

path = Path("/mnt/data/report-center.js")
path.write_text(js, encoding="utf-8")
print(f"Created {path} ({path.stat().st_size:,} bytes)")
