"use strict";

/*
|--------------------------------------------------------------------------
| Water Quality Calculator Data
|--------------------------------------------------------------------------
|
| benchmark:
| The comparison value used by this educational calculator.
|
| benchmarkType:
| Explains whether the value is an MCL, action level, or another type
| of comparison value.
|
| baseUnit:
| The unit used internally to compare the entered value.
|
| supportedUnits:
| Units users may see on laboratory or utility reports.
|
*/

const contaminantData = {
    arsenic: {
        name: "Arsenic",
        benchmark: 10,
        benchmarkDisplay: "10 ppb",
        benchmarkType: "Maximum Contaminant Level",
        baseUnit: "ppb",
        supportedUnits: ["ppb", "µg/L", "mg/L"],

        explanationBelow:
            "This result is below the federal public-water Maximum Contaminant Level used by this calculator. A single result does not evaluate every contaminant or guarantee that the water is safe.",

        explanationNear:
            "This result is close to the federal public-water Maximum Contaminant Level. Consider the testing method, laboratory reporting limit, and whether repeated samples show a similar result.",

        explanationAbove:
            "This result is above the federal public-water Maximum Contaminant Level used for comparison. Confirm the result and contact the appropriate water or health authority for guidance.",

        publicStepsBelow: [
            "Review the full water-quality report for other contaminants.",
            "Check whether the result represents your tap, the distribution system, or a water source.",
            "Follow any instructions provided by your water utility."
        ],

        publicStepsAbove: [
            "Contact your water utility and ask whether this result represents your household tap or the overall system.",
            "Follow official instructions about drinking and cooking water.",
            "Do not rely on boiling to remove arsenic.",
            "Use only treatment equipment certified for arsenic reduction when treatment is recommended."
        ],

        privateStepsBelow: [
            "Keep the laboratory report with your well records.",
            "Continue testing your well according to state or local recommendations.",
            "Test again if the well is repaired, flooded, or shows a major change in water quality."
        ],

        privateStepsAbove: [
            "Contact your local or state health department for private-well guidance.",
            "Consider confirming the result with a certified drinking-water laboratory.",
            "Use an appropriate alternative water source until you understand the result and available treatment options.",
            "Do not boil the water to remove arsenic."
        ],

        source:
            "https://www.epa.gov/dwreginfo/chemical-contaminant-rules"
    },

    lead: {
        name: "Lead",
        benchmark: 15,
        benchmarkDisplay: "15 ppb",
        benchmarkType: "Lead action-level comparison",
        baseUnit: "ppb",
        supportedUnits: ["ppb", "µg/L", "mg/L"],

        explanationBelow:
            "This result is below the 15 ppb action-level comparison used by this calculator. This does not mean that lead exposure is risk-free, especially for infants, children, and pregnant people.",

        explanationNear:
            "This result is close to the 15 ppb action-level comparison. Lead can vary between taps and with the amount of time water remains in household plumbing.",

        explanationAbove:
            "This result is above the 15 ppb action-level comparison used by this calculator. Take steps to reduce exposure and contact your water provider or health authority.",

        publicStepsBelow: [
            "Use cold tap water for drinking, cooking, and infant formula.",
            "Flush water that has remained unused in plumbing for several hours.",
            "Check whether your home has a lead service line or older plumbing.",
            "Follow any sampling or flushing instructions from your water provider."
        ],

        publicStepsAbove: [
            "Use cold water for drinking and cooking.",
            "Do not boil water to remove lead.",
            "Use a filter certified specifically for lead reduction when appropriate.",
            "Contact your water provider about lead service-line and plumbing information.",
            "Discuss possible exposure with a healthcare professional when children or pregnant people may be affected."
        ],

        privateStepsBelow: [
            "Remember that lead commonly comes from household plumbing rather than the well source.",
            "Use cold water for drinking and cooking.",
            "Retest after plumbing repairs or fixture replacement when needed."
        ],

        privateStepsAbove: [
            "Do not boil water to remove lead.",
            "Consider testing multiple taps or conducting follow-up sampling through a certified laboratory.",
            "Inspect plumbing, fixtures, solder, and other possible lead sources.",
            "Use treatment certified specifically for lead reduction when appropriate."
        ],

        source:
            "https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water"
    },

    copper: {
        name: "Copper",
        benchmark: 1.3,
        benchmarkDisplay: "1.3 mg/L",
        benchmarkType: "Copper action-level comparison",
        baseUnit: "mg/L",
        supportedUnits: ["mg/L", "ppm", "µg/L", "ppb"],

        explanationBelow:
            "This result is below the copper action-level comparison used by this calculator. Copper at individual taps can vary because of plumbing materials, water chemistry, and stagnation time.",

        explanationNear:
            "This result is close to the copper action-level comparison. Consider whether the sample was collected after water remained unused in the plumbing.",

        explanationAbove:
            "This result is above the copper action-level comparison used by this calculator. Contact your water provider or local health authority and investigate possible plumbing corrosion.",

        publicStepsBelow: [
            "Use cold water for drinking and cooking.",
            "Follow your utility's flushing and sampling instructions.",
            "Watch for blue-green staining that may indicate plumbing corrosion."
        ],

        publicStepsAbove: [
            "Contact your water utility and ask about corrosion-control guidance.",
            "Flush water that has remained unused in the plumbing.",
            "Use cold water for drinking and cooking.",
            "Consider testing additional taps to identify whether the source is household plumbing."
        ],

        privateStepsBelow: [
            "Continue routine well and household-plumbing maintenance.",
            "Consider testing pH and corrosivity if blue-green stains are present."
        ],

        privateStepsAbove: [
            "Investigate corrosion of household copper plumbing.",
            "Consider testing water pH and other corrosion-related characteristics.",
            "Consult a qualified water-treatment professional before selecting treatment."
        ],

        source:
            "https://www.epa.gov/dwreginfo/lead-and-copper-rule"
    },

    nitrate: {
        name: "Nitrate",
        benchmark: 10,
        benchmarkDisplay: "10 mg/L as nitrogen",
        benchmarkType: "Maximum Contaminant Level",
        baseUnit: "mg/L",
        supportedUnits: ["mg/L", "ppm"],

        explanationBelow:
            "This result is below the federal Maximum Contaminant Level used by this calculator. Conditions can change, particularly in private wells affected by agriculture, flooding, or septic systems.",

        explanationNear:
            "This result is close to the federal Maximum Contaminant Level. Follow-up testing may be appropriate, particularly when water is used to prepare infant formula.",

        explanationAbove:
            "This result is above the federal Maximum Contaminant Level used for comparison. Infants are especially vulnerable, so obtain official guidance promptly.",

        publicStepsBelow: [
            "Review your utility report for sampling dates and additional information.",
            "Follow any instructions from your water utility."
        ],

        publicStepsAbove: [
            "Contact your water utility immediately for instructions.",
            "Do not use the water to prepare infant formula unless officials confirm it is appropriate.",
            "Do not boil water to remove nitrate because boiling may concentrate it.",
            "Use an alternative water source when advised."
        ],

        privateStepsBelow: [
            "Test the well regularly according to local recommendations.",
            "Retest after flooding, repairs, or changes near septic or agricultural areas."
        ],

        privateStepsAbove: [
            "Do not use the water to prepare infant formula.",
            "Do not boil the water to remove nitrate.",
            "Contact your local health department.",
            "Confirm the result through a certified drinking-water laboratory.",
            "Use a suitable alternative water source until the issue is addressed."
        ],

        source:
            "https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations"
    },

    nitrite: {
        name: "Nitrite",
        benchmark: 1,
        benchmarkDisplay: "1 mg/L as nitrogen",
        benchmarkType: "Maximum Contaminant Level",
        baseUnit: "mg/L",
        supportedUnits: ["mg/L", "ppm"],

        explanationBelow:
            "This result is below the federal Maximum Contaminant Level used by this calculator.",

        explanationNear:
            "This result is close to the federal Maximum Contaminant Level. Consider prompt follow-up testing, particularly when infants may consume the water.",

        explanationAbove:
            "This result is above the federal Maximum Contaminant Level used for comparison. Infants are especially vulnerable and official guidance should be obtained promptly.",

        publicStepsBelow: [
            "Review the complete utility report.",
            "Follow any instructions issued by your water provider."
        ],

        publicStepsAbove: [
            "Contact your water utility immediately.",
            "Do not use the water to prepare infant formula unless officials confirm it is appropriate.",
            "Do not boil water to remove nitrite.",
            "Use an alternative source when advised."
        ],

        privateStepsBelow: [
            "Continue testing according to private-well recommendations.",
            "Retest after flooding or changes near septic and agricultural areas."
        ],

        privateStepsAbove: [
            "Do not use the water to prepare infant formula.",
            "Contact your local health department promptly.",
            "Confirm the result through a certified laboratory.",
            "Use an alternative water source until the result is evaluated."
        ],

        source:
            "https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations"
    },

    fluoride: {
        name: "Fluoride",
        benchmark: 4,
        benchmarkDisplay: "4 mg/L",
        benchmarkType: "Maximum Contaminant Level",
        baseUnit: "mg/L",
        supportedUnits: ["mg/L", "ppm"],

        explanationBelow:
            "This result is below the federal Maximum Contaminant Level used by this calculator.",

        explanationNear:
            "This result is close to the federal Maximum Contaminant Level. Review the complete report and consult your water provider when appropriate.",

        explanationAbove:
            "This result is above the federal Maximum Contaminant Level used for comparison. Contact your water provider or local health authority for guidance.",

        publicStepsBelow: [
            "Review your utility's complete water-quality report.",
            "Ask your utility whether fluoride is naturally occurring or added."
        ],

        publicStepsAbove: [
            "Contact your water utility for current guidance.",
            "Consider the needs of children who may be more susceptible to dental effects.",
            "Follow health-department advice regarding alternative water or treatment."
        ],

        privateStepsBelow: [
            "Continue routine well testing.",
            "Keep records so results can be compared over time."
        ],

        privateStepsAbove: [
            "Confirm the result through a certified laboratory.",
            "Contact your local health department.",
            "Consult a qualified treatment professional regarding appropriate treatment."
        ],

        source:
            "https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations"
    },

    ecoli: {
        name: "E. coli",
        benchmark: 0,
        benchmarkDisplay: "Not detected",
        benchmarkType: "Microbial detection comparison",
        baseUnit: "presence",
        supportedUnits: ["Not detected", "Detected"],

        explanationBelow:
            "The result indicates that E. coli was not detected in this sample. One sample does not guarantee that contamination cannot occur later.",

        explanationNear:
            "The result indicates that E. coli was detected. This can indicate fecal contamination and requires prompt action.",

        explanationAbove:
            "The result indicates that E. coli was detected. This can indicate fecal contamination and requires prompt action.",

        publicStepsBelow: [
            "Continue following notices from your water provider.",
            "Do not ignore a boil-water advisory because of an earlier negative sample."
        ],

        publicStepsAbove: [
            "Follow any boil-water or do-not-drink notice issued by your water utility.",
            "Use bottled water or properly boiled water when instructed.",
            "Use safe water for drinking, food preparation, brushing teeth, ice, and infant formula.",
            "Contact your water provider if you obtained this result independently."
        ],

        privateStepsBelow: [
            "Continue routine well testing.",
            "Retest after flooding, repairs, loss of pressure, or changes in taste or odor."
        ],

        privateStepsAbove: [
            "Stop using untreated water for drinking, cooking, brushing teeth, ice, and infant formula.",
            "Contact your local health department.",
            "Inspect and disinfect the well when advised.",
            "Retest through a certified laboratory before returning to normal use."
        ],

        source:
            "https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water"
    }
};


