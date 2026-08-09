import dotenv from 'dotenv';
dotenv.config();

/**
 * Plant.id Crop Disease AI Scanner Service
 * Connects to Plant.id API v3 for leaf identification & diagnostics,
 * with zero-crash realistic fallback diagnostic models.
 */

const PRESET_DIAGNOSTICS = [
  {
    diseaseName: 'Early Blight (Alternaria solani)',
    affectedCrops: ['tomato', 'potato'],
    confidence: 0.94,
    symptoms: [
      'Concentric ring dark brown spots on mature leaves',
      'Yellowing halo surrounding leaf lesions',
      'Premature defoliation starting from lower canopy'
    ],
    treatment: {
      organic: 'Apply Neem Leaf extract (5%) or Copper Hydroxide spray weekly during humid weather.',
      chemical: 'Spray Mancozeb 75% WP @ 2.5g/L or Chlorothalonil @ 2g/L of water.'
    },
    prevention: 'Maintain proper plant spacing for air circulation and practice crop rotation with non-solanaceous crops.'
  },
  {
    diseaseName: 'Yellow Rust / Stripe Rust (Puccinia striiformis)',
    affectedCrops: ['wheat', 'barley'],
    confidence: 0.91,
    symptoms: [
      'Bright yellow pustules arranged in linear stripes on leaves',
      'Powdery yellow spores rubbing off on touch',
      'Stunted growth and shriveled grain formation'
    ],
    treatment: {
      organic: 'Dust fine sulphur powder early morning when dew is present.',
      chemical: 'Foliar spray of Propiconazole 25% EC @ 1ml/L of water at first sign of pustules.'
    },
    prevention: 'Plant rust-resistant seed varieties (e.g. HD 2967, DBW 187) and avoid excessive nitrogen fertilisation.'
  },
  {
    diseaseName: 'Rice Blast (Magnaporthe oryzae)',
    affectedCrops: ['rice', 'paddy'],
    confidence: 0.88,
    symptoms: [
      'Spindle-shaped (diamond-shaped) spots with greyish center and reddish-brown margin',
      'Neck rot causing empty panicles (whiteheads)'
    ],
    treatment: {
      organic: 'Spray Pseudomonas fluorescens @ 10g/L or Trichoderma viride formulations.',
      chemical: 'Apply Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L.'
    },
    prevention: 'Avoid excessive application of urea fertiliser and maintain balanced Potassium levels in soil.'
  },
  {
    diseaseName: 'Powdery Mildew (Erysiphe cichoracearum)',
    affectedCrops: ['mustard', 'cucumber', 'cotton'],
    confidence: 0.93,
    symptoms: [
      'White flour-like powdery patches on upper leaf surfaces and stems',
      'Distorted leaves turning brown and brittle'
    ],
    treatment: {
      organic: 'Baking soda spray (1 tbsp baking soda + 1/2 tsp liquid soap per liter water) or Cow Milk whey (1:9 ratio).',
      chemical: 'Spray Wettable Sulphur 80% WP @ 3g/L or Hexaconazole 5% EC @ 1ml/L.'
    },
    prevention: 'Ensure full sunlight exposure and clear crop residues post-harvest.'
  }
];

// Minimum confidence to trust a Plant.id result — below this we fall back to simulation
const MIN_CONFIDENCE = 0.40;

