export function normalizeIrrigationResult(data) {
  if (!data || !data.success) return null;

  const advisory = data.advisory || {};
  const weather = data.weather || {};

  return {
    irrigateToday: advisory.recommendation === 'YES' || advisory.recommendation === 'MODERATE',
    urgency: advisory.urgency || 'HIGH',
    waterVolumeLitersPerAcre: advisory.waterVolumeLitersPerAcre ?? 0,
    bestTimingWindow: advisory.bestTime || 'Early Morning (05:00 AM - 07:30 AM)',
    explanation: advisory.reasons?.join(' ') || 'No explanation available.',
    weather: {
      cityName: weather.location || 'Your Farm',
      temperature: weather.temp ?? 0,
      humidity: weather.humidity ?? 0,
      description: weather.description || 'Clear'
    }
  };
}