/*
|--------------------------------------------------------------------------
| Page Elements
|--------------------------------------------------------------------------
*/

const form = document.getElementById("water-calculator");
const contaminantSelect = document.getElementById("contaminant");
const resultInput = document.getElementById("result-value");
const unitSelect = document.getElementById("result-unit");
const unitHelp = document.getElementById("unit-help");
const resetButton = document.getElementById("reset-button");
const formError = document.getElementById("form-error");

const emptyResult = document.getElementById("empty-result");
const resultPanel = document.getElementById("result-panel");
const resultHeader = document.getElementById("result-header");

const statusLabel = document.getElementById("status-label");
const resultTitle = document.getElementById("result-title");
const resultValueDisplay =
    document.getElementById("result-value-display");

const comparisonResult =
    document.getElementById("comparison-result");

const benchmarkLabel =
    document.getElementById("benchmark-label");

const comparisonBenchmark =
    document.getElementById("comparison-benchmark");

const resultExplanation =
    document.getElementById("result-explanation");

const nextSteps =
    document.getElementById("next-steps");

const resultLimitation =
    document.getElementById("result-limitation");

const officialSource =
    document.getElementById("official-source");


/*
|--------------------------------------------------------------------------
| Initialize Page
|--------------------------------------------------------------------------
*/