export async function scanCropDisease(imageBase64, cropHint = 'tomato') {
  const apiKey = process.env.PLANT_ID_API_KEY;

  if (apiKey && apiKey !== 'YOUR_PLANT_ID_API_KEY' && imageBase64) {
    try {
      const response = await fetch('https://api.plant.id/v3/identification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
        },
        body: JSON.stringify({
          images: [imageBase64],
          // Only valid modifiers per Plant.id v3 API:
          health: 'all',           // include disease suggestions
          disease_model: 'full',   // use the full disease detection model
          symptoms: true,          // return symptom descriptions
          similar_images: true,    // required if used — omitting would also work
          classification_level: 'species', // precise species-level disease names
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Plant.id] HTTP ${response.status}:`, errText);
        throw new Error(`Plant.id returned ${response.status}`);
      }

      const data = await response.json();

      // ── Handle healthy plant ─────────────────────────────────────────────
      const isHealthy = data.result?.is_healthy;
      if (isHealthy?.binary === true && isHealthy?.probability >= 0.7) {
        return {
          success: true,
          source: 'Plant.id AI API v3',
          isHealthy: true,
          diseaseName: 'No Disease Detected — Plant appears healthy',
          confidence: isHealthy.probability,
          symptoms: ['No visible disease symptoms detected in the uploaded image.'],
          treatment: {
            organic: 'Continue current care regimen. Ensure adequate watering and nutrition.',
            chemical: 'No chemical treatment required.',
          },
          prevention: 'Maintain balanced fertilisation and inspect leaves weekly for early signs.',
        };
      }

      // ── Filter disease suggestions by minimum confidence ─────────────────
      const allSuggestions = data.result?.disease?.suggestions || [];
      const confident = allSuggestions.filter(
        (s) => (s.probability || 0) >= MIN_CONFIDENCE
      );

      if (confident.length === 0) {
        // No suggestion cleared the threshold — image quality may be too low
        console.warn(
          `[Plant.id] Top suggestion probability ${allSuggestions[0]?.probability?.toFixed(2)} is below threshold ${MIN_CONFIDENCE}. Using fallback.`
        );
        // Return fallback but flag it so the frontend can warn the user
        const matched =
          PRESET_DIAGNOSTICS.find((d) =>
            d.affectedCrops.includes(cropHint.toLowerCase())
          ) || PRESET_DIAGNOSTICS[0];

        return {
          success: true,
          source: 'KrishiSync AI Agronomy Engine (Simulated Diagnostics)',
          lowConfidenceFromAPI: true,
          apiTopProbability: allSuggestions[0]?.probability || 0,
          diseaseName: matched.diseaseName,
          cropAnalyzed: cropHint,
          confidence: matched.confidence,
          symptoms: matched.symptoms,
          treatment: matched.treatment,
          prevention: matched.prevention,
        };
      }

      // ── Return the best suggestion that meets the threshold ──────────────
      const best = confident[0];

      // Log the raw suggestion for debugging so we can see the real v3 shape
      console.log('[Plant.id] Best suggestion:', JSON.stringify(best, null, 2));

      // Plant.id v3 with symptoms:true puts data in best.disease?.symptoms
      // and treatment in best.disease?.treatment (not best.details)
      const diseaseData = best.disease || best.details || {};
      const rawSymptoms  = best.disease?.symptoms || diseaseData.symptoms || [];
      const treatments   = diseaseData.treatment  || {};

      // Symptom list: array of {local_name, description} objects, or plain strings
      const symptomList = Array.isArray(rawSymptoms)
        ? rawSymptoms.map((s) => (typeof s === 'string' ? s : s.description || s.local_name || '')).filter(Boolean)
        : [];

      return {
        success: true,
        source: 'Plant.id AI API v3',
        diseaseName: best.name,
        confidence: best.probability,
        totalSuggestions: allSuggestions.length,
        symptoms: symptomList.length > 0
          ? symptomList
          : ['Visible leaf discoloration and tissue damage detected.'],
        treatment: {
          organic:
            treatments.biological?.[0] ||
            treatments.organic?.[0] ||
            'Apply Neem-based biopesticide or Trichoderma viride formulation.',
          chemical:
            treatments.chemical?.[0] ||
            'Consult your local agro-extension officer for targeted fungicide recommendation.',
        },
        prevention:
          treatments.prevention?.[0] ||
          'Maintain crop hygiene, ensure good airflow, and practice seasonal crop rotation.',
      };
    } catch (err) {
      console.warn('[Plant.id] API call error, falling back:', err.message);
    }
  }


  // ── Fallback: simulation matched to crop hint ────────────────────────────
  const matched =
    PRESET_DIAGNOSTICS.find((d) =>
      d.affectedCrops.includes(cropHint.toLowerCase())
    ) || PRESET_DIAGNOSTICS[0];

  return {
    success: true,
    source: 'KrishiSync AI Agronomy Engine (Simulated Diagnostics)',
    diseaseName: matched.diseaseName,
    cropAnalyzed: cropHint,
    confidence: matched.confidence,
    symptoms: matched.symptoms,
    treatment: matched.treatment,
    prevention: matched.prevention,
  };
}


export function getSampleDiseaseCases() {
  return PRESET_DIAGNOSTICS;
}
