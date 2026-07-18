"use strict";

/*
|--------------------------------------------------------------------------
| WATER-SYSTEM LOOKUP DATA
|--------------------------------------------------------------------------
|
| Since you requested only two files, ZIP-to-system records are stored
| here. Add real systems to WATER_SYSTEM_DATA using this structure:
|
| "STATE": {
|     "ZIP": [
|         {
|             pwsId: "OR4100657",
|             name: "PORTLAND WATER BUREAU",
|             systemType: "Community water system",
|             source: "Surface water",
|             population: 1000000,
|             reportUrl: "https://example.gov/report.pdf"
|         }
|     ]
| }
|
| reportUrl is optional.
|
| IMPORTANT:
| The records below are examples showing how the page functions.
| Replace or expand them with verified EPA/state records before
| presenting this as a complete national lookup.
|
*/

const WATER_SYSTEM_DATA = {
    OR: {
        "97201": [
            {
                pwsId: "OR4100657",
                name: "PORTLAND WATER BUREAU",
                systemType: "Community water system",
                source: "Surface water",
                population: 1000000,
                reportUrl: ""
            }
        ],

        "97204": [
            {
                pwsId: "OR4100657",
                name: "PORTLAND WATER BUREAU",
                systemType: "Community water system",
                source: "Surface water",
                population: 1000000,
                reportUrl: ""
            }
        ]
    }
};


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
    document.getElementById(
        "selectedSystemPopulation"
    );

const annualReportButton =
    document.getElementById("annualReportButton");

const epaSystemButton =
    document.getElementById("epaSystemButton");

const annualReportUnavailable =
    document.getElementById(
        "annualReportUnavailable"
    );

const reportText =
    document.getElementById("waterReportText");

const explainReportButton =
    document.getElementById("explainReportButton");

const loadExampleButton =
    document.getElementById(
        "loadReportExampleButton"
    );

const clearReportTextButton =
    document.getElementById(
        "clearReportTextButton"
    );

const explanationStatus =
    document.getElementById(
        "reportExplanationStatus"
    );

const explanationResults =
    document.getElementById(
        "reportExplanationResults"
    );

let currentWaterSystems = [];


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
            button.setAttribute(
                "aria-selected",
                "false"
            );
        });

        reportPanels.forEach((panel) => {
            panel.classList.remove("active");
        });

        tabButton.classList.add("active");
        tabButton.setAttribute(
            "aria-selected",
            "true"
        );

        const targetPanel =
            document.getElementById(targetPanelId);

        if (targetPanel) {
            targetPanel.classList.add("active");
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
    statusType = "info"
) {
    element.textContent = message;

    element.className =
        `report-status show ${statusType}`;
}

function clearStatus(element) {
    element.textContent = "";
    element.className = "report-status";
}


/*
|--------------------------------------------------------------------------
| EPA LINK
|--------------------------------------------------------------------------
|
| This opens the EPA ECHO drinking-water search page.
| The user already sees the exact PWS ID on your page and can use
| that system ID in EPA if EPA changes its direct-link parameters.
|
*/

function createEpaSystemUrl(pwsId) {
    const baseUrl =
        "https://echo.epa.gov/facilities/facility-search";

    /*
     * EPA may update its search URL parameters.
     * Keep the PWS ID in the URL as a query parameter for easy use.
     */
    return (
        `${baseUrl}?mediaSelected=dw` +
        `&pwsid=${encodeURIComponent(pwsId)}`
    );
}


/*
|--------------------------------------------------------------------------
| WATER-SYSTEM FINDER
|--------------------------------------------------------------------------
*/

function findWaterSystems() {
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
        stateSelect.value.trim();

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

    const stateData =
        WATER_SYSTEM_DATA[selectedState];

    if (!stateData) {
        showStatus(
            systemStatus,
            "Water-system records have not yet been added for this state.",
            "warning"
        );

        return;
    }

    const matchingSystems =
        stateData[enteredZip];

    if (
        !Array.isArray(matchingSystems) ||
        matchingSystems.length === 0
    ) {
        showStatus(
            systemStatus,
            "No water systems are currently listed for this ZIP code. The service-area data may be incomplete, or this property may use a private well.",
            "warning"
        );

        return;
    }

    currentWaterSystems = [...matchingSystems];

    currentWaterSystems.sort((first, second) => {
        return first.name.localeCompare(
            second.name
        );
    });

    currentWaterSystems.forEach(
        (waterSystem, index) => {
            const option =
                document.createElement("option");

            option.value = String(index);

            option.textContent =
                `${waterSystem.name} — ` +
                `${waterSystem.pwsId}`;

            systemSelect.appendChild(option);
        }
    );

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
     * When only one system is found, automatically
     * select and display it.
     */
    if (currentWaterSystems.length === 1) {
        systemSelect.value = "0";
        displaySelectedWaterSystem();
    }
}