function initializeCalculator() {
    populateContaminants();

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}


function populateContaminants() {
    const sortedEntries = Object.entries(contaminantData)
        .sort((first, second) => {
            return first[1].name.localeCompare(second[1].name);
        });

    sortedEntries.forEach(([key, contaminant]) => {
        const option = document.createElement("option");

        option.value = key;
        option.textContent = contaminant.name;

        contaminantSelect.appendChild(option);
    });
}


/*
|--------------------------------------------------------------------------
| Contaminant and Unit Handling
|--------------------------------------------------------------------------
*/

contaminantSelect.addEventListener("change", function () {
    clearError();
    updateUnitOptions();

    resultInput.value = "";
    hideResult();
});


function updateUnitOptions() {
    const contaminantKey = contaminantSelect.value;

    unitSelect.innerHTML =
        '<option value="">Select unit</option>';

    if (!contaminantKey) {
        unitSelect.disabled = true;

        unitHelp.textContent =
            "Choose a contaminant first to see its available units.";

        return;
    }

    const contaminant = contaminantData[contaminantKey];

    contaminant.supportedUnits.forEach((unit) => {
        const option = document.createElement("option");

        option.value = unit;
        option.textContent = unit;

        unitSelect.appendChild(option);
    });

    unitSelect.disabled = false;

    if (contaminant.baseUnit === "presence") {
        unitHelp.textContent =
            "Choose whether the laboratory reported the organism as detected or not detected.";
    } else {
        unitHelp.textContent =
            `The comparison will be converted to ${contaminant.baseUnit}.`;
    }
}


