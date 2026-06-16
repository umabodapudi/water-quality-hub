window.calculatorRules = {
    "E. coli": {
        "unit": "CFU/100mL",
        "mcl": 0,
        "lowMax": 0,
        "moderateMax": 0,
        "highMax": 0,
        "effects": ["Severe diarrhea and stomach cramps", "Vomiting", "Severe kidney complications in vulnerable individuals"],
        "sources": ["Human or animal fecal waste breaches", "Sewage overflows", "Failed septic systems leaking into groundwater lines"],
        "treatment": ["Immediate boiling of all drinking water", "System shock chlorination", "Ultraviolet (UV) point-of-entry disinfection systems"]
    },
    "Total Coliform": {
        "unit": "Present/Absent",
        "mcl": 0,
        "lowMax": 0,
        "moderateMax": 1,
        "highMax": 5,
        "effects": ["Potential presence of disease-causing bacteria, viruses, or parasites", "General digestive distress"],
        "sources": ["Soil runoff entering well casings", "Water main pressure drops pulling in topsoil elements", "Aging pipe joints"],
        "treatment": ["System flushing and chlorination", "Shocking well infrastructure", "Point-of-entry sanitization arrays"]
    },
    "Lead": {
        "unit": "ppb",
        "mcl": 15,
        "lowMax": 15,
        "moderateMax": 30,
        "highMax": 999,
        "effects": ["Learning disabilities and reduced IQ scores", "Behavioral problems and attention shifts", "Developmental delays in young children"],
        "sources": ["Corroding home brass faucets", "Aging lead pipes or joints in interior plumbing", "Legacy municipal service lines"],
        "treatment": ["Reverse Osmosis filtration systems", "NSF-certified point-of-use carbon block filters", "Full plumbing service line replacement"]
    },
    "Copper": {
        "unit": "ppm",
        "mcl": 1.3,
        "lowMax": 1.3,
        "moderateMax": 2.6,
        "highMax": 999,
        "effects": ["Stomach irritation and abdominal pain", "Nausea and vomiting", "Long-term liver or kidney strain with high chronic levels"],
        "sources": ["Corrosion of residential copper pipe grids", "Acidic water leaching minerals from building loops"],
        "treatment": ["Point-of-use Carbon block filtration", "Installing a whole-house neutralizer to raise water pH", "Reverse Osmosis systems"]
    },
    "Arsenic": {
        "unit": "ppb",
        "mcl": 10,
        "lowMax": 10,
        "moderateMax": 20,
        "highMax": 999,
        "effects": ["Increased risk of skin, bladder, and lung cancers", "Skin lesions and structural discoloration anomalies", "Cardiovascular issues"],
        "sources": ["Erosion of deep natural rock formations into aquifers", "Industrial factory waste discharge arrays"],
        "treatment": ["Reverse Osmosis systems", "Point-of-entry Activated Alumina filter media", "Anion Exchange filtration tanks"]
    },
    "Nitrate": {
        "unit": "mg/L",
        "mcl": 10,
        "lowMax": 10,
        "moderateMax": 20,
        "highMax": 999,
        "effects": ["Blue Baby Syndrome (Methemoglobinemia) in infants", "Reduced oxygen transport capabilities inside blood channels"],
        "sources": ["Commercial farm field fertilizer rain runoff", "Livestock feedlot waste seepage", "Leaking background septic lines"],
        "treatment": ["Point-of-use Reverse Osmosis systems", "Anion Exchange treatment columns", "Electrodialysis processors"]
    },
    "Nitrite": {
        "unit": "mg/L",
        "mcl": 1,
        "lowMax": 1,
        "moderateMax": 2,
        "highMax": 999,
        "effects": ["Acute blood oxygen saturation disruptions", "Rapid Methemoglobinemia complications in vulnerable populations"],
        "sources": ["Agricultural fertilizer seepage", "Sewage system leaks", "Bacterial breakdown of existing ammonia in distribution pipes"],
        "treatment": ["Reverse Osmosis membrane elements", "Anion Exchange media columns"]
    },
    "PFAS": {
        "unit": "ppt",
        "mcl": 4,
        "lowMax": 4,
        "moderateMax": 10,
        "highMax": 999,
        "effects": ["Elevated serum cholesterol metrics", "Immune system function suppression", "Increased risk of specific developmental anomalies and cancers"],
        "sources": ["Industrial manufacturing waste streams", "Commercial waterproofing chemical sprays", "Firefighting foam runoff at airports"],
        "treatment": ["Granular Activated Carbon (GAC) beds", "Specialized Ion Exchange resin filters", "High-pressure Reverse Osmosis systems"]
    },
    "PFOS": {
        "unit": "ppt",
        "mcl": 4,
        "lowMax": 4,
        "moderateMax": 10,
        "highMax": 999,
        "effects": ["Liver tissue effects and enzyme shifts", "Suppressed antibody vaccine responses", "Thyroid disruptions"],
        "sources": ["Legacy non-stick manufacturing chemical waste lines", "Aviation firefighting foams"],
        "treatment": ["Deep-bed Granular Activated Carbon filters", "Pressurized Ion Exchange columns"]
    },
    "PFOA": {
        "unit": "ppt",
        "mcl": 4,
        "lowMax": 4,
        "moderateMax": 10,
        "highMax": 999,
        "effects": ["Altered lipid metabolism parameters", "Suppressed immune diagnostics", "Increased developmental risks"],
        "sources": ["Industrial coatings processing facilities", "Waterproof fabric manufacturing plants"],
        "treatment": ["Granular Activated Carbon (GAC)", "Nanofiltration systems", "Reverse Osmosis membrane arrays"]
    },
    "Uranium": {
        "unit": "ppb",
        "mcl": 30,
        "lowMax": 30,
        "moderateMax": 60,
        "highMax": 999,
        "effects": ["Increased heavy metal toxicity risk to human kidney structures", "Long-term cancer risks"],
        "sources": ["Natural erosion of radioactive subterranean mineral fields into aquifers"],
        "treatment": ["Anion Exchange filtration columns", "Point-of-use Reverse Osmosis arrays"]
    },
    "Manganese": {
        "unit": "ppb",
        "mcl": 50,
        "lowMax": 50,
        "moderateMax": 300,
        "highMax": 999,
        "effects": ["Neurological effects similar to Parkinson\\'s disease in high chronic doses", "Black sink staining"],
        "sources": ["Natural underground mineral erosion", "Industrial tool manufacturing wastewater"],
        "treatment": ["Catalytic Manganese Greensand filtration plants", "Chemical oxidation paired with physical filters"]
    },
    "Turbidity": {
        "unit": "NTU",
        "mcl": 1,
        "lowMax": 1,
        "moderateMax": 5,
        "highMax": 999,
        "effects": ["Interferes with city water disinfection channels", "Can harbor hidden bacteria, viruses, or protozoa"],
        "sources": ["Stormwater topsoil runoff entering water intakes", "Water main pipe breaks churning up sediment silt"],
        "treatment": ["Conventional coagulation and sedimentation basins", "Microfiltration membrane plants"]
    }
};
