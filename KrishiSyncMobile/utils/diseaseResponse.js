export function normalizeDiseaseResult(data) {
  if (!data) return null;

  const organicText =
    data?.treatment?.organic ||
    data?.remedies?.organicNeem?.join(' • ') ||
    'Consult a local agronomist for the best organic treatment.';

  const chemicalText =
    data?.treatment?.chemical ||
    data?.remedies?.chemical?.join(' • ') ||
    'Consult a local agronomist for the best chemical treatment.';

  const confidenceValue =
    data?.confidence ?? data?.confidencePercentage ?? 0.9;

  const confidencePercentage = Math.round(Number(confidenceValue) * 100);

  return {
    diseaseName: data?.diseaseName || 'Unknown disease',
    confidence: Number(confidenceValue),
    confidencePercentage: Number.isFinite(confidencePercentage) ? confidencePercentage : 90,
    source: data?.source || 'KrishiSync AI Agronomy Engine',
    symptoms: data?.symptoms || [],
    prevention: data?.prevention || 'Maintain plant hygiene and practice crop rotation.',
    treatment: {
      organic: organicText,
      chemical: chemicalText
    },
    remedies: {
      organicNeem: Array.isArray(data?.remedies?.organicNeem)
        ? data.remedies.organicNeem
        : [organicText],
      chemical: Array.isArray(data?.remedies?.chemical)
        ? data.remedies.chemical
        : [chemicalText]
    }
  };
}
