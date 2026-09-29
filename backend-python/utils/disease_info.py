"""
Comprehensive Disease Information Database for LeafGuard AI.
Includes detailed Medicine, Treatment, and Prevention guidelines (7 points each).
"""

DISEASE_DB = {
    # ── Tomato ────────────────────────────────────────────────────────────────
    "Tomato___Early_blight": {
        "scientific_name": "Alternaria solani",
        "description": "Fungal infection causing dark concentric spots on tomato leaves starting from lower foliage.",
        "symptoms": [
            "Dark brown concentric rings (target board pattern) on older leaves.",
            "Yellow halo surrounding the leaf lesions.",
            "Lower leaves turn yellow and drop prematurely.",
            "Stem lesions near the soil line (collar rot in seedlings).",
            "Sunscald damage on fruit due to defoliation.",
            "Sunken dark spots near fruit stem attachments.",
            "Reduced fruit yield and stunted plant growth."
        ],
        "medicines": [
            "Chlorothalonil (Daconil 2787) — Apply 2g per liter of water.",
            "Mancozeb 75% WP — Spray every 7-10 days during humid weather.",
            "Copper Oxychloride 50% WP — Organic protective fungicide.",
            "Azoxystrobin (Amistar) — Systemic control for severe infections.",
            "Bordeaux Mixture (1%) — Traditional organic copper fungicide.",
            "Propiconazole 25% EC — Systemic fungicide for curative action.",
            "Trichoderma viride — Bio-control agent for soil treatment."
        ],
        "treatment": [
            "Prune and burn all severely infected lower leaves immediately.",
            "Spray recommended fungicide evenly over foliage and stems.",
            "Apply neem seed kernel extract (NSKE 5%) as an organic spray.",
            "Ensure plants are well-staked to lift leaves off the ground.",
            "Increase plant spacing to allow maximum sunlight and ventilation.",
            "Apply mulch around plant base to prevent soil splash onto foliage.",
            "Avoid overhead irrigation; water strictly at soil level early morning."
        ],
        "prevention": [
            "Practice 3-year crop rotation with non-solanaceous crops.",
            "Plant disease-resistant tomato hybrids (e.g., Mountain Fresh).",
            "Use certified disease-free seeds and vigorous seedlings.",
            "Keep farm equipment and tools disinfected with 10% bleach.",
            "Maintain balanced soil fertility (avoid excess nitrogen).",
            "Remove and destroy crop debris immediately after harvest.",
            "Apply organic compost to boost beneficial soil microorganisms."
        ],
        "urgency": "soon",
    },
    "Tomato___Late_blight": {
        "scientific_name": "Phytophthora infestans",
        "description": "Highly destructive oomycete disease causing rapid leaf blighting and fruit rot in cool, wet weather.",
        "symptoms": [
            "Water-soaked grayish-green spots rapidly expanding on leaves.",
            "White cottony fungal growth on leaf undersides in high humidity.",
            "Dark brown to black lesions on leaf stems and main branches.",
            "Rapid collapse and browning of whole plant canopy within days.",
            "Firm, leathery, dark brown rot on green and ripe tomatoes.",
            "Foul decaying odor in heavily infected tomato fields.",
            "Complete crop destruction if left untreated."
        ],
        "medicines": [
            "Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold) — 2g/L water.",
            "Cymoxanil + Mancozeb (Curzate) — Curative systemic fungicide.",
            "Dimethomorph 50% WP (Acrobat) — Effective against oomycetes.",
            "Copper Hydroxide (Kocide 3000) — Broad-spectrum preventive spray.",
            "Fluopicolide + Propamocarb (Infinito) — Advanced blight control.",
            "Fosetyl-Al (Aliette) — Systemic defense booster.",
            "Bacillus subtilis — Bio-fungicide for early preventive care."
        ],
        "treatment": [
            "Spray systemic fungicides (Ridomil Gold) at first sign of blight.",
            "Uproot and destroy severely affected plants immediately.",
            "Stop all overhead watering and sprinkler systems at once.",
            "Improve field drainage to prevent water stagnation around roots.",
            "Prune dense canopy foliage to enhance internal airflow.",
            "Apply copper-based fungicides weekly during rainy spells.",
            "Clean hands, footwear, and tools before entering healthy fields."
        ],
        "prevention": [
            "Select late-blight resistant varieties (e.g., Defiant PHR, Plum Regal).",
            "Never plant tomatoes near potato fields (shared vector).",
            "Destroy volunteer tomato and potato plants in surrounding areas.",
            "Space rows at least 3-4 feet apart for rapid leaf drying.",
            "Monitor weather forecasts; spray preventively before long rains.",
            "Use drip irrigation systems rather than sprinklers.",
            "Rake and burn all field residue post-harvest."
        ],
        "urgency": "immediate",
    },
    "Tomato___Bacterial_spot": {
        "scientific_name": "Xanthomonas vesicatoria",
        "description": "Bacterial disease causing dark water-soaked spots on leaves and scabby fruit lesions.",
        "symptoms": [
            "Small, water-soaked dark spots on leaves with yellow halo.",
            "Leaf spots turn dark brown/black and dry up into shot holes.",
            "Severe yellowing and dropping of infected leaves.",
            "Black raised scabby spots on green and mature fruit.",
            "Canker-like dark streaks on young stems.",
            "Premature defoliation exposing fruit to sunscald.",
            "Stunted plant growth and reduced marketability."
        ],
        "medicines": [
            "Copper Oxychloride 50% WP + Streptocycline (100 ppm).",
            "Streptomycin Sulfate + Tetracycline Hydrochloride (Plantomycin).",
            "Copper Hydroxide 77% WP — Preventive bactericide.",
            "Kasugamycin 3% SL (Kasu-B) — Antibiotic bactericide.",
            "Mancozeb (added to copper sprays to enhance bactericidal activity).",
            "Bacillus amyloliquefaciens — Biopesticide spray.",
            "Neem Oil 10,000 ppm — Organic protective barrier."
        ],
        "treatment": [
            "Spray Copper Hydroxide combined with Streptocycline every 7 days.",
            "Remove and safely burn severely infected plants.",
            "Avoid entering or touching plants while foliage is wet.",
            "Disinfect pruning shears after every cut using 70% alcohol.",
            "Switch to drip irrigation to keep leaves completely dry.",
            "Apply protective straw mulch to block soil bacteria splash.",
            "Provide adequate potash fertilizer to strengthen cell walls."
        ],
        "prevention": [
            "Use certified disease-free seeds treated with hot water.",
            "Rotate crops for at least 2-3 years with corn or legumes.",
            "Avoid overhead sprinkler irrigation completely.",
            "Plant resistant tomato cultivars where available.",
            "Sanitize seed trays, stakes, and greenhouse structures.",
            "Control weed hosts in and around tomato plots.",
            "Burn or deeply plow under crop residue after harvest."
        ],
        "urgency": "immediate",
    },

    # ── Potato ────────────────────────────────────────────────────────────────
    "Potato___Early_blight": {
        "scientific_name": "Alternaria solani",
        "description": "Fungal blight affecting potato foliage and tubers with target-like brown spots.",
        "symptoms": [
            "Brown target-board concentric spots on lower leaves.",
            "Chlorotic yellowing around leaf lesions.",
            "Premature drying and death of lower foliage.",
            "Sunken, dark, leathery lesions on potato tubers.",
            "Tubers develop dry, corky rot beneath the skin.",
            "Reduced tuber size and yield loss.",
            "Weakened stems prone to breaking."
        ],
        "medicines": [
            "Mancozeb 75% WP (Indofil M-45) — 2.5g per liter water.",
            "Chlorothalonil 75% WP — Broad-spectrum contact fungicide.",
            "Difenoconazole 25% EC (Score) — Systemic curative fungicide.",
            "Copper Sulfate / Bordeaux Mixture — Organic protection.",
            "Azoxystrobin 23% SC — Advanced systemic control.",
            "Tebuconazole 50% + Trifloxystrobin 25% WG (Nativo).",
            "Pseudomonas fluorescens — Bio-control soil spray."
        ],
        "treatment": [
            "Spray Mancozeb or Score fungicide upon first spot detection.",
            "Remove and burn infected lower leaves immediately.",
            "Maintain optimum soil moisture; avoid drought stress.",
            "Apply balanced NPK fertilizer with adequate Potassium.",
            "Keep field weed-free to eliminate alternate fungal hosts.",
            "Ensure proper hilling of soil around potato stems.",
            "Spray neem oil (3ml/L) as an organic deterrent."
        ],
        "prevention": [
            "Plant certified disease-free potato seed tubers.",
            "Rotate crops with corn, wheat, or legumes for 3 years.",
            "Select resistant cultivars (e.g., Kufri Jyoti).",
            "Avoid overhead irrigation late in the afternoon.",
            "Destroy volunteer potato plants in nearby fields.",
            "Allow tubers to mature fully before harvesting to toughen skin.",
            "Clean and disinfect storage crates before potato storage."
        ],
        "urgency": "soon",
    },
    "Potato___Late_blight": {
        "scientific_name": "Phytophthora infestans",
        "description": "Devastating water-mold disease capable of causing total potato crop loss in humid conditions.",
        "symptoms": [
            "Large water-soaked dark lesions on leaf tips and margins.",
            "White mildew growth on underside of leaves in moist morning air.",
            "Blackening and rotting of leaf petioles and stems.",
            "Rapid wilting and decay of entire field canopy.",
            "Reddish-brown dry rot extending into tuber flesh.",
            "Secondary bacterial soft rot causing foul smelling tubers.",
            "Total foliage destruction within 5-7 days."
        ],
        "medicines": [
            "Cymoxanil 8% + Mancozeb 64% WP (Moximate / Curzate).",
            "Dimethomorph 50% WP (Acrobat) — 1g/L water.",
            "Phenamidone 10% + Mancozeb 50% WG (Sectin).",
            "Copper Oxychloride 50% WP — Preventive barrier.",
            "Metalaxyl-M + Mancozeb (Ridomil Gold MZ).",
            "Fluopicolide + Propamocarb (Infinito).",
            "Trichoderma harzianum — Bio-fungicide application."
        ],
        "treatment": [
            "Spray Ridomil Gold or Acrobat immediately at disease onset.",
            "Repeat systemic fungicide spray every 7 days in humid weather.",
            "Cut and burn potato vines (desiccation) if infection exceeds 20%.",
            "Ensure tubers are well covered with high soil ridges (hilling).",
            "Delay harvest by 10-14 days after vine killing to let spores die.",
            "Do not harvest during wet soil conditions.",
            "Sort out infected tubers before putting potatoes into cold storage."
        ],
        "prevention": [
            "Always use certified disease-free seed tubers.",
            "Plant late-blight resistant varieties.",
            "Destroy all potato cull piles and volunteer plants.",
            "Spray preventive copper fungicides before monsoon/rainy weather.",
            "Ensure proper drainage in potato beds.",
            "Space plants adequately to facilitate fast drying.",
            "Avoid excessive nitrogen fertilization."
        ],
        "urgency": "immediate",
    },

    # ── Apple ─────────────────────────────────────────────────────────────────
    "Apple___Apple_scab": {
        "scientific_name": "Venturia inaequalis",
        "description": "Major fungal disease causing velvet dark spots on apple leaves and corky fruit scab.",
        "symptoms": [
            "Olive-green to dark velvety spots on upper leaf surfaces.",
            "Leaves turn yellow and drop prematurely in summer.",
            "Corky, scabby brown spots on apple skin.",
            "Deformed, cracked, and stunted fruit growth.",
            "Blister-like lesions on twigs and young shoots.",
            "Reduced tree vigor and flower bud formation for next year.",
            "High susceptibility to secondary fruit rot."
        ],
        "medicines": [
            "Myclobutanil 10% WP (Rally) — Systemic fungicide.",
            "Captan 50% WP — Protective broad-spectrum fungicide.",
            "Difenoconazole 25% EC (Score) — Curative scab control.",
            "Dodine 65% WP — Eradicant for early scab infections.",
            "Lime Sulfur / Wettable Sulfur — Organic scab spray.",
            "Kresoxim-methyl 44.3% SC (Stroby) — Strobilurin fungicide.",
            "Bacillus subtilis (Serenade) — Bio-fungicide."
        ],
        "treatment": [
            "Spray Myclobutanil or Score at green-tip and pink-bud stages.",
            "Apply Captan protective spray every 10-14 days during wet spring.",
            "Prune tree canopy to maximize sunlight penetration and air movement.",
            "Rake and destroy all fallen leaves under apple trees in autumn.",
            "Spray 5% urea on fallen leaves to accelerate leaf decomposition.",
            "Remove scabby young fruits during manual thinning.",
            "Maintain balanced tree nutrition with Potassium and Calcium."
        ],
        "prevention": [
            "Plant scab-resistant apple cultivars (e.g., Liberty, Prima).",
            "Ensure wide tree spacing when establishing new orchards.",
            "Prune trees annually during winter dormancy.",
            "Apply preventive sulfur sprays before spring rain events.",
            "Flail-mow fallen leaves in winter to destroy fungal spores.",
            "Avoid overhead irrigation systems in orchards.",
            "Monitor weather leaf-wetness hours for timing sprays."
        ],
        "urgency": "soon",
    },
}