function displaySelectedWaterSystem() {
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

    const population =
        Number(waterSystem.population);

    selectedSystemPopulation.textContent =
        Number.isFinite(population)
            ? population.toLocaleString()
            : "Not listed";

    /*
     * Annual report button
     */
    if (waterSystem.reportUrl) {
        annualReportButton.href =
            waterSystem.reportUrl;

        annualReportButton.hidden = false;
        annualReportUnavailable.hidden = true;
    } else {
        annualReportButton.hidden = true;
        annualReportUnavailable.hidden = false;
    }

    /*
     * EPA details button
     */
    epaSystemButton.href =
        createEpaSystemUrl(
            waterSystem.pwsId
        );

    selectedSystemCard.hidden = false;
}


function clearWaterSystemFinder() {
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


findSystemsButton.addEventListener(
    "click",
    findWaterSystems
);

clearSystemsButton.addEventListener(
    "click",
    clearWaterSystemFinder
);

systemSelect.addEventListener(
    "change",
    displaySelectedWaterSystem
);

zipInput.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            findWaterSystems();
        }
    }
);


/*
|--------------------------------------------------------------------------
| REPORT EXPLAINER DEFINITIONS
|--------------------------------------------------------------------------
*/

const REPORT_TERMS = [
    {
        title: "MCL",
        pattern:
            /\bMCL\b|maximum contaminant level/i,

        explanation:
            "The Maximum Contaminant Level is the enforceable limit for a contaminant in public drinking water."
    },

    {
        title: "MCLG",
        pattern:
            /\bMCLG\b|maximum contaminant level goal/i,

        explanation:
            "The Maximum Contaminant Level Goal is a non-enforceable public-health goal. It may be lower than the legal limit."
    },

    {
        title: "Action Level",
        pattern:
            /action level/i,

        explanation:
            "A concentration that triggers treatment, monitoring or other required action. This term is commonly used for lead and copper."
    },

    {
        title: "Treatment Technique",
        pattern:
            /treatment technique|\bTT\b/i,

        explanation:
            "A required treatment process or performance standard used instead of, or together with, a numerical contaminant limit."
    },

    {
        title: "Violation",
        pattern:
            /violation|violated|noncompliance/i,

        explanation:
            "The text appears to mention a regulatory or monitoring violation. Review the surrounding section for the contaminant, dates and corrective action."
    },

    {
        title: "Non-detect",
        pattern:
            /\bND\b|non[- ]?detect|below detection/i,

        explanation:
            "The laboratory did not detect the contaminant above its reporting or detection limit. This does not always mean that the amount was absolutely zero."
    },

    {
        title: "Health Advisory",
        pattern:
            /health advisory/i,

        explanation:
            "A health advisory provides public-health guidance. It is not always the same as an enforceable drinking-water standard."
    },

    {
        title: "Range",
        pattern:
            /\brange\b/i,

        explanation:
            "The range usually shows the lowest and highest results observed during the reporting period."
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
        document.createElement("article");

    card.className = "explanation-card";

    const heading =
        document.createElement("h3");

    heading.textContent = title;

    const paragraph =
        document.createElement("p");

    paragraph.textContent = explanation;

    card.appendChild(heading);
    card.appendChild(paragraph);

    return card;
}


function explainWaterReport() {
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
     * Detect common drinking-water units.
     */
    const unitMatches =
        text.match(
            /\b(?:mg\/L|µg\/L|ug\/L|ng\/L|ppm|ppb|ppt)\b/gi
        ) || [];

    const uniqueUnits = [
        ...new Set(
            unitMatches.map((unit) =>
                unit.toUpperCase()
            )
        )
    ];

    if (uniqueUnits.length > 0) {
        explanationResults.appendChild(
            createExplanationCard(
                "Units found",
                `${uniqueUnits.join(", ")}. Compare a result and its standard only when both values use the same unit.`
            )
        );

        findingCount += 1;
    }

    /*
     * Detect values followed by drinking-water units.
     */
    const measurementMatches =
        text.match(
            /\b\d+(?:\.\d+)?\s*(?:mg\/L|µg\/L|ug\/L|ng\/L|ppm|ppb|ppt)\b/gi
        ) || [];

    if (measurementMatches.length > 0) {
        const displayedMeasurements =
            measurementMatches.slice(0, 12);

        explanationResults.appendChild(
            createExplanationCard(
                "Measurements found",
                displayedMeasurements.join(", ")
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
        "The report text was reviewed. Check the original report for sampling dates, locations, units and regulatory comparisons.",
        "info"
    );
}


function loadReportExample() {
    reportText.value =
        "Lead: 5 ppb. Action Level: 15 ppb. " +
        "MCLG: 0 ppb. Arsenic: ND. " +
        "The system had no MCL violations " +
        "during the reporting year.";

    explainWaterReport();
}


function clearReportExplanation() {
    reportText.value = "";
    explanationResults.innerHTML = "";

    clearStatus(explanationStatus);
}


explainReportButton.addEventListener(
    "click",
    explainWaterReport
);

loadExampleButton.addEventListener(
    "click",
    loadReportExample
);

clearReportTextButton.addEventListener(
    "click",
    clearReportExplanation
);
