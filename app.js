"use strict";

/*
=========================================================
WATER QUALITY HUB APPLICATION
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    const data = window.WATER_HUB_DATA;

    if (!data) {
        console.error("WATER_HUB_DATA was not found.");
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
        const route = window.location.hash.replace("#", "").trim();

        return validRoutes.includes(route) ? route : "home";
    }

    function showRoute(route, updateHash = true) {
        const safeRoute = validRoutes.includes(route) ? route : "home";

        views.forEach((view) => {
            const isActive = view.dataset.view === safeRoute;

            view.hidden = !isActive;
            view.classList.toggle("active", isActive);
        });

        navigationLinks.forEach((link) => {
            const isActive = link.dataset.route === safeRoute;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        if (updateHash) {
            history.pushState(null, "", `#${safeRoute}`);
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
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    function openMenu() {
        if (!menuButton || !mainNavigation) {
            return;
        }

        mainNavigation.classList.add("open");
        menuButton.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
    }

    if (menuButton && mainNavigation) {
        menuButton.addEventListener("click", () => {
            const isOpen =
                menuButton.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.addEventListener("click", (event) => {
            const clickedInsideMenu =
                mainNavigation.contains(event.target) ||
                menuButton.contains(event.target);

            if (!clickedInsideMenu) {
                closeMenu();
            }
        });

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
            (contaminant) => contaminant.id === id
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
            return number.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
        }

        if (number < 1) {
            return number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
        }

        if (number < 100) {
            return number.toFixed(1).replace(/\.0$/, "");
        }

        return number.toLocaleString(undefined, {
            maximumFractionDigits: 1
        });
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
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("");
    }

    function convertToPpb(value, unit) {
        const unitData = data.units[unit];

        if (!unitData) {
            return null;
        }

        return value * unitData.toPpb;
    }

    /*
    =====================================================
    RESULT CHECKER
    =====================================================
    */

    const calculatorForm =
        document.getElementById("water-calculator");

    const calculatorContaminant =
        document.getElementById("calculator-contaminant");

    const calculatorValue =
        document.getElementById("calculator-value");

    const calculatorUnit =
        document.getElementById("calculator-unit");

    const calculatorError =
        document.getElementById("calculator-error");

    const calculatorReset =
        document.getElementById("calculator-reset");

    const calculatorEmptyResult =
        document.getElementById("calculator-empty-result");

    const calculatorResultPanel =
        document.getElementById("calculator-result-panel");

    const calculatorStatus =
        document.getElementById("calculator-status");

    const calculatorResultTitle =
        document.getElementById("calculator-result-title");

    const calculatorResultSummary =
        document.getElementById("calculator-result-summary");

    const calculatorResultValue =
        document.getElementById("calculator-result-value");

    const calculatorBenchmarkType =
        document.getElementById("calculator-benchmark-type");

    const calculatorBenchmarkValue =
        document.getElementById("calculator-benchmark-value");

    const calculatorExplanation =
        document.getElementById("calculator-explanation");

    const calculatorNextSteps =
        document.getElementById("calculator-next-steps");

    const calculatorLimitation =
        document.getElementById("calculator-limitation");

    const calculatorSource =
        document.getElementById("calculator-source");

    function populateCalculatorContaminants() {
        if (!calculatorContaminant) {
            return;
        }

        const numericalContaminants = data.contaminants.filter(
            (contaminant) =>
                !contaminant.textResult &&
                contaminant.benchmark.valuePpb !== null
        );

        numericalContaminants.forEach((contaminant) => {
            const option = document.createElement("option");

            option.value = contaminant.id;
            option.textContent = contaminant.name;

            calculatorContaminant.appendChild(option);
        });
    }

    function updateCalculatorUnits() {
        if (!calculatorContaminant || !calculatorUnit) {
            return;
        }

        const contaminant = findContaminant(
            calculatorContaminant.value
        );

        calculatorUnit.innerHTML =
            '<option value="">Choose unit</option>';

        if (!contaminant) {
            calculatorUnit.disabled = true;
            return;
        }

        contaminant.acceptedUnits.forEach((unit) => {
            const unitInformation = data.units[unit];
            const option = document.createElement("option");

            option.value = unit;
            option.textContent = unitInformation
                ? `${unitInformation.label} — ${unitInformation.fullName}`
                : unit;

            calculatorUnit.appendChild(option);
        });

        calculatorUnit.disabled = false;

        if (contaminant.acceptedUnits.length === 1) {
            calculatorUnit.value = contaminant.acceptedUnits[0];
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

    function getResultLevel(valuePpb, benchmarkPpb) {
        const ratio = valuePpb / benchmarkPpb;

        if (ratio > 1) {
            return "above";
        }

        if (ratio >= 0.8) {
            return "near";
        }

        return "below";
    }

    function getResultContent(contaminant, level) {
        if (level === "above") {
            return {
                status: "Above benchmark",
                title: "This result needs attention.",
                summary: contaminant.aboveMessage,
                explanation:
                    `Your result is above the ${contaminant.benchmark.shortType.toLowerCase()} shown for ${contaminant.name}.`,
                stepGroup: contaminant.aboveSteps
            };
        }

        if (level === "near") {
            return {
                status: "Close to benchmark",
                title: "This result is close to the benchmark.",
                summary: contaminant.nearMessage,
                explanation:
                    `Your result is within 20% of the ${contaminant.benchmark.shortType.toLowerCase()}. A second result may help confirm what is happening.`,
                stepGroup: contaminant.nearSteps
            };
        }

        return {
            status: "Below benchmark",
            title: "This result is below the benchmark.",
            summary: contaminant.belowMessage,
            explanation:
                `Your result is below the ${contaminant.benchmark.shortType.toLowerCase()} shown for ${contaminant.name}.`,
            stepGroup: contaminant.belowSteps
        };
    }

    function getWaterSource() {
        const selectedSource = document.querySelector(
            'input[name="waterSource"]:checked'
        );

        return selectedSource ? selectedSource.value : "general";
    }

    function combineNextSteps(stepGroup, waterSource) {
        const generalSteps = stepGroup.general || [];
        const sourceSteps = stepGroup[waterSource] || [];

        return [...sourceSteps, ...generalSteps];
    }

    function displayCalculatorResult(
        contaminant,
        originalValue,
        originalUnit,
        valuePpb
    ) {
        const benchmarkPpb = contaminant.benchmark.valuePpb;
        const level = getResultLevel(valuePpb, benchmarkPpb);
        const content = getResultContent(contaminant, level);
        const waterSource = getWaterSource();

        const nextSteps = combineNextSteps(
            content.stepGroup,
            waterSource
        );

        calculatorStatus.textContent = content.status;
        calculatorStatus.dataset.level = level;

        calculatorResultTitle.textContent = content.title;
        calculatorResultSummary.textContent = content.summary;

        calculatorResultValue.textContent =
            `${formatNumber(originalValue)} ${originalUnit}`;

        calculatorBenchmarkType.textContent =
            contaminant.benchmark.shortType;

        calculatorBenchmarkValue.textContent =
            contaminant.benchmark.displayValue;

        calculatorExplanation.textContent = content.explanation;

        calculatorNextSteps.innerHTML = createList(nextSteps);

        calculatorLimitation.textContent =
            "One result cannot describe every tap or your exposure over time. Sampling method, timing, plumbing, and laboratory instructions can affect the result.";

        calculatorSource.href = contaminant.officialUrl;

        calculatorEmptyResult.hidden = true;
        calculatorResultPanel.hidden = false;
    }

    function resetCalculator() {
        if (!calculatorForm) {
            return;
        }

        calculatorForm.reset();

        calculatorUnit.innerHTML =
            '<option value="">Choose unit</option>';

        calculatorUnit.disabled = true;

        hideCalculatorError();

        calculatorResultPanel.hidden = true;
        calculatorEmptyResult.hidden = false;
    }

    if (calculatorContaminant) {
        calculatorContaminant.addEventListener(
            "change",
            updateCalculatorUnits
        );
    }

    if (calculatorForm) {
        calculatorForm.addEventListener("submit", (event) => {
            event.preventDefault();
            hideCalculatorError();

            const contaminant = findContaminant(
                calculatorContaminant.value
            );

            const enteredValue = Number(calculatorValue.value);
            const enteredUnit = calculatorUnit.value;

            if (!contaminant) {
                showCalculatorError("Choose a contaminant.");
                calculatorContaminant.focus();
                return;
            }

            if (
                calculatorValue.value.trim() === "" ||
                !Number.isFinite(enteredValue) ||
                enteredValue < 0
            ) {
                showCalculatorError("Enter a valid result.");
                calculatorValue.focus();
                return;
            }

            if (!enteredUnit) {
                showCalculatorError("Choose the unit from your report.");
                calculatorUnit.focus();
                return;
            }

            const valuePpb = convertToPpb(
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
        });
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
        document.getElementById("contaminant-search");

    const contaminantList =
        document.getElementById("contaminant-list");

    const contaminantCount =
        document.getElementById("contaminant-count");

    const contaminantDetail =
        document.getElementById("contaminant-detail");

    const contaminantNoResults =
        document.getElementById("contaminant-no-results");

    const contaminantFilterButtons =
        document.querySelectorAll(
            "#contaminant-filters .filter-button"
        );

    let activeContaminantFilter = "all";
    let selectedContaminantId = null;

    function matchesContaminantSearch(contaminant, query) {
        const searchableText = [
            contaminant.name,
            contaminant.description,
            contaminant.source,
            ...contaminant.searchTerms
        ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(query.toLowerCase());
    }

    function getFilteredContaminants() {
        const query = contaminantSearch
            ? contaminantSearch.value.trim()
            : "";

        return data.contaminants.filter((contaminant) => {
            const matchesFilter =
                activeContaminantFilter === "all" ||
                contaminant.category === activeContaminantFilter;

            const matchesSearch =
                query === "" ||
                matchesContaminantSearch(contaminant, query);

            return matchesFilter && matchesSearch;
        });
    }

    function getCategoryLabel(category) {
        const labels = {
            metals: "Metal",
            microbial: "Bacteria",
            chemicals: "Chemical",
            aesthetic: "Taste or appearance"
        };

        return labels[category] || category;
    }

    function renderContaminantList() {
        if (!contaminantList) {
            return;
        }

        const contaminants = getFilteredContaminants();

        contaminantList.innerHTML = "";

        if (contaminantCount) {
            contaminantCount.textContent =
                `${contaminants.length} result${
                    contaminants.length === 1 ? "" : "s"
                }`;
        }

        if (contaminantNoResults) {
            contaminantNoResults.hidden =
                contaminants.length !== 0;
        }

        contaminants.forEach((contaminant) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "contaminant-item";
            button.dataset.contaminantId = contaminant.id;

            if (selectedContaminantId === contaminant.id) {
                button.classList.add("active");
            }

            button.innerHTML = `
                <span>
                    <strong>${escapeHtml(contaminant.name)}</strong>
                    <small>${escapeHtml(
                        getCategoryLabel(contaminant.category)
                    )}</small>
                </span>

                <span aria-hidden="true">→</span>
            `;

            button.addEventListener("click", () => {
                openContaminant(contaminant.id);
            });

            contaminantList.appendChild(button);
        });
    }

    function createTreatmentNames(contaminant) {
        if (
            !contaminant.treatments ||
            contaminant.treatments.length === 0
        ) {
            return "Treatment depends on the cause. Testing should come first.";
        }

        return contaminant.treatments
            .map((treatment) => treatment.name)
            .join(", ");
    }

    function renderContaminantDetail(contaminant) {
        if (!contaminantDetail) {
            return;
        }

        const benchmarkText =
            contaminant.benchmark.displayValue;

        contaminantDetail.innerHTML = `
            <div class="detail-header">
                <p class="eyebrow">
                    ${escapeHtml(
                        getCategoryLabel(contaminant.category)
                    )}
                </p>

                <h2>${escapeHtml(contaminant.name)}</h2>

                <p>${escapeHtml(contaminant.description)}</p>
            </div>

            <div class="detail-section">
                <h3>Benchmark</h3>
                <p>
                    <strong>${escapeHtml(benchmarkText)}</strong>
                    — ${escapeHtml(contaminant.benchmark.type)}
                </p>
            </div>

            <div class="detail-section">
                <h3>Where it comes from</h3>
                <p>${escapeHtml(contaminant.source)}</p>
            </div>

            <div class="detail-section">
                <h3>Why it matters</h3>
                <p>${escapeHtml(contaminant.health)}</p>
            </div>

            <div class="detail-section">
                <h3>Does boiling help?</h3>
                <p>${escapeHtml(contaminant.boiling)}</p>
            </div>

            <div class="detail-section">
                <h3>Treatment to research</h3>
                <p>${escapeHtml(
                    createTreatmentNames(contaminant)
                )}</p>
            </div>

            <a
                class="source-link"
                href="${escapeHtml(contaminant.officialUrl)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Read official guidance
                <span aria-hidden="true">→</span>
            </a>
        `;
    }

    function openContaminant(contaminantId) {
        const contaminant = findContaminant(contaminantId);

        if (!contaminant) {
            return;
        }

        selectedContaminantId = contaminantId;

        showRoute("contaminants");
        renderContaminantList();
        renderContaminantDetail(contaminant);

        if (
            window.innerWidth <= 940 &&
            contaminantDetail
        ) {
            setTimeout(() => {
                contaminantDetail.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 100);
        }
    }

    if (contaminantSearch) {
        contaminantSearch.addEventListener(
            "input",
            renderContaminantList
        );
    }

    contaminantFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeContaminantFilter = button.dataset.filter;

            contaminantFilterButtons.forEach(
                (filterButton) => {
                    filterButton.classList.toggle(
                        "active",
                        filterButton === button
                    );
                }
            );

            renderContaminantList();
        });
    });

    document
        .querySelectorAll("[data-contaminant-open]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const contaminantId =
                    button.dataset.contaminantOpen;

                openContaminant(contaminantId);
            });
        });

    /*
    =====================================================
    TREATMENT FINDER
    =====================================================
    */

    const treatmentForm =
        document.getElementById("treatment-form");

    const treatmentContaminant =
        document.getElementById("treatment-contaminant");

    const treatmentEmpty =
        document.getElementById("treatment-empty");

    const treatmentResults =
        document.getElementById("treatment-results");

    function populateTreatmentContaminants() {
        if (!treatmentContaminant) {
            return;
        }

        data.contaminants
            .filter(
                (contaminant) =>
                    Array.isArray(contaminant.treatments) &&
                    contaminant.treatments.length > 0
            )
            .forEach((contaminant) => {
                const option = document.createElement("option");

                option.value = contaminant.id;
                option.textContent = contaminant.name;

                treatmentContaminant.appendChild(option);
            });
    }

    function getSelectedRadioValue(name) {
        const selected = document.querySelector(
            `input[name="${name}"]:checked`
        );

        return selected ? selected.value : "";
    }

    function rankTreatments(
        treatments,
        selectedLocation,
        selectedBudget
    ) {
        return treatments
            .map((treatment) => {
                let score = 0;

                if (
                    treatment.locations.includes(
                        selectedLocation
                    )
                ) {
                    score += 2;
                }

                if (
                    treatment.budgets.includes(
                        selectedBudget
                    )
                ) {
                    score += 1;
                }

                return {
                    ...treatment,
                    score
                };
            })
            .filter((treatment) => treatment.score > 0)
            .sort((first, second) => second.score - first.score);
    }

    function renderTreatmentResults(
        contaminant,
        treatments,
        selectedLocation
    ) {
        treatmentResults.innerHTML = "";

        if (treatments.length === 0) {
            treatmentResults.innerHTML = `
                <section class="panel empty-result">
                    <span
                        class="empty-result-icon"
                        aria-hidden="true"
                    >
                        ?
                    </span>

                    <h2>No close match</h2>

                    <p>
                        Try another budget or treatment location.
                        A qualified professional can also evaluate
                        options for ${escapeHtml(contaminant.name)}.
                    </p>
                </section>
            `;

            treatmentEmpty.hidden = true;
            treatmentResults.hidden = false;
            return;
        }

        const heading = document.createElement("section");

        heading.className = "panel treatment-card";
        heading.innerHTML = `
            <p class="eyebrow">Suggested research</p>

            <h2>
                Options for ${escapeHtml(contaminant.name)}
            </h2>

            <p>
                These are technologies to compare, not product
                recommendations. Look for a verified contaminant-
                reduction claim.
            </p>
        `;

        treatmentResults.appendChild(heading);

        treatments.forEach((treatment, index) => {
            const card = document.createElement("article");

            card.className = "treatment-card";

            const matchText =
                treatment.locations.includes(selectedLocation)
                    ? "Matches location"
                    : "Alternative setup";

            card.innerHTML = `
                <p class="eyebrow">
                    ${index === 0 ? "Best match" : "Another option"}
                </p>

                <h3>${escapeHtml(treatment.name)}</h3>

                <p>${escapeHtml(treatment.fit)}</p>

                <div class="treatment-meta">
                    <span>${escapeHtml(matchText)}</span>

                    <span>
                        ${escapeHtml(
                            treatment.locations
                                .map((location) =>
                                    location === "point-of-use"
                                        ? "Tap treatment"
                                        : "Whole house"
                                )
                                .join(" / ")
                        )}
                    </span>
                </div>

                <div class="detail-section">
                    <h3>What to look for</h3>
                    <p>${escapeHtml(treatment.certification)}</p>
                </div>

                <div class="detail-section">
                    <h3>Maintenance</h3>
                    <p>${escapeHtml(treatment.maintenance)}</p>
                </div>

                <div class="detail-section">
                    <h3>Keep in mind</h3>
                    <p>${escapeHtml(treatment.limitation)}</p>
                </div>
            `;

            treatmentResults.appendChild(card);
        });

        treatmentEmpty.hidden = true;
        treatmentResults.hidden = false;
    }

    if (treatmentForm) {
        treatmentForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const contaminant = findContaminant(
                treatmentContaminant.value
            );

            if (!contaminant) {
                treatmentContaminant.focus();
                return;
            }

            const selectedLocation =
                getSelectedRadioValue("treatmentLocation");

            const selectedBudget =
                getSelectedRadioValue("budget");

            const matches = rankTreatments(
                contaminant.treatments,
                selectedLocation,
                selectedBudget
            );

            renderTreatmentResults(
                contaminant,
                matches,
                selectedLocation
            );
        });
    }

    /*
    =====================================================
    PRIVATE WELL ASSISTANT
    =====================================================
    */

    const wellGuidance =
        document.getElementById("well-guidance");

    function showWellGuidance(situationId) {
        const guidance = data.wellGuidance[situationId];

        if (!guidance || !wellGuidance) {
            return;
        }

        wellGuidance.innerHTML = `
            <p class="eyebrow">Private well guidance</p>

            <h2>${escapeHtml(guidance.title)}</h2>

            <p>${escapeHtml(guidance.intro)}</p>

            <div class="detail-section">
                <h3>What to do</h3>

                <ul class="result-list">
                    ${createList(guidance.steps)}
                </ul>
            </div>

            <div class="result-note">
                ${escapeHtml(guidance.note)}
            </div>
        `;

        wellGuidance.hidden = false;

        setTimeout(() => {
            wellGuidance.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }

    document
        .querySelectorAll("[data-well-situation]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                showWellGuidance(
                    button.dataset.wellSituation
                );
            });
        });

    /*
    =====================================================
    WATER ADVISORIES
    =====================================================
    */

    const emergencyGuidance =
        document.getElementById("emergency-guidance");

    function showEmergencyGuidance(advisoryId) {
        const guidance =
            data.emergencyGuidance[advisoryId];

        if (!guidance || !emergencyGuidance) {
            return;
        }

        showRoute("emergency");

        emergencyGuidance.innerHTML = `
            <p class="eyebrow">What to do now</p>

            <h2>${escapeHtml(guidance.title)}</h2>

            <p>${escapeHtml(guidance.intro)}</p>

            <div class="detail-section">
                <h3>Steps</h3>

                <ul class="result-list">
                    ${createList(guidance.steps)}
                </ul>
            </div>

            <div class="result-note">
                <strong>Important:</strong>
                ${escapeHtml(guidance.avoid)}
            </div>

            <a
                class="source-link"
                href="${escapeHtml(guidance.sourceUrl)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Read official guidance
                <span aria-hidden="true">→</span>
            </a>
        `;

        emergencyGuidance.hidden = false;

        setTimeout(() => {
            emergencyGuidance.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }

    document
        .querySelectorAll("[data-emergency]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                showEmergencyGuidance(
                    button.dataset.emergency
                );
            });
        });

    document
        .querySelectorAll("[data-emergency-open]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                showEmergencyGuidance(
                    button.dataset.emergencyOpen
                );
            });
        });

    /*
    =====================================================
    INITIALIZE
    =====================================================
    */

    populateCalculatorContaminants();
    populateTreatmentContaminants();
    renderContaminantList();

    showRoute(getRouteFromHash(), false);
});
