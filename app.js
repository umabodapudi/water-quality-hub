"use strict";

/*
=========================================================
WATER QUALITY HUB APPLICATION
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    const data = window.WATER_HUB_DATA;

    if (!data) {
        console.error(
            "WATER_HUB_DATA was not found. Make sure app-data.js loads before app.js."
        );
        return;
    }

    /*
    =====================================================
    GENERAL ELEMENTS
    =====================================================
    */

    const views = document.querySelectorAll(".app-view");
    const navigationLinks = document.querySelectorAll("[data-route]");
    const routeButtons = document.querySelectorAll("[data-go-to]");

    const menuButton = document.getElementById("menu-button");
    const mainNavigation = document.getElementById("main-navigation");
    const currentYear = document.getElementById("current-year");

    const validRoutes = [
        "home",
        "calculator",
        "contaminants",
        "treatment",
        "well",
        "emergency",
        "report"
    ];

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /*
    =====================================================
    ROUTING
    =====================================================
    */

    function getRouteFromHash() {
        const route = window.location.hash
            .replace("#", "")
            .trim();

        return validRoutes.includes(route)
            ? route
            : "home";
    }

    function showRoute(route, updateHash = true) {
        const safeRoute = validRoutes.includes(route)
            ? route
            : "home";

        views.forEach((view) => {
            const isActive =
                view.dataset.view === safeRoute;

            view.hidden = !isActive;
            view.classList.toggle("active", isActive);
        });

        navigationLinks.forEach((link) => {
            const isActive =
                link.dataset.route === safeRoute;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute(
                    "aria-current",
                    "page"
                );
            } else {
                link.removeAttribute("aria-current");
            }
        });

        if (updateHash) {
            history.pushState(
                null,
                "",
                `#${safeRoute}`
            );
        }

        closeMenu();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    navigationLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            showRoute(link.dataset.route);
        });
    });

    routeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            showRoute(button.dataset.goTo);
        });
    });

    window.addEventListener("popstate", () => {
        showRoute(getRouteFromHash(), false);
    });

    window.addEventListener("hashchange", () => {
        showRoute(getRouteFromHash(), false);
    });

    /*
    =====================================================
    MOBILE MENU
    =====================================================
    */

    function closeMenu() {
        if (!menuButton || !mainNavigation) {
            return;
        }

        mainNavigation.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );
    }

    function openMenu() {
        if (!menuButton || !mainNavigation) {
            return;
        }

        mainNavigation.classList.add("open");

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add(
            "menu-open"
        );
    }

    if (menuButton && mainNavigation) {
        menuButton.addEventListener("click", () => {
            const isOpen =
                menuButton.getAttribute(
                    "aria-expanded"
                ) === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.addEventListener(
            "click",
            (event) => {
                const clickedInsideMenu =
                    mainNavigation.contains(
                        event.target
                    ) ||
                    menuButton.contains(
                        event.target
                    );

                if (!clickedInsideMenu) {
                    closeMenu();
                }
            }
        );

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    /*
    =====================================================
    SHARED HELPERS
    =====================================================
    */

    function findContaminant(id) {
        return data.contaminants.find(
            (contaminant) =>
                contaminant.id === id
        );
    }

    function formatNumber(number) {
        if (!Number.isFinite(number)) {
            return "";
        }

        if (number === 0) {
            return "0";
        }

        if (number < 0.01) {
            return number
                .toFixed(3)
                .replace(/0+$/, "")
                .replace(/\.$/, "");
        }

        if (number < 1) {
            return number
                .toFixed(2)
                .replace(/0+$/, "")
                .replace(/\.$/, "");
        }

        if (number < 100) {
            return number
                .toFixed(1)
                .replace(/\.0$/, "");
        }

        return number.toLocaleString(
            undefined,
            {
                maximumFractionDigits: 1
            }
        );
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function createList(items) {
        return items
            .map(
                (item) =>
                    `<li>${escapeHtml(item)}</li>`
            )
            .join("");
    }

    function convertToPpb(value, unit) {
        const unitData = data.units[unit];

        if (!unitData) {
            return null;
        }

        return value * unitData.toPpb;
    }

    function scrollToElement(element) {
        if (!element) {
            return;
        }

        setTimeout(() => {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }

    /*
    =====================================================
    RESULT CHECKER
    =====================================================
    */

    const calculatorForm =
        document.getElementById(
            "water-calculator"
        );

    const calculatorContaminant =
        document.getElementById(
            "calculator-contaminant"
        );

    const calculatorValue =
        document.getElementById(
            "calculator-value"
        );

    const calculatorUnit =
        document.getElementById(
            "calculator-unit"
        );

    const calculatorError =
        document.getElementById(
            "calculator-error"
        );

    const calculatorReset =
        document.getElementById(
            "calculator-reset"
        );

    const calculatorEmptyResult =
        document.getElementById(
            "calculator-empty-result"
        );

    const calculatorResultPanel =
        document.getElementById(
            "calculator-result-panel"
        );

    const calculatorStatus =
        document.getElementById(
            "calculator-status"
        );

    const calculatorResultTitle =
        document.getElementById(
            "calculator-result-title"
        );

    const calculatorResultSummary =
        document.getElementById(
            "calculator-result-summary"
        );

    const calculatorResultValue =
        document.getElementById(
            "calculator-result-value"
        );

    const calculatorBenchmarkType =
        document.getElementById(
            "calculator-benchmark-type"
        );

    const calculatorBenchmarkValue =
        document.getElementById(
            "calculator-benchmark-value"
        );

    const calculatorExplanation =
        document.getElementById(
            "calculator-explanation"
        );

    const calculatorNextSteps =
        document.getElementById(
            "calculator-next-steps"
        );

    const calculatorLimitation =
        document.getElementById(
            "calculator-limitation"
        );

    const calculatorSource =
        document.getElementById(
            "calculator-source"
        );

    function populateCalculatorContaminants() {
        if (!calculatorContaminant) {
            return;
        }

        calculatorContaminant.innerHTML =
            '<option value="">Choose contaminant</option>';

        const numericalContaminants =
            data.contaminants.filter(
                (contaminant) =>
                    !contaminant.textResult &&
                    contaminant.benchmark
                        .valuePpb !== null
            );

        numericalContaminants.forEach(
            (contaminant) => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value = contaminant.id;
                option.textContent =
                    contaminant.name;

                calculatorContaminant.appendChild(
                    option
                );
            }
        );
    }

    function updateCalculatorUnits() {
        if (
            !calculatorContaminant ||
            !calculatorUnit
        ) {
            return;
        }

        const contaminant =
            findContaminant(
                calculatorContaminant.value
            );

        calculatorUnit.innerHTML =
            '<option value="">Choose unit</option>';

        if (!contaminant) {
            calculatorUnit.disabled = true;
            return;
        }

        contaminant.acceptedUnits.forEach(
            (unit) => {
                const unitInformation =
                    data.units[unit];

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = unit;

                option.textContent =
                    unitInformation
                        ? `${unitInformation.label} — ${unitInformation.fullName}`
                        : unit;

                calculatorUnit.appendChild(
                    option
                );
            }
        );

        calculatorUnit.disabled = false;

        if (
            contaminant.acceptedUnits.length ===
            1
        ) {
            calculatorUnit.value =
                contaminant.acceptedUnits[0];
        }
    }

    function showCalculatorError(message) {
        if (!calculatorError) {
            return;
        }

        calculatorError.textContent = message;
        calculatorError.hidden = false;
    }

    function hideCalculatorError() {
        if (!calculatorError) {
            return;
        }

        calculatorError.hidden = true;
        calculatorError.textContent = "";
    }

    function getResultLevel(
        valuePpb,
        benchmarkPpb
    ) {
        const ratio =
            valuePpb / benchmarkPpb;

        if (ratio > 1) {
            return "above";
        }

        if (ratio >= 0.8) {
            return "near";
        }

        return "below";
    }

    function getResultContent(
        contaminant,
        level
    ) {
        if (level === "above") {
            return {
                status: "Above limit",
                title:
                    "This result needs attention.",
                summary:
                    contaminant.aboveMessage,
                explanation:
                    `Your result is above the ${contaminant.benchmark.shortType.toLowerCase()} shown for ${contaminant.name}.`,
                stepGroup:
                    contaminant.aboveSteps
            };
        }

        if (level === "near") {
            return {
                status: "Close to limit",
                title:
                    "This result is close to the limit.",
                summary:
                    contaminant.nearMessage,
                explanation:
                    `Your result is within 20% of the ${contaminant.benchmark.shortType.toLowerCase()}. A confirmation test may help.`,
                stepGroup:
                    contaminant.nearSteps
            };
        }

        return {
            status: "Below limit",
            title:
                "This result is below the limit.",
            summary:
                contaminant.belowMessage,
            explanation:
                `Your result is below the ${contaminant.benchmark.shortType.toLowerCase()} shown for ${contaminant.name}.`,
            stepGroup:
                contaminant.belowSteps
        };
    }

    function getWaterSource() {
        const selectedSource =
            document.querySelector(
                'input[name="waterSource"]:checked'
            );

        return selectedSource
            ? selectedSource.value
            : "general";
    }

    /*
    FIX:
    Previously general steps could be included twice.
    Set removes any accidental duplicate sentences.
    */

    function combineNextSteps(
        stepGroup,
        waterSource
    ) {
        let steps = [];

        if (waterSource === "general") {
            steps =
                stepGroup.general || [];
        } else {
            steps = [
                ...(stepGroup[waterSource] ||
                    []),
                ...(stepGroup.general || [])
            ];
        }

        return [...new Set(steps)];
    }

    function displayCalculatorResult(
        contaminant,
        originalValue,
        originalUnit,
        valuePpb
    ) {
        if (
            !calculatorResultPanel ||
            !calculatorEmptyResult
        ) {
            return;
        }

        const benchmarkPpb =
            contaminant.benchmark.valuePpb;

        const level = getResultLevel(
            valuePpb,
            benchmarkPpb
        );

        const content =
            getResultContent(
                contaminant,
                level
            );

        const waterSource =
            getWaterSource();

        const nextSteps =
            combineNextSteps(
                content.stepGroup,
                waterSource
            );

        if (calculatorStatus) {
            calculatorStatus.textContent =
                content.status;

            calculatorStatus.dataset.level =
                level;
        }

        if (calculatorResultTitle) {
            calculatorResultTitle.textContent =
                content.title;
        }

        if (calculatorResultSummary) {
            calculatorResultSummary.textContent =
                content.summary;
        }

        if (calculatorResultValue) {
            calculatorResultValue.textContent =
                `${formatNumber(originalValue)} ${originalUnit}`;
        }

        if (calculatorBenchmarkType) {
            calculatorBenchmarkType.textContent =
                contaminant.benchmark
                    .shortType;
        }

        if (calculatorBenchmarkValue) {
            calculatorBenchmarkValue.textContent =
                contaminant.benchmark
                    .displayValue;
        }

        if (calculatorExplanation) {
            calculatorExplanation.textContent =
                content.explanation;
        }

        if (calculatorNextSteps) {
            calculatorNextSteps.innerHTML =
                createList(nextSteps);
        }

        if (calculatorLimitation) {
            calculatorLimitation.textContent =
                "One result cannot describe every tap or your exposure over time. Sampling method, timing, plumbing, and laboratory instructions can affect the result.";
        }

        if (calculatorSource) {
            calculatorSource.href =
                contaminant.officialUrl;
        }

        calculatorEmptyResult.hidden = true;
        calculatorResultPanel.hidden = false;

        scrollToElement(
            calculatorResultPanel
        );
    }

    function resetCalculator() {
        if (!calculatorForm) {
            return;
        }

        calculatorForm.reset();

        if (calculatorUnit) {
            calculatorUnit.innerHTML =
                '<option value="">Choose unit</option>';

            calculatorUnit.disabled = true;
        }

        hideCalculatorError();

        if (calculatorResultPanel) {
            calculatorResultPanel.hidden = true;
        }

        if (calculatorEmptyResult) {
            calculatorEmptyResult.hidden = false;
        }
    }

    if (calculatorContaminant) {
        calculatorContaminant.addEventListener(
            "change",
            updateCalculatorUnits
        );
    }

    if (calculatorForm) {
        calculatorForm.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                hideCalculatorError();

                const contaminant =
                    findContaminant(
                        calculatorContaminant
                            ?.value
                    );

                const enteredValue =
                    Number(
                        calculatorValue?.value
                    );

                const enteredUnit =
                    calculatorUnit?.value;

                if (!contaminant) {
                    showCalculatorError(
                        "Choose a contaminant."
                    );

                    calculatorContaminant?.focus();
                    return;
                }

                if (
                    !calculatorValue ||
                    calculatorValue.value.trim() ===
                        "" ||
                    !Number.isFinite(
                        enteredValue
                    ) ||
                    enteredValue < 0
                ) {
                    showCalculatorError(
                        "Enter a valid result."
                    );

                    calculatorValue?.focus();
                    return;
                }

                if (!enteredUnit) {
                    showCalculatorError(
                        "Choose the unit shown on your report."
                    );

                    calculatorUnit?.focus();
                    return;
                }

                const valuePpb =
                    convertToPpb(
                        enteredValue,
                        enteredUnit
                    );

                if (valuePpb === null) {
                    showCalculatorError(
                        "The selected unit could not be converted."
                    );

                    return;
                }

                displayCalculatorResult(
                    contaminant,
                    enteredValue,
                    enteredUnit,
                    valuePpb
                );
            }
        );
    }

    if (calculatorReset) {
        calculatorReset.addEventListener(
            "click",
            resetCalculator
        );
    }

    /*
    =====================================================
    CONTAMINANT LIBRARY
    =====================================================
    */

    const contaminantSearch =
        document.getElementById(
            "contaminant-search"
        );

    const contaminantList =
        document.getElementById(
            "contaminant-list"
        );

    const contaminantCount =
        document.getElementById(
            "contaminant-count"
        );

    const contaminantDetail =
        document.getElementById(
            "contaminant-detail"
        );

    const contaminantNoResults =
        document.getElementById(
            "contaminant-no-results"
        );

    const contaminantFilterButtons =
        document.querySelectorAll(
            "#contaminant-filters .filter-button"
        );

    let activeContaminantFilter = "all";
    let selectedContaminantId = null;

    function matchesContaminantSearch(
        contaminant,
        query
    ) {
        const searchableText = [
            contaminant.name,
            contaminant.description,
            contaminant.source,
            ...(contaminant.searchTerms ||
                [])
        ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(
            query.toLowerCase()
        );
    }

    function getFilteredContaminants() {
        const query = contaminantSearch
            ? contaminantSearch.value.trim()
            : "";

        return data.contaminants.filter(
            (contaminant) => {
                const matchesFilter =
                    activeContaminantFilter ===
                        "all" ||
                    contaminant.category ===
                        activeContaminantFilter;

                const matchesSearch =
                    query === "" ||
                    matchesContaminantSearch(
                        contaminant,
                        query
                    );

                return (
                    matchesFilter &&
                    matchesSearch
                );
            }
        );
    }

    function getCategoryLabel(category) {
        const labels = {
            metals: "Metal",
            microbial: "Microbial",
            chemicals: "Chemical",
            aesthetic:
                "Taste or appearance"
        };

        return labels[category] || category;
    }

    function renderContaminantList() {
        if (!contaminantList) {
            return;
        }

        const contaminants =
            getFilteredContaminants();

        contaminantList.innerHTML = "";

        if (contaminantCount) {
            contaminantCount.textContent =
                `${contaminants.length} result${
                    contaminants.length === 1
                        ? ""
                        : "s"
                }`;
        }

        if (contaminantNoResults) {
            contaminantNoResults.hidden =
                contaminants.length !== 0;
        }

        contaminants.forEach(
            (contaminant) => {
                const button =
                    document.createElement(
                        "button"
                    );

                button.type = "button";
                button.className =
                    "contaminant-item";

                button.dataset.contaminantId =
                    contaminant.id;

                if (
                    selectedContaminantId ===
                    contaminant.id
                ) {
                    button.classList.add(
                        "active"
                    );
                }

                button.innerHTML = `
                    <span>
                        <strong>
                            ${escapeHtml(contaminant.name)}
                        </strong>

                        <small>
                            ${escapeHtml(
                                getCategoryLabel(
                                    contaminant.category
                                )
                            )}
                        </small>
                    </span>

                    <span aria-hidden="true">
                        →
                    </span>
                `;

                button.addEventListener(
                    "click",
                    () => {
                        openContaminant(
                            contaminant.id
                        );
                    }
                );

                contaminantList.appendChild(
                    button
                );
            }
        );
    }

    function createTreatmentSummary(
        contaminant
    ) {
        if (
            Array.isArray(
                contaminant.treatments
            ) &&
            contaminant.treatments.length >
                0
        ) {
            return {
                available: true,
                text: contaminant.treatments
                    .map(
                        (treatment) =>
                            treatment.name
                    )
                    .join(", ")
            };
        }

        const customMessages = {
            "e-coli":
                "Disinfection may be needed, but the contamination source should also be identified and corrected.",

            "taste-smell":
                "The correct treatment depends on what is causing the taste, odor, color, or cloudiness."
        };

        return {
            available: false,
            text:
                customMessages[
                    contaminant.id
                ] ||
                "Testing is needed before choosing a treatment."
        };
    }

    function renderContaminantDetail(
        contaminant
    ) {
        if (!contaminantDetail) {
            return;
        }

        const benchmarkText =
            contaminant.benchmark
                .displayValue;

        const treatmentSummary =
            createTreatmentSummary(
                contaminant
            );

        contaminantDetail.innerHTML = `
            <div class="detail-header">
                <p class="eyebrow">
                    ${escapeHtml(
                        getCategoryLabel(
                            contaminant.category
                        )
                    )}
                </p>

                <h2>
                    ${escapeHtml(contaminant.name)}
                </h2>

                <p>
                    ${escapeHtml(
                        contaminant.description
                    )}
                </p>
            </div>

            <div class="detail-section">
                <h3>
                    ${escapeHtml(
                        contaminant.benchmark
                            .shortType
                    )}
                </h3>

                <p class="limit-number">
                    ${escapeHtml(benchmarkText)}
                </p>

                <small class="detail-help-text">
                    ${escapeHtml(
                        contaminant.benchmark.type
                    )}
                </small>
            </div>

            <div class="detail-section">
                <h3>Where it comes from</h3>

                <p>
                    ${escapeHtml(
                        contaminant.source
                    )}
                </p>
            </div>

            <div class="detail-section">
                <h3>Why it matters</h3>

                <p>
                    ${escapeHtml(
                        contaminant.health
                    )}
                </p>
            </div>

            <div class="detail-section">
                <h3>Who may be more sensitive</h3>

                <p>
                    ${escapeHtml(
                        contaminant.sensitiveGroups
                    )}
                </p>
            </div>

            <div class="detail-section">
                <h3>Does boiling help?</h3>

                <p>
                    ${escapeHtml(
                        contaminant.boiling
                    )}
                </p>
            </div>

            <div class="detail-section">
                <h3>
                    ${
                        treatmentSummary.available
                            ? "Treatment options"
                            : "Before choosing treatment"
                    }
                </h3>

                <p>
                    ${escapeHtml(
                        treatmentSummary.text
                    )}
                </p>

                ${
                    treatmentSummary.available
                        ? `
                            <button
                                class="inline-action-button"
                                type="button"
                                data-open-treatment="${escapeHtml(
                                    contaminant.id
                                )}"
                            >
                                Compare treatment options
                                <span aria-hidden="true">→</span>
                            </button>
                        `
                        : ""
                }
            </div>

            <a
                class="source-link"
                href="${escapeHtml(
                    contaminant.officialUrl
                )}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Read official guidance
                <span aria-hidden="true">→</span>
            </a>
        `;

        /*
        This code must be AFTER the closing `; above.
        It connects the dynamically created treatment button.
        */

        const treatmentButton =
            contaminantDetail.querySelector(
                "[data-open-treatment]"
            );

        if (treatmentButton) {
            treatmentButton.addEventListener(
                "click",
                () => {
                    const contaminantId =
                        treatmentButton.dataset
                            .openTreatment;

                    showRoute("treatment");

                    if (
                        treatmentContaminant
                    ) {
                        treatmentContaminant.value =
                            contaminantId;

                        treatmentContaminant.focus();
                    }

                    if (treatmentEmpty) {
                        treatmentEmpty.hidden =
                            false;
                    }

                    if (treatmentResults) {
                        treatmentResults.hidden =
                            true;
                    }
                }
            );
        }
    }

    function openContaminant(
        contaminantId
    ) {
        const contaminant =
            findContaminant(contaminantId);

        if (!contaminant) {
            return;
        }

        selectedContaminantId =
            contaminantId;

        showRoute("contaminants");

        renderContaminantList();
        renderContaminantDetail(
            contaminant
        );

        if (
            window.innerWidth <= 940 &&
            contaminantDetail
        ) {
            scrollToElement(
                contaminantDetail
            );
        }
    }

    if (contaminantSearch) {
        contaminantSearch.addEventListener(
            "input",
            renderContaminantList
        );
    }

    contaminantFilterButtons.forEach(
        (button) => {
            button.addEventListener(
                "click",
                () => {
                    activeContaminantFilter =
                        button.dataset.filter;

                    contaminantFilterButtons.forEach(
                        (filterButton) => {
                            filterButton.classList.toggle(
                                "active",
                                filterButton ===
                                    button
                            );
                        }
                    );

                    renderContaminantList();
                }
            );
        }
    );

    document
        .querySelectorAll(
            "[data-contaminant-open]"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    openContaminant(
                        button.dataset
                            .contaminantOpen
                    );
                }
            );
        });

    /*
    =====================================================
    TREATMENT FINDER
    =====================================================
    */

    const treatmentForm =
        document.getElementById(
            "treatment-form"
        );

    const treatmentContaminant =
        document.getElementById(
            "treatment-contaminant"
        );

    const treatmentEmpty =
        document.getElementById(
            "treatment-empty"
        );

    const treatmentResults =
        document.getElementById(
            "treatment-results"
        );

    function populateTreatmentContaminants() {
        if (!treatmentContaminant) {
            return;
        }

        treatmentContaminant.innerHTML =
            '<option value="">Choose contaminant</option>';

        data.contaminants
            .filter(
                (contaminant) =>
                    Array.isArray(
                        contaminant.treatments
                    ) &&
                    contaminant.treatments
                        .length > 0
            )
            .forEach((contaminant) => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    contaminant.id;

                option.textContent =
                    contaminant.name;

                treatmentContaminant.appendChild(
                    option
                );
            });
    }

    function getSelectedRadioValue(name) {
        const selected =
            document.querySelector(
                `input[name="${name}"]:checked`
            );

        return selected
            ? selected.value
            : "";
    }

    /*
    Treatment matching now checks both:
    1. Location
    2. Budget

    If no exact match exists, it clearly tells the user
    whether the alternatives match location or budget.
    */

    function rankTreatments(
        treatments,
        selectedLocation,
        selectedBudget
    ) {
        const exactMatches =
            treatments.filter(
                (treatment) =>
                    treatment.locations.includes(
                        selectedLocation
                    ) &&
                    treatment.budgets.includes(
                        selectedBudget
                    )
            );

        if (exactMatches.length > 0) {
            return {
                matchType: "exact",
                treatments: exactMatches
            };
        }

        const locationMatches =
            treatments.filter(
                (treatment) =>
                    treatment.locations.includes(
                        selectedLocation
                    )
            );

        if (locationMatches.length > 0) {
            return {
                matchType: "location",
                treatments:
                    locationMatches
            };
        }

        const budgetMatches =
            treatments.filter(
                (treatment) =>
                    treatment.budgets.includes(
                        selectedBudget
                    )
            );

        if (budgetMatches.length > 0) {
            return {
                matchType: "budget",
                treatments:
                    budgetMatches
            };
        }

        return {
            matchType: "none",
            treatments: []
        };
    }

    function renderTreatmentResults(
        contaminant,
        treatments,
        selectedLocation,
        selectedBudget,
        matchType
    ) {
        if (!treatmentResults) {
            return;
        }

        treatmentResults.innerHTML = "";

        const locationLabels = {
            "point-of-use":
                "Drinking-water tap",
            "whole-house":
                "Whole house"
        };

        const budgetLabels = {
            low: "Lower budget",
            medium: "Moderate budget",
            high: "Higher budget"
        };

        const matchMessages = {
            exact:
                "These options match both your selected treatment location and budget.",

            location:
                "No option matched both choices. These options match your treatment location but may require a different budget.",

            budget:
                "No option matched both choices. These options match your budget but may use a different treatment location.",

            none:
                "No matching treatment was found for the selected choices."
        };

        if (treatments.length === 0) {
            treatmentResults.innerHTML = `
                <section class="panel empty-result treatment-no-match">
                    <span
                        class="empty-result-icon"
                        aria-hidden="true"
                    >
                        ?
                    </span>

                    <p class="eyebrow">
                        No close match
                    </p>

                    <h2>
                        Try different treatment choices
                    </h2>

                    <p>
                        No option in this guide matches both
                        your selected setup and budget for
                        ${escapeHtml(
                            contaminant.name
                        )}.
                    </p>

                    <p>
                        Try another budget or treatment
                        location. A qualified water-treatment
                        professional can also evaluate your
                        complete water test.
                    </p>
                </section>
            `;

            if (treatmentEmpty) {
                treatmentEmpty.hidden = true;
            }

            treatmentResults.hidden = false;

            scrollToElement(
                treatmentResults
            );

            return;
        }

        const heading =
            document.createElement(
                "section"
            );

        heading.className =
            "panel treatment-results-heading";

        heading.innerHTML = `
            <div class="treatment-updated-label">
                <span aria-hidden="true">✓</span>
                Treatment suggestions updated
            </div>

            <h2>
                Options for
                ${escapeHtml(
                    contaminant.name
                )}
            </h2>

            <div class="selected-treatment-choices">
                <span>
                    ${escapeHtml(
                        locationLabels[
                            selectedLocation
                        ] ||
                            selectedLocation
                    )}
                </span>

                <span>
                    ${escapeHtml(
                        budgetLabels[
                            selectedBudget
                        ] ||
                            selectedBudget
                    )}
                </span>
            </div>

            <p class="treatment-match-message">
                ${escapeHtml(
                    matchMessages[matchType]
                )}
            </p>

            <p class="treatment-disclaimer">
                These are treatment technologies to
                compare, not specific product
                recommendations. Check the product’s
                certified contaminant-reduction claim.
            </p>
        `;

        treatmentResults.appendChild(
            heading
        );

        treatments.forEach(
            (treatment, index) => {
                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "panel treatment-card";

                const locationMatches =
                    treatment.locations.includes(
                        selectedLocation
                    );

                const budgetMatches =
                    treatment.budgets.includes(
                        selectedBudget
                    );

                let matchLabel =
                    "Alternative option";

                if (
                    locationMatches &&
                    budgetMatches
                ) {
                    matchLabel =
                        "Matches both choices";
                } else if (
                    locationMatches
                ) {
                    matchLabel =
                        "Matches treatment location";
                } else if (
                    budgetMatches
                ) {
                    matchLabel =
                        "Matches budget";
                }

                card.innerHTML = `
                    <div class="treatment-card-top">
                        <p class="eyebrow">
                            ${
                                index === 0
                                    ? "Top suggestion"
                                    : "Another suggestion"
                            }
                        </p>

                        <span class="match-badge">
                            ${escapeHtml(
                                matchLabel
                            )}
                        </span>
                    </div>

                    <h3>
                        ${escapeHtml(
                            treatment.name
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            treatment.fit
                        )}
                    </p>

                    <div class="treatment-meta">
                        <span>
                            ${escapeHtml(
                                treatment.locations
                                    .map(
                                        (
                                            location
                                        ) =>
                                            location ===
                                            "point-of-use"
                                                ? "Tap treatment"
                                                : "Whole house"
                                    )
                                    .join(" / ")
                            )}
                        </span>

                        <span>
                            ${escapeHtml(
                                treatment.budgets
                                    .map(
                                        (
                                            budget
                                        ) =>
                                            budgetLabels[
                                                budget
                                            ] ||
                                            budget
                                    )
                                    .join(" / ")
                            )}
                        </span>
                    </div>

                    <div class="detail-section">
                        <h4>
                            What to look for
                        </h4>

                        <p>
                            ${escapeHtml(
                                treatment.certification
                            )}
                        </p>
                    </div>

                    <div class="detail-section">
                        <h4>Maintenance</h4>

                        <p>
                            ${escapeHtml(
                                treatment.maintenance
                            )}
                        </p>
                    </div>

                    <div class="detail-section">
                        <h4>
                            Keep in mind
                        </h4>

                        <p>
                            ${escapeHtml(
                                treatment.limitation
                            )}
                        </p>
                    </div>
                `;

                treatmentResults.appendChild(
                    card
                );
            }
        );

        if (treatmentEmpty) {
            treatmentEmpty.hidden = true;
        }

        treatmentResults.hidden = false;

        scrollToElement(
            treatmentResults
        );
    }

    if (treatmentForm) {
        treatmentForm.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const contaminant =
                    findContaminant(
                        treatmentContaminant
                            ?.value
                    );

                if (!contaminant) {
                    treatmentContaminant?.focus();
                    return;
                }

                const selectedLocation =
                    getSelectedRadioValue(
                        "treatmentLocation"
                    );

                const selectedBudget =
                    getSelectedRadioValue(
                        "budget"
                    );

                if (!selectedLocation) {
                    alert(
                        "Choose where you want the treatment installed."
                    );
                    return;
                }

                if (!selectedBudget) {
                    alert(
                        "Choose a budget range."
                    );
                    return;
                }

                const matchResult =
                    rankTreatments(
                        contaminant.treatments,
                        selectedLocation,
                        selectedBudget
                    );

                renderTreatmentResults(
                    contaminant,
                    matchResult.treatments,
                    selectedLocation,
                    selectedBudget,
                    matchResult.matchType
                );
            }
        );
    }

    /*
    =====================================================
    PRIVATE WELL ASSISTANT
    =====================================================
    */

    const wellGuidance =
        document.getElementById(
            "well-guidance"
        );

    function showWellGuidance(
        situationId
    ) {
        const guidance =
            data.wellGuidance[
                situationId
            ];

        if (
            !guidance ||
            !wellGuidance
        ) {
            return;
        }

        wellGuidance.innerHTML = `
            <p class="eyebrow">
                Private well guidance
            </p>

            <h2>
                ${escapeHtml(guidance.title)}
            </h2>

            <p>
                ${escapeHtml(guidance.intro)}
            </p>

            <div class="detail-section">
                <h3>What to do</h3>

                <ul class="result-list">
                    ${createList(
                        guidance.steps
                    )}
                </ul>
            </div>

            <div class="result-note">
                ${escapeHtml(guidance.note)}
            </div>
        `;

        wellGuidance.hidden = false;

        scrollToElement(wellGuidance);
    }

    document
        .querySelectorAll(
            "[data-well-situation]"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    showWellGuidance(
                        button.dataset
                            .wellSituation
                    );
                }
            );
        });

    /*
    =====================================================
    WATER ADVISORIES
    =====================================================
    */

    const emergencyGuidance =
        document.getElementById(
            "emergency-guidance"
        );

    function showEmergencyGuidance(
        advisoryId
    ) {
        const guidance =
            data.emergencyGuidance[
                advisoryId
            ];

        if (
            !guidance ||
            !emergencyGuidance
        ) {
            return;
        }

        showRoute("emergency");

        emergencyGuidance.innerHTML = `
            <p class="eyebrow">
                What to do now
            </p>

            <h2>
                ${escapeHtml(guidance.title)}
            </h2>

            <p>
                ${escapeHtml(guidance.intro)}
            </p>

            <div class="detail-section">
                <h3>Steps</h3>

                <ul class="result-list">
                    ${createList(
                        guidance.steps
                    )}
                </ul>
            </div>

            <div class="result-note warning-note">
                <strong>Important:</strong>
                ${escapeHtml(guidance.avoid)}
            </div>

            <a
                class="source-link"
                href="${escapeHtml(
                    guidance.sourceUrl
                )}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Read official guidance
                <span aria-hidden="true">→</span>
            </a>
        `;

        emergencyGuidance.hidden = false;

        scrollToElement(
            emergencyGuidance
        );
    }

    document
        .querySelectorAll(
            "[data-emergency]"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    showEmergencyGuidance(
                        button.dataset
                            .emergency
                    );
                }
            );
        });

    document
        .querySelectorAll(
            "[data-emergency-open]"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    showEmergencyGuidance(
                        button.dataset
                            .emergencyOpen
                    );
                }
            );
        });

    /*
=========================================================
ROTATING HOME RESULT EXAMPLES
=========================================================
*/