def get_disease_info(label: str) -> dict:
    """Returns disease information with guaranteed 7 points for medicines, treatment & prevention."""
    info = DISEASE_DB.get(label)
    if info:
        return info

    # Intelligent fallback for other classes ensuring 7 points each
    is_healthy = "healthy" in label.lower()
    plant = label.split("___")[0].replace("_", " ") if "___" in label else "Plant"
    condition = label.split("___")[1].replace("_", " ") if "___" in label else label

    if is_healthy:
        return {
            "scientific_name": None,
            "description": f"The {plant} leaf appears healthy with robust cellular structure and no visible signs of fungal or bacterial infection.",
            "symptoms": [
                f"Vibrant green leaf coloration characteristic of healthy {plant}.",
                "Smooth, undamaged leaf margins and intact cuticle.",
                "Absence of spots, lesions, chlorosis, or wilting.",
                "Healthy leaf vein network without necrosis.",
                "Normal growth rate and healthy foliage density.",
                "No visible pest infestation or webbing.",
                "Optimal photosynthetic activity and leaf turgor."
            ],
            "medicines": [
                "No chemical medicines needed for healthy plants.",
                "Neem Oil (1%) — Preventive organic spray.",
                "Bio-stimulants — Seaweed extract spray for growth.",
                "Micronutrient Spray — Zinc and Iron supplement.",
                "Pseudomonas fluorescens — Soil health enhancer.",
                "Trichoderma viride — Preventive root drench.",
                "Organic Vermicompost tea for foliage nourishment."
            ],
            "treatment": [
                "Maintain regular watering schedule suited for plant species.",
                "Apply organic compost around plant root zone.",
                "Prune dead or old lower leaves to maintain airflow.",
                "Ensure plant receives adequate daily sunlight.",
                "Inspect foliage weekly for early pest or disease signs.",
                "Keep soil well-drained to avoid root hypoxia.",
                "Clean leaves occasionally with water spray to remove dust."
            ],
            "prevention": [
                "Practice annual crop rotation and soil solarization.",
                "Maintain balanced soil NPK nutrient levels.",
                "Mulch plant base to conserve soil moisture.",
                "Use clean, disinfected garden tools always.",
                "Avoid leaf wetness late in the evening.",
                "Provide proper plant-to-plant spacing.",
                "Use certified high-quality seeds/seedlings."
            ],
            "urgency": "none"
        }

    # Generic diseased fallback with 7 structured points
    return {
        "scientific_name": f"{condition} Pathogen",
        "description": f"Infection detected on {plant} foliage corresponding to {condition}. Prompt treatment recommended.",
        "symptoms": [
            f"Distinctive discolored spots on {plant} leaf surface.",
            "Chlorotic yellow halos surrounding affected leaf tissue.",
            "Premature wilting or curling of leaf margins.",
            "Dark necrotic patches expanding along leaf veins.",
            "Reduced vigor and foliage thinning.",
            "Leaf drop starting from lower or outer branches.",
            "Stunted growth and lower crop productivity."
        ],
        "medicines": [
            "Copper Oxychloride 50% WP — 2.5g/L water spray.",
            "Mancozeb 75% WP — Broad spectrum fungicide.",
            "Carbendazim 50% WP — Systemic curative fungicide.",
            "Streptocycline (100 ppm) — For bacterial infections.",
            "Azoxystrobin 23% SC — Broad-spectrum systemic control.",
            "Neem Oil 10,000 ppm — Organic protective spray.",
            "Trichoderma viride — Biological bio-fungicide."
        ],
        "treatment": [
            "Prune and destroy infected leaves immediately.",
            "Apply recommended fungicide/bactericide spray thoroughly.",
            "Ensure plants are staked for improved air circulation.",
            "Water directly at root zone; avoid wetting leaves.",
            "Apply organic mulch to stop soil-borne fungal splash.",
            "Disinfect all cutting tools with alcohol after use.",
            "Isolate heavily infected plants to protect healthy crop."
        ],
        "prevention": [
            "Rotate crops every 2-3 years with non-host species.",
            "Use certified disease-resistant crop varieties.",
            "Space plants widely for maximum sunlight and ventilation.",
            "Avoid overhead sprinkler irrigation systems.",
            "Maintain balanced soil fertility without excess Nitrogen.",
            "Clear and burn all field crop debris post-harvest.",
            "Monitor plants weekly for early symptom detection."
        ],
        "urgency": "soon"
    }