/*
|--------------------------------------------------------------------------
| Form Submission
|--------------------------------------------------------------------------
*/

form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    const contaminantKey = contaminantSelect.value;
    const selectedUnit = unitSelect.value;

    if (!contaminantKey) {
        showError("Select a contaminant.");
        contaminantSelect.focus();
        return;
    }

    if (!selectedUnit) {
        showError("Select the unit shown on your report.");
        unitSelect.focus();
        return;
    }

    const contaminant = contaminantData[contaminantKey];

    let enteredValue;

    if (contaminant.baseUnit === "presence") {
        enteredValue = selectedUnit === "Detected" ? 1 : 0;
    } else {
        enteredValue = Number(resultInput.value);

        if (
            resultInput.value.trim() === "" ||
            !Number.isFinite(enteredValue) ||
            enteredValue < 0
        ) {
            showError("Enter a valid result of zero or greater.");
            resultInput.focus();
            return;
        }
    }

    const normalizedValue = convertToBaseUnit(
        enteredValue,
        selectedUnit,
        contaminant.baseUnit
    );

    const waterSourceInput = document.querySelector(
        'input[name="waterSource"]:checked'
    );

    const waterSource = waterSourceInput
        ? waterSourceInput.value
        : "public";

    displayResult({
        contaminant,
        enteredValue,
        selectedUnit,
        normalizedValue,
        waterSource
    });
});


/*
|--------------------------------------------------------------------------
| Unit Conversion
|--------------------------------------------------------------------------
*/

function convertToBaseUnit(value, selectedUnit, baseUnit) {
    if (baseUnit === "presence") {
        return value;
    }

    /*
     * ppb and µg/L are treated as equivalent for the
     * water concentrations supported by this calculator.
     *
     * ppm and mg/L are treated as equivalent.
     */

    const microUnits = ["ppb", "µg/L"];
    const milliUnits = ["ppm", "mg/L"];

    if (
        microUnits.includes(selectedUnit) &&
        microUnits.includes(baseUnit)
    ) {
        return value;
    }

    if (
        milliUnits.includes(selectedUnit) &&
        milliUnits.includes(baseUnit)
    ) {
        return value;
    }

    if (
        milliUnits.includes(selectedUnit) &&
        microUnits.includes(baseUnit)
    ) {
        return value * 1000;
    }

    if (
        microUnits.includes(selectedUnit) &&
        milliUnits.includes(baseUnit)
    ) {
        return value / 1000;
    }

    return value;
}


/*
|--------------------------------------------------------------------------
| Result Classification
|--------------------------------------------------------------------------
*/

function classifyResult(normalizedValue, contaminant) {
    if (contaminant.baseUnit === "presence") {
        if (normalizedValue === 0) {
            return {
                key: "below",
                label: "Not detected",
                title: "E. coli was not detected"
            };
        }

        return {
            key: "detected",
            label: "Action recommended",
            title: "E. coli was detected"
        };
    }

    const benchmark = contaminant.benchmark;

    if (normalizedValue > benchmark) {
        return {
            key: "above",
            label: "Above comparison value",
            title: "This result is above the benchmark"
        };
    }

    /*
     * Results from 80% through 100% of the benchmark
     * are displayed as "close to the comparison value."
     */

    if (
        benchmark > 0 &&
        normalizedValue >= benchmark * 0.8
    ) {
        return {
            key: "near",
            label: "Close to comparison value",
            title: "This result is close to the benchmark"
        };
    }

    return {
        key: "below",
        label: "Below comparison value",
        title: "This result is below the benchmark"
    };
}