const rotatingContaminant =
    document.getElementById(
        "rotating-contaminant"
    );

const rotatingValue =
    document.getElementById(
        "rotating-value"
    );

const rotatingStatus =
    document.getElementById(
        "rotating-status"
    );

const rotatingStatusRow =
    document.getElementById(
        "rotating-status-row"
    );

const rotatingDescription =
    document.getElementById(
        "rotating-description"
    );

const rotatingResult =
    document.getElementById(
        "rotating-result"
    );

const rotatingDots =
    document.querySelectorAll(
        ".rotating-result-dots span"
    );

const rotatingExamples = [
    {
        contaminant: "Arsenic",
        value: "12 ppb",
        status: "Above the drinking-water limit",
        level: "above",
        description:
            "Arsenic at this level is above the federal limit of 10 ppb."
    },
    {
        contaminant: "Lead",
        value: "8 ppb",
        status: "Below the action level",
        level: "below",
        description:
            "Lead can enter water from household plumbing and fixtures."
    },
    {
        contaminant: "Nitrate",
        value: "11 ppm",
        status: "Above the drinking-water limit",
        level: "above",
        description:
            "Nitrate above 10 ppm requires prompt attention, especially for infants."
    },
    {
        contaminant: "Fluoride",
        value: "2.1 ppm",
        status: "Below the drinking-water limit",
        level: "below",
        description:
            "This result is below the federal maximum contaminant level."
    },
    {
        contaminant: "PFOS",
        value: "5 ppt",
        status: "Above the drinking-water limit",
        level: "above",
        description:
            "PFOS is measured in very small concentrations using parts per trillion."
    }
];

