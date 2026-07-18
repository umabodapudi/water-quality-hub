"use strict";

/*
=========================================================
WATER QUALITY HUB DATA

This file contains the website content.

You can add or edit contaminants here without changing
the HTML or the main app.js file.
=========================================================
*/

window.WATER_HUB_DATA = {
    /*
    =====================================================
    UNIT SETTINGS
    =====================================================
    */

    units: {
        ppt: {
            label: "ppt",
            fullName: "parts per trillion",
            toPpb: 0.001
        },

        ppb: {
            label: "ppb",
            fullName: "parts per billion",
            toPpb: 1
        },

        "µg/L": {
            label: "µg/L",
            fullName: "micrograms per liter",
            toPpb: 1
        },

        "ug/L": {
            label: "ug/L",
            fullName: "micrograms per liter",
            toPpb: 1
        },

        ppm: {
            label: "ppm",
            fullName: "parts per million",
            toPpb: 1000
        },

        "mg/L": {
            label: "mg/L",
            fullName: "milligrams per liter",
            toPpb: 1000
        }
    },

    /*
    =====================================================
    CONTAMINANTS
    =====================================================
    */

    contaminants: [
        {
            id: "arsenic",
            name: "Arsenic",
            shortName: "Arsenic",
            category: "metals",

            searchTerms: [
                "arsenic",
                "metal",
                "groundwater",
                "well",
                "natural",
                "cancer"
            ],

            description:
                "Arsenic can occur naturally in rocks and groundwater. It is more common in some private wells and groundwater systems.",

            benchmark: {
                valuePpb: 10,
                displayValue: "10 ppb",
                type: "Maximum Contaminant Level",
                shortType: "EPA limit"
            },

            acceptedUnits: [
                "ppb",
                "µg/L",
                "mg/L",
                "ppm"
            ],

            source:
                "Naturally occurring minerals, groundwater, and some industrial or agricultural activities.",

            health:
                "Long-term exposure to elevated arsenic can increase the risk of skin, cardiovascular, developmental, and certain cancer-related health effects.",

            sensitiveGroups:
                "Pregnant people, infants, children, and people who drink the water for many years may have greater concern.",

            boiling:
                "No. Boiling does not remove arsenic and may slightly concentrate it as water evaporates.",

            belowMessage:
                "This result is below the federal public drinking-water limit for arsenic.",

            nearMessage:
                "This result is close to the federal limit. Consider confirming the result, especially for a private well.",

            aboveMessage:
                "This result is above the federal public drinking-water limit for arsenic.",

            belowSteps: {
                public: [
                    "Review your water provider’s report for long-term results.",
                    "Follow any instructions from your water provider."
                ],

                private: [
                    "Keep the laboratory report with your well records.",
                    "Continue testing on the schedule recommended by your state or local health department."
                ],

                general: [
                    "Confirm that the result and unit were entered correctly."
                ]
            },

            nearSteps: {
                public: [
                    "Check whether your water provider reports similar results over time.",
                    "Contact the water provider if you have questions about treatment or monitoring."
                ],

                private: [
                    "Consider collecting a confirmation sample through a certified laboratory.",
                    "Use another drinking-water source while investigating if advised by a health professional or local agency.",
                    "Discuss treatment with a qualified water-treatment professional."
                ],

                general: [
                    "Do not rely on boiling to reduce arsenic."
                ]
            },

            aboveSteps: {
                public: [
                    "Check for notices or instructions from your water provider.",
                    "Contact the provider or local health department for the latest information."
                ],

                private: [
                    "Use bottled water or another appropriate source for drinking and cooking while confirming the result.",
                    "Arrange confirmation testing through a certified laboratory.",
                    "Ask a qualified professional about an arsenic-certified treatment system."
                ],

                general: [
                    "Do not boil the water to remove arsenic."
                ]
            },

            treatments: [
                {
                    id: "arsenic-ro",
                    name: "Reverse osmosis",
                    fit: "Strong option for one drinking-water tap",
                    locations: ["point-of-use"],
                    budgets: ["medium", "high"],
                    certification: "Look for arsenic-reduction claims under NSF/ANSI 58.",
                    maintenance:
                        "Replace filters and membranes according to the manufacturer’s schedule.",
                    limitation:
                        "Effectiveness can depend on the form of arsenic and the water chemistry."
                },

                {
                    id: "arsenic-adsorption",
                    name: "Adsorptive media",
                    fit: "Possible whole-house or point-of-entry option",
                    locations: ["whole-house", "point-of-use"],
                    budgets: ["high"],
                    certification:
                        "Choose a system specifically tested for arsenic reduction.",
                    maintenance:
                        "Media must be replaced before it becomes exhausted.",
                    limitation:
                        "Performance depends on pH and competing minerals."
                }
            ],

            officialUrl:
                "https://www.epa.gov/dwreginfo/chemical-contaminant-rules"
        },

        {
            id: "lead",
            name: "Lead",
            shortName: "Lead",
            category: "metals",

            searchTerms: [
                "lead",
                "pipes",
                "plumbing",
                "faucet",
                "solder",
                "brass",
                "old home"
            ],

            description:
                "Lead usually enters drinking water from plumbing materials rather than from the original water source.",

            benchmark: {
                valuePpb: 15,
                displayValue: "15 ppb",
                type: "Public-system action level",
                shortType: "Action level"
            },

            acceptedUnits: [
                "ppb",
                "µg/L",
                "mg/L",
                "ppm"
            ],

            source:
                "Lead service lines, older plumbing, solder, brass fixtures, and corrosion inside buildings.",

            health:
                "Lead can affect the brain, nervous system, kidneys, and blood. Children and developing fetuses are especially vulnerable.",

            sensitiveGroups:
                "Infants, children, and pregnant people are the most sensitive groups.",

            boiling:
                "No. Boiling does not remove lead and may concentrate it.",

            belowMessage:
                "This result is below the public-system lead action level, but lower lead exposure is still better.",

            nearMessage:
                "This result is close to the public-system action level. Because lead can vary by faucet and sampling method, more testing may help.",

            aboveMessage:
                "This result is above the public-system lead action level used for regulatory decisions.",

            belowSteps: {
                public: [
                    "Use cold tap water for drinking and cooking.",
                    "Flush water that has been sitting in the plumbing.",
                    "Clean faucet aerators regularly."
                ],

                private: [
                    "Consider testing more than one faucet if the home has older plumbing.",
                    "Use cold water for drinking and cooking."
                ],

                general: [
                    "Do not use hot tap water for infant formula or cooking.",
                    "Do not boil water to remove lead."
                ]
            },

            nearSteps: {
                public: [
                    "Review your utility’s lead-service-line and corrosion-control information.",
                    "Consider a follow-up sample using laboratory instructions.",
                    "Use a filter certified for lead reduction while investigating."
                ],

                private: [
                    "Retest the affected faucet and consider testing other taps.",
                    "Have older plumbing and fixtures evaluated."
                ],

                general: [
                    "Use only cold flushed water for drinking and cooking.",
                    "Do not boil water to remove lead."
                ]
            },

            aboveSteps: {
                public: [
                    "Follow instructions from your water provider or health department.",
                    "Use bottled water or a properly certified lead-reduction filter while investigating.",
                    "Ask whether the property may have a lead service line."
                ],

                private: [
                    "Use another drinking-water source or a certified lead-reduction filter.",
                    "Arrange confirmation testing.",
                    "Have the plumbing evaluated for lead-containing materials."
                ],

                general: [
                    "Do not boil the water to remove lead.",
                    "Speak with a healthcare professional if you are concerned about exposure, especially for a child or pregnancy."
                ]
            },

            treatments: [
                {
                    id: "lead-carbon",
                    name: "Certified carbon filter",
                    fit: "Practical option for a kitchen faucet or pitcher",
                    locations: ["point-of-use"],
                    budgets: ["low", "medium"],
                    certification:
                        "Look for a product certified for lead reduction under NSF/ANSI 53.",
                    maintenance:
                        "Replace cartridges on time. An overdue filter may not perform as expected.",
                    limitation:
                        "Only treated water from that device is covered."
                },

                {
                    id: "lead-ro",
                    name: "Reverse osmosis",
                    fit: "Strong option for drinking and cooking water",
                    locations: ["point-of-use"],
                    budgets: ["medium", "high"],
                    certification:
                        "Look for a certified lead-reduction claim.",
                    maintenance:
                        "Replace prefilters and the membrane as directed.",
                    limitation:
                        "Does not correct the plumbing source itself."
                }
            ],

            officialUrl:
                "https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water"
        },

        {
            id: "copper",
            name: "Copper",
            shortName: "Copper",
            category: "metals",

            searchTerms: [
                "copper",
                "blue green stain",
                "metallic taste",
                "pipes",
                "plumbing",
                "corrosion"
            ],

            description:
                "Copper commonly enters water when household plumbing corrodes.",

            benchmark: {
                valuePpb: 1300,
                displayValue: "1.3 mg/L",
                type: "Public-system action level",
                shortType: "Action level"
            },

            acceptedUnits: [
                "ppb",
                "µg/L",
                "mg/L",
                "ppm"
            ],

            source:
                "Copper plumbing, corrosion, acidic water, and water that remains in pipes for long periods.",

            health:
                "High short-term exposure may cause stomach upset. Long-term high exposure may affect the liver or kidneys in susceptible people.",

            sensitiveGroups:
                "People with certain copper-metabolism disorders may be more sensitive.",

            boiling:
                "No. Boiling does not remove copper.",

            belowMessage:
                "This result is below the public-system copper action level.",

            nearMessage:
                "This result is close to the copper action level. Plumbing conditions and sample timing can affect the result.",

            aboveMessage:
                "This result is above the public-system copper action level.",

            belowSteps: {
                public: [
                    "Use cold water for drinking and cooking.",
                    "Flush water that has been sitting in plumbing."
                ],

                private: [
                    "Watch for blue-green staining or a metallic taste.",
                    "Consider checking the water’s pH and corrosivity."
                ],

                general: [
                    "Confirm the unit shown on the laboratory report."
                ]
            },

            nearSteps: {
                public: [
                    "Ask the water provider about corrosion control.",
                    "Consider repeat sampling."
                ],

                private: [
                    "Test pH and other corrosion-related water characteristics.",
                    "Have the plumbing inspected if staining continues."
                ],

                general: [
                    "Use cold flushed water for drinking and cooking."
                ]
            },

            aboveSteps: {
                public: [
                    "Contact your water provider for guidance.",
                    "Use another drinking-water source if advised."
                ],

                private: [
                    "Arrange confirmation testing.",
                    "Have the plumbing and water chemistry evaluated."
                ],

                general: [
                    "Do not rely on boiling to reduce copper."
                ]
            },

            treatments: [
                {
                    id: "copper-corrosion",
                    name: "Corrosion control",
                    fit: "Addresses the cause rather than only filtering water",
                    locations: ["whole-house"],
                    budgets: ["high"],
                    certification:
                        "Work with a qualified water professional.",
                    maintenance:
                        "The system may require chemical adjustment and regular monitoring.",
                    limitation:
                        "The correct treatment depends on pH, alkalinity, and plumbing."
                },

                {
                    id: "copper-ro",
                    name: "Reverse osmosis",
                    fit: "Possible option for drinking water",
                    locations: ["point-of-use"],
                    budgets: ["medium", "high"],
                    certification:
                        "Select a system with a verified copper-reduction claim.",
                    maintenance:
                        "Replace filters and membranes as directed.",
                    limitation:
                        "Does not stop corrosion elsewhere in the home."
                }
            ],

            officialUrl:
                "https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations"
        },

        {
            id: "nitrate",
            name: "Nitrate",
            shortName: "Nitrate",
            category: "chemicals",

            searchTerms: [
                "nitrate",
                "fertilizer",
                "septic",
                "farm",
                "agriculture",
                "infant",
                "blue baby"
            ],

            description:
                "Nitrate can enter groundwater from fertilizer, manure, septic systems, and natural sources.",

            benchmark: {
                valuePpb: 10000,
                displayValue: "10 mg/L",
                type: "Maximum Contaminant Level",
                shortType: "EPA limit"
            },

            acceptedUnits: [
                "ppb",
                "µg/L",
                "mg/L",
                "ppm"
            ],

            source:
                "Fertilizer, manure, septic systems, wastewater, and natural soil processes.",

            health:
                "High nitrate exposure can interfere with the blood’s ability to carry oxygen, especially in young infants.",

            sensitiveGroups:
                "Infants younger than six months and pregnant people require particular care.",

            boiling:
                "No. Boiling does not remove nitrate and can increase its concentration.",

            belowMessage:
                "This result is below the federal public drinking-water limit for nitrate.",

            nearMessage:
                "This result is close to the nitrate limit. Private wells may change with seasons, rainfall, or nearby land use.",

            aboveMessage:
                "This result is above the federal public drinking-water limit for nitrate.",

            belowSteps: {
                public: [
                    "Review the water provider’s annual report.",
                    "Follow any instructions from the provider."
                ],

                private: [
                    "Continue routine testing.",
                    "Retest after flooding, well damage, or major nearby land-use changes."
                ],

                general: [
                    "Confirm whether the laboratory reported nitrate as nitrate or nitrate-nitrogen."
                ]
            },

            nearSteps: {
                public: [
                    "Contact the water provider if the result came from your tap.",
                    "Check for current notices."
                ],

                private: [
                    "Arrange a confirmation test.",
                    "Test more frequently if the well is shallow or near septic or agricultural activity."
                ],

                general: [
                    "Do not boil water to reduce nitrate.",
                    "Use another water source for infant formula until the result is clarified."
                ]
            },

            aboveSteps: {
                public: [
                    "Follow instructions from your water provider or health department.",
                    "Use bottled water or another approved source for drinking and cooking."
                ],

                private: [
                    "Do not use the water for preparing infant formula.",
                    "Use another drinking-water source while confirming the result.",
                    "Have the well and nearby contamination sources evaluated."
                ],

                general: [
                    "Do not boil the water to remove nitrate."
                ]
            },

            treatments: [
                {
                    id: "nitrate-ro",
                    name: "Reverse osmosis",
                    fit: "Common option for drinking and cooking water",
                    locations: ["point-of-use"],
                    budgets: ["medium", "high"],
                    certification:
                        "Choose a system with a verified nitrate-reduction claim.",
                    maintenance:
                        "Replace filters and membranes on schedule.",
                    limitation:
                        "Regular testing is still needed to confirm performance."
                },

                {
                    id: "nitrate-ion",
                    name: "Anion exchange",
                    fit: "Possible whole-house treatment",
                    locations: ["whole-house"],
                    budgets: ["high"],
                    certification:
                        "System design should be based on a complete water analysis.",
                    maintenance:
                        "Requires regeneration, salt, and professional maintenance.",
                    limitation:
                        "Improper setup can affect water chemistry."
                }
            ],

            officialUrl:
                "https://www.epa.gov/dwreginfo/chemical-contaminant-rules"
        },

        {
            id: "nitrite",
            name: "Nitrite",
            shortName: "Nitrite",
            category: "chemicals",

            searchTerms: [
                "nitrite",
                "fertilizer",
                "septic",
                "infant",
                "blue baby"
            ],

            description:
                "Nitrite is related to nitrate and can appear when nitrogen compounds change in soil, water, or plumbing systems.",

            benchmark: {
                valuePpb: 1000,
                displayValue: "1 mg/L",
                type: "Maximum Contaminant Level",
                shortType: "EPA limit"
            },

            acceptedUnits: [
                "ppb",
                "µg/L",
                "mg/L",
                "ppm"
            ],

            source:
                "Fertilizer, sewage, septic systems, and natural nitrogen processes.",

            health:
                "High nitrite can reduce the blood’s ability to carry oxygen.",

            sensitiveGroups:
                "Young infants are the most sensitive group.",

            boiling:
                "No. Boiling does not reliably remove nitrite.",

            belowMessage:
                "This result is below the federal public drinking-water limit for nitrite.",

            nearMessage:
                "This result is close to the nitrite limit and should be confirmed.",

            aboveMessage:
                "This result is above the federal public drinking-water limit for nitrite.",

            belowSteps: {
                public: [
                    "Review any information from your water provider."
                ],

                private: [
                    "Continue routine well testing."
                ],

                general: [
                    "Confirm whether the report lists nitrite or nitrite-nitrogen."
                ]
            },

            nearSteps: {
                public: [
                    "Contact your water provider."
                ],

                private: [
                    "Arrange confirmation testing promptly."
                ],

                general: [
                    "Use another source for infant formula until the result is clarified."
                ]
            },

            aboveSteps: {
                public: [
                    "Follow the water provider’s instructions.",
                    "Use another approved drinking-water source."
                ],

                private: [
                    "Do not prepare infant formula with the water.",
                    "Use another drinking-water source.",
                    "Arrange immediate confirmation testing."
                ],

                general: [
                    "Do not boil the water to remove nitrite."
                ]
            },

            treatments: [
                {
                    id: "nitrite-ro",
                    name: "Reverse osmosis",
                    fit: "Possible point-of-use option",
                    locations: ["point-of-use"],
                    budgets: ["medium", "high"],
                    certification:
                        "Choose a system with an appropriate verified reduction claim.",
                    maintenance:
                        "Maintain and test the system regularly.",
                    limitation:
                        "Source correction may still be necessary."
                }
            ],

            officialUrl:
                "https://www.epa.gov/dwreginfo/chemical-contaminant-rules"
        },

        {
            id: "fluoride",
            name: "Fluoride",
            shortName: "Fluoride",
            category: "chemicals",

            searchTerms: [
                "fluoride",
                "teeth",
                "dental",
                "staining",
                "mottling"
            ],

            description:
                "Fluoride may occur naturally or be added by some public water systems to support dental health.",

            benchmark: {
                valuePpb: 4000,
                displayValue: "4 mg/L",
                type: "Maximum Contaminant Level",
                shortType: "EPA limit"
            },

            acceptedUnits: [
                "ppb",
                "µg/L",
                "mg/L",
                "ppm"
            ],

            source:
                "Natural minerals and controlled fluoridation by some public water systems.",

            health:
                "Very high long-term exposure can affect bones. Elevated exposure during tooth development may cause dental fluorosis.",

            sensitiveGroups:
                "Children whose permanent teeth are developing may be more sensitive to excess fluoride.",

            boiling:
                "No. Boiling does not remove fluoride.",

            belowMessage:
                "This result is below the federal public drinking-water limit for fluoride.",

            nearMessage:
                "This result is close to the federal fluoride limit.",

            aboveMessage:
                "This result is above the federal public drinking-water limit for fluoride.",

            belowSteps: {
                public: [
                    "Review your water provider’s reported fluoride level."
                ],

                private: [
                    "Continue testing if fluoride occurs naturally in the area."
                ],

                general: [
                    "Discuss children’s fluoride exposure with a dentist or pediatric healthcare professional when needed."
                ]
            },

            nearSteps: {
                public: [
                    "Contact your water provider for current results."
                ],

                private: [
                    "Arrange confirmation testing."
                ],

                general: [
                    "Do not rely on boiling to reduce fluoride."
                ]
            },

            aboveSteps: {
                public: [
                    "Follow instructions from your water provider."
                ],

                private: [
                    "Use another drinking-water source while confirming the result.",
                    "Discuss treatment with a qualified professional."
                ],

                general: [
                    "Do not boil the water to remove fluoride."
                ]
            },

            treatments: [
                {
                    id: "fluoride-ro",
                    name: "Reverse osmosis",
                    fit: "Possible option for drinking water",
                    locations: ["point-of-use"],
                    budgets: ["medium", "high"],
                    certification:
                        "Choose a product with a verified fluoride-reduction claim.",
                    maintenance:
                        "Replace filters and membranes as directed.",
                    limitation:
                        "Not every basic carbon filter removes fluoride."
                },

                {
                    id: "fluoride-alumina",
                    name: "Activated alumina",
                    fit: "Possible specialized treatment",
                    locations: ["point-of-use", "whole-house"],
                    budgets: ["high"],
                    certification:
                        "Professional design and testing are recommended.",
                    maintenance:
                        "Media requires replacement or regeneration.",
                    limitation:
                        "Effectiveness depends strongly on water chemistry."
                }
            ],

            officialUrl:
                "https://www.epa.gov/sdwa/secondary-drinking-water-standards-guidance-nuisance-chemicals"
        },

        {
            id: "pfoa",
            name: "PFOA",
            shortName: "PFOA",
            category: "chemicals",

            searchTerms: [
                "pfoa",
                "pfas",
                "forever chemicals",
                "nonstick",
                "firefighting foam"
            ],

            description:
                "PFOA is one of a large group of long-lasting chemicals commonly called PFAS.",

            benchmark: {
                valuePpb: 0.004,
                displayValue: "4 ppt",
                type: "Maximum Contaminant Level",
                shortType: "EPA limit"
            },

            acceptedUnits: [
                "ppt",
                "ppb",
                "µg/L"
            ],

            source:
                "Industrial products, stain-resistant materials, firefighting foam, and contaminated soil or groundwater.",

            health:
                "Research has linked long-term PFAS exposure with effects involving cholesterol, immune response, development, and certain cancers.",

            sensitiveGroups:
                "Pregnant people, infants, and children may be more sensitive to long-term exposure.",

            boiling:
                "No. Boiling does not remove PFOA and may concentrate it.",

            belowMessage:
                "This result is below the federal PFOA drinking-water limit.",

            nearMessage:
                "This result is close to the federal PFOA limit.",

            aboveMessage:
                "This result is above the federal PFOA drinking-water limit.",

            belowSteps: {
                public: [
                    "Review your utility’s PFAS monitoring information."
                ],

                private: [
                    "Keep the result and continue testing if PFAS is a local concern."
                ],

                general: [
                    "Confirm that the laboratory unit is ppt."
                ]
            },

            nearSteps: {
                public: [
                    "Contact the water provider for current monitoring information."
                ],

                private: [
                    "Arrange confirmation testing through a laboratory experienced with PFAS."
                ],

                general: [
                    "Do not boil the water to reduce PFAS."
                ]
            },

            aboveSteps: {
                public: [
                    "Follow instructions from your water provider or health department.",
                    "Consider another drinking-water source or certified treatment while the issue is addressed."
                ],

                private: [
                    "Arrange confirmation testing.",
                    "Use another drinking-water source while evaluating treatment."
                ],

                general: [
                    "Do not boil the water to remove PFOA."
                ]
            },

            treatments: [
                {
                    id: "pfoa-carbon",
                    name: "Activated carbon",
                    fit: "Common PFAS-reduction option",
                    locations: ["point-of-use", "whole-house"],
                    budgets: ["low", "medium", "high"],
                    certification:
                        "Look for a product with a specific PFAS or PFOA reduction claim.",
                    maintenance:
                        "Replace media or cartridges before breakthrough occurs.",
                    limitation:
                        "Performance differs among PFAS compounds and products."
                },

                {
                    id: "pfoa-ro",
                    name: "Reverse osmosis",
                    fit: "Strong option for drinking and cooking water",
                    locations: ["point-of-use"],
                    budgets: ["medium", "high"],
                    certification:
                        "Look for a verified PFOA/PFAS reduction claim.",
                    maintenance:
                        "Replace filters and membranes on schedule.",
                    limitation:
                        "Only treated taps receive the reduced water."
                }
            ],

            officialUrl:
                "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas"
        },

        {
            id: "pfos",
            name: "PFOS",
            shortName: "PFOS",
            category: "chemicals",

            searchTerms: [
                "pfos",
                "pfas",
                "forever chemicals",
                "firefighting foam"
            ],

            description:
                "PFOS is a persistent PFAS chemical that can remain in the environment and the human body for long periods.",

            benchmark: {
                valuePpb: 0.004,
                displayValue: "4 ppt",
                type: "Maximum Contaminant Level",
                shortType: "EPA limit"
            },

            acceptedUnits: [
                "ppt",
                "ppb",
                "µg/L"
            ],

            source:
                "Firefighting foam, industrial uses, consumer products, contaminated soil, and groundwater.",

            health:
                "Long-term exposure has been associated with immune, developmental, cholesterol, and other health effects.",

            sensitiveGroups:
                "Pregnant people, infants, and children may be more sensitive to long-term exposure.",

            boiling:
                "No. Boiling does not remove PFOS.",

            belowMessage:
                "This result is below the federal PFOS drinking-water limit.",

            nearMessage:
                "This result is close to the federal PFOS limit.",

            aboveMessage:
                "This result is above the federal PFOS drinking-water limit.",

            belowSteps: {
                public: [
                    "Review your water provider’s PFAS monitoring results."
                ],

                private: [
                    "Keep the laboratory result and continue monitoring if PFAS is a local concern."
                ],

                general: [
                    "Check that the result is reported in ppt."
                ]
            },

            nearSteps: {
                public: [
                    "Contact the water provider for more information."
                ],

                private: [
                    "Arrange confirmation testing."
                ],

                general: [
                    "Do not boil the water to reduce PFOS."
                ]
            },

            aboveSteps: {
                public: [
                    "Follow instructions from your water provider.",
                    "Consider another drinking-water source or certified treatment."
                ],

                private: [
                    "Use another source for drinking and cooking while confirming the result.",
                    "Discuss treatment with a qualified professional."
                ],

                general: [
                    "Do not boil the water to remove PFOS."
                ]
            },

            treatments: [
                {
                    id: "pfos-carbon",
                    name: "Activated carbon",
                    fit: "Common PFAS-reduction option",
                    locations: ["point-of-use", "whole-house"],
                    budgets: ["low", "medium", "high"],
                    certification:
                        "Look for a verified PFOS or PFAS reduction claim.",
                    maintenance:
                        "Replace cartridges or media on schedule.",
                    limitation:
                        "Actual performance varies by product and water chemistry."
                },

                {
                    id: "pfos-ro",
                    name: "Reverse osmosis",
                    fit: "Strong option for a drinking-water tap",
                    locations: ["point-of-use"],
                    budgets: ["medium", "high"],
                    certification:
                        "Select a system with a verified PFAS reduction claim.",
                    maintenance:
                        "Follow the manufacturer’s replacement schedule.",
                    limitation:
                        "Does not treat untreated faucets."
                }
            ],

            officialUrl:
                "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas"
        },

        {
            id: "e-coli",
            name: "E. coli",
            shortName: "E. coli",
            category: "microbial",

            searchTerms: [
                "e coli",
                "ecoli",
                "bacteria",
                "fecal",
                "sewage",
                "well bacteria"
            ],

            description:
                "E. coli in drinking water can indicate recent fecal contamination and the possible presence of disease-causing organisms.",

            benchmark: {
                valuePpb: null,
                displayValue: "Not detected",
                type: "Expected result",
                shortType: "Expected result"
            },

            acceptedUnits: [],

            source:
                "Sewage, animal waste, flooding, damaged wells, cross-connections, and failures in treatment or distribution.",

            health:
                "Some strains can cause severe stomach illness. The result can also signal that other harmful organisms may be present.",

            sensitiveGroups:
                "Infants, older adults, pregnant people, and people with weakened immune systems may become more seriously ill.",

            boiling:
                "Boiling can kill germs, but follow the exact advisory or health-department instructions.",

            textResult: true,

            officialUrl:
                "https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html"
        },

        {
            id: "taste-smell",
            name: "Taste, odor, or color",
            shortName: "Taste or appearance",
            category: "aesthetic",

            searchTerms: [
                "taste",
                "smell",
                "odor",
                "color",
                "cloudy",
                "brown",
                "yellow",
                "rotten egg",
                "metallic",
                "stain"
            ],

            description:
                "A change in taste, smell, or appearance may come from plumbing, minerals, treatment changes, or contamination.",

            benchmark: {
                valuePpb: null,
                displayValue: "No single limit",
                type: "Water-quality concern",
                shortType: "Varies"
            },

            acceptedUnits: [],

            source:
                "Minerals, sediment, plumbing corrosion, algae, disinfectants, sulfur compounds, construction, or changes in the water source.",

            health:
                "Many taste and appearance problems are not immediate health threats, but a sudden unexplained change should not be ignored.",

            sensitiveGroups:
                "Anyone who becomes ill after drinking the water should contact a healthcare professional.",

            boiling:
                "It depends on the cause. Boiling can make some chemical or mineral problems worse.",

            textResult: true,

            officialUrl:
                "https://www.epa.gov/sdwa/secondary-drinking-water-standards-guidance-nuisance-chemicals"
        }
    ],

    /*
    =====================================================
    PRIVATE WELL GUIDANCE
    =====================================================
    */

    wellGuidance: {
        routine: {
            title: "Plan routine well testing",
            intro:
                "A regular testing schedule helps you notice changes before they become larger problems.",

            steps: [
                "Test at least for bacteria and nitrate based on local recommendations.",
                "Ask your local health department which naturally occurring contaminants are common nearby.",
                "Use a certified laboratory.",
                "Keep results together so you can compare changes over time.",
                "Inspect the wellhead and surrounding area regularly."
            ],

            note:
                "Testing needs vary by location, well depth, nearby land use, household members, and previous results."
        },

        flood: {
            title: "Treat a flooded well as unsafe",
            intro:
                "Floodwater can carry sewage, fuel, chemicals, and other contamination into a well.",

            steps: [
                "Do not drink the water until the well has been inspected, disinfected, and tested.",
                "Use bottled water or another approved source.",
                "Keep people away from damaged electrical equipment near the well.",
                "Contact a licensed well professional if the well was submerged or damaged.",
                "Test after disinfection and wait for acceptable results before returning to normal use."
            ],

            note:
                "Boiling may kill germs, but it does not remove fuel, pesticides, metals, or other chemicals that floodwater may carry."
        },

        bacteria: {
            title: "Bacteria was detected",
            intro:
                "A positive bacteria result may point to contamination, a damaged well, or a sampling problem.",

            steps: [
                "Use boiled or bottled water as directed by your health department.",
                "Confirm whether the result was total coliform or E. coli.",
                "Inspect the well cap, casing, drainage, and nearby septic system.",
                "Disinfect the well only with appropriate guidance.",
                "Retest after the required waiting and flushing period."
            ],

            note:
                "A negative follow-up sample is important before assuming the problem is resolved."
        },

        taste: {
            title: "Your water changed",
            intro:
                "A new smell, color, taste, or cloudiness can provide a useful clue, but it cannot identify the cause by itself.",

            steps: [
                "Stop using the water if the change is sudden, strong, or accompanied by illness.",
                "Check whether the issue affects hot water, cold water, or both.",
                "Ask whether nearby construction, flooding, or well work recently occurred.",
                "Inspect plumbing fixtures and the well area.",
                "Choose laboratory tests based on the specific change."
            ],

            note:
                "Do not assume that clear water is safe or that discolored water is always dangerous. Testing is the best way to identify the cause."
        },

        repair: {
            title: "The well was repaired",
            intro:
                "Repairs can temporarily introduce bacteria, sediment, or debris into the well and plumbing.",

            steps: [
                "Follow the well professional’s flushing and disinfection instructions.",
                "Avoid drinking the water until required testing is complete.",
                "Test for bacteria after the recommended waiting period.",
                "Check that the well cap and casing are properly sealed.",
                "Keep repair and laboratory records."
            ],

            note:
                "The correct disinfection and testing steps depend on the type of repair."
        },

        property: {
            title: "Buying a home with a well",
            intro:
                "A general home inspection usually does not replace a detailed well inspection and water test.",

            steps: [
                "Ask for the well log, repair history, and previous laboratory results.",
                "Confirm the well location, depth, age, and construction.",
                "Inspect the wellhead and distance from septic systems or other hazards.",
                "Test for bacteria, nitrate, and locally important contaminants.",
                "Check flow, pressure, storage, and treatment equipment."
            ],

            note:
                "Testing should be completed early enough to review the results before the purchase is final."
        }
    },

    /*
    =====================================================
    WATER ADVISORY GUIDANCE
    =====================================================
    */

    emergencyGuidance: {
        "boil-water": {
            title: "Boil-water advisory",
            intro:
                "Use boiled or bottled water for drinking, cooking, brushing teeth, making ice, and preparing infant formula.",

            steps: [
                "Bring clear water to a rolling boil for one minute unless local instructions say otherwise.",
                "Let the water cool before using it.",
                "Use bottled or boiled water for food preparation and washing produce.",
                "Discard ice made with untreated tap water.",
                "Follow the utility’s instructions when the advisory ends."
            ],

            avoid:
                "Boiling kills many germs, but it does not remove chemicals, metals, or toxins.",

            sourceUrl:
                "https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html"
        },

        "do-not-drink": {
            title: "Do-not-drink advisory",
            intro:
                "Do not drink the tap water or use it for cooking. Boiling may not make it safe.",

            steps: [
                "Use commercially bottled water or the source named by local officials.",
                "Do not prepare infant formula, beverages, food, or ice with tap water.",
                "Check the notice before using water for bathing, dishes, pets, or laundry.",
                "Follow updates from the water provider or health department."
            ],

            avoid:
                "Do not boil the water unless officials specifically tell you to. Boiling may concentrate some chemicals.",

            sourceUrl:
                "https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html"
        },

        "do-not-use": {
            title: "Do-not-use advisory",
            intro:
                "Avoid contact with tap water until officials say it is safe.",

            steps: [
                "Do not drink, cook, bathe, brush teeth, wash dishes, or clean with tap water.",
                "Use the alternative water source identified by local officials.",
                "Keep children and pets away from affected water.",
                "Follow emergency updates closely."
            ],

            avoid:
                "Do not assume boiling or a household filter will make the water safe.",

            sourceUrl:
                "https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html"
        },

        "pressure-loss": {
            title: "Loss of water pressure",
            intro:
                "Low or lost pressure can allow contamination to enter damaged or leaking water lines.",

            steps: [
                "Check whether your utility issued a boil-water advisory.",
                "Avoid drinking discolored or unusually cloudy water.",
                "When service returns, follow the utility’s flushing instructions.",
                "Discard old ice if an advisory was issued."
            ],

            avoid:
                "Do not assume restored pressure means every advisory has ended.",

            sourceUrl:
                "https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html"
        },

        flood: {
            title: "Flooding or storm damage",
            intro:
                "Floodwater may contaminate private wells and damage public-water infrastructure.",

            steps: [
                "Follow all local emergency notices.",
                "Do not drink from a flooded private well.",
                "Avoid contact with floodwater.",
                "Have a damaged well inspected and disinfected.",
                "Test the well before returning to normal use."
            ],

            avoid:
                "Do not rely on appearance, taste, smell, or boiling alone to determine whether flood-affected water is safe.",

            sourceUrl:
                "https://www.cdc.gov/water-emergency/about/index.html"
        },

        unknown: {
            title: "Check the exact wording",
            intro:
                "Boil-water, do-not-drink, and do-not-use advisories require different actions.",

            steps: [
                "Read the complete notice rather than relying on a social-media summary.",
                "Check the water provider or local health department website.",
                "Confirm which addresses and water uses are affected.",
                "Use bottled water until the instructions are clear."
            ],

            avoid:
                "Do not assume that boiling is appropriate for every advisory.",

            sourceUrl:
                "https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html"
        }
    }
};