/*
|--------------------------------------------------------------------------
| Display Result
|--------------------------------------------------------------------------
*/

function displayResult({
    contaminant,
    enteredValue,
    selectedUnit,
    normalizedValue,
    waterSource
}) {
    const classification = classifyResult(
        normalizedValue,
        contaminant
    );

    emptyResult.hidden = true;
    resultPanel.hidden = false;

    resultHeader.className =
        `result-header status-${classification.key}`;

    statusLabel.textContent = classification.label;
    resultTitle.textContent = classification.title;

    const originalDisplay =
        contaminant.baseUnit === "presence"
            ? selectedUnit
            : `${formatNumber(enteredValue)} ${selectedUnit}`;

    resultValueDisplay.textContent =
        `${contaminant.name}: ${originalDisplay}`;

    comparisonResult.textContent = originalDisplay;

    benchmarkLabel.textContent =
        contaminant.benchmarkType;

    comparisonBenchmark.textContent =
        contaminant.benchmarkDisplay;

    resultExplanation.textContent =
        chooseExplanation(classification.key, contaminant);

    renderNextSteps(
        contaminant,
        classification.key,
        waterSource
    );

    resultLimitation.textContent =
        buildLimitationMessage(
            contaminant,
            normalizedValue,
            waterSource
        );

    officialSource.href = contaminant.source;

    resultPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


function chooseExplanation(statusKey, contaminant) {
    if (statusKey === "below") {
        return contaminant.explanationBelow;
    }

    if (statusKey === "near") {
        return contaminant.explanationNear;
    }

    return contaminant.explanationAbove;
}


function renderNextSteps(
    contaminant,
    statusKey,
    waterSource
) {
    nextSteps.innerHTML = "";

    const isAboveOrDetected =
        statusKey === "above" ||
        statusKey === "near" ||
        statusKey === "detected";

    let steps;

    if (waterSource === "private") {
        steps = isAboveOrDetected
            ? contaminant.privateStepsAbove
            : contaminant.privateStepsBelow;
    } else {
        steps = isAboveOrDetected
            ? contaminant.publicStepsAbove
            : contaminant.publicStepsBelow;
    }

    steps.forEach((step) => {
        const listItem = document.createElement("li");

        listItem.textContent = step;
        nextSteps.appendChild(listItem);
    });
}


function buildLimitationMessage(
    contaminant,
    normalizedValue,
    waterSource
) {
    const sourceDescription =
        waterSource === "private"
            ? "Private wells are generally managed by the well owner, and public-water regulatory benchmarks may not be legally applied in the same way."
            : "Public-water compliance is usually determined using required sampling procedures and multiple results, not only one individual number.";

    if (contaminant.baseUnit === "presence") {
        return (
            `${sourceDescription} A microbial result represents the ` +
            "sample collected at a particular location and time."
        );
    }

    return (
        `${sourceDescription} This calculator compares one entered ` +
        `result with ${contaminant.benchmarkDisplay}; it does not ` +
        "evaluate every contaminant, sampling method, laboratory " +
        "qualification, or health circumstance."
    );
}


/*
|--------------------------------------------------------------------------
| Reset and Error Handling
|--------------------------------------------------------------------------
*/

resetButton.addEventListener("click", function () {
    form.reset();

    unitSelect.innerHTML =
        '<option value="">Select unit</option>';

    unitSelect.disabled = true;

    unitHelp.textContent =
        "Choose a contaminant first to see its available units.";

    resultInput.disabled = false;
    resultInput.placeholder = "Example: 12.5";

    clearError();
    hideResult();

    contaminantSelect.focus();
});


unitSelect.addEventListener("change", function () {
    const contaminantKey = contaminantSelect.value;

    if (!contaminantKey) {
        return;
    }

    const contaminant = contaminantData[contaminantKey];

    /*
     * E. coli uses detected/not-detected choices rather than
     * a numeric concentration in this simplified calculator.
     */

    if (contaminant.baseUnit === "presence") {
        resultInput.value = "";
        resultInput.disabled = true;
        resultInput.placeholder = "Not required";
    } else {
        resultInput.disabled = false;
        resultInput.placeholder = "Example: 12.5";
    }
});


function hideResult() {
    resultPanel.hidden = true;
    emptyResult.hidden = false;
}


function showError(message) {
    formError.textContent = message;
    formError.hidden = false;
}


function clearError() {
    formError.textContent = "";
    formError.hidden = true;
}


/*
|--------------------------------------------------------------------------
| Utilities
|--------------------------------------------------------------------------
*/

function formatNumber(value) {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 4
    }).format(value);
}


initializeCalculator();