let rotatingExampleIndex = 0;
let rotatingExampleTimer = null;

function updateRotatingExample() {
    if (
        !rotatingContaminant ||
        !rotatingValue ||
        !rotatingStatus ||
        !rotatingResult
    ) {
        return;
    }

    const example =
        rotatingExamples[
            rotatingExampleIndex
        ];

    rotatingResult.classList.add(
        "changing"
    );

    setTimeout(() => {
        rotatingContaminant.textContent =
            example.contaminant;

        rotatingValue.textContent =
            example.value;

        rotatingStatus.textContent =
            example.status;

        if (rotatingDescription) {
            rotatingDescription.textContent =
                example.description;
        }

        if (rotatingStatusRow) {
            rotatingStatusRow.dataset.level =
                example.level;
        }

        rotatingDots.forEach(
            (dot, index) => {
                dot.classList.toggle(
                    "active",
                    index ===
                        rotatingExampleIndex
                );
            }
        );

        rotatingResult.classList.remove(
            "changing"
        );
    }, 220);
}

function showNextRotatingExample() {
    rotatingExampleIndex =
        (rotatingExampleIndex + 1) %
        rotatingExamples.length;

    updateRotatingExample();
}

function startRotatingExamples() {
    if (!rotatingResult) {
        return;
    }

    rotatingExampleTimer =
        window.setInterval(
            showNextRotatingExample,
            2000
        );
}

function stopRotatingExamples() {
    if (rotatingExampleTimer) {
        window.clearInterval(
            rotatingExampleTimer
        );

        rotatingExampleTimer = null;
    }
}

if (rotatingResult) {
    updateRotatingExample();
    startRotatingExamples();

    rotatingResult.addEventListener(
        "mouseenter",
        stopRotatingExamples
    );

    rotatingResult.addEventListener(
        "mouseleave",
        startRotatingExamples
    );

    rotatingResult.addEventListener(
        "focusin",
        stopRotatingExamples
    );

    rotatingResult.addEventListener(
        "focusout",
        startRotatingExamples
    );
}

    /*
    =====================================================
    INITIALIZE
    =====================================================
    */

    populateCalculatorContaminants();
    populateTreatmentContaminants();
    renderContaminantList();

    showRoute(
        getRouteFromHash(),
        false
    );
});
