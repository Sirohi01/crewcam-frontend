export async function geocodeAddress(queries: string[]): Promise<{ lat: number; lng: number } | null> {
  for (const query of queries) {
    if (!query || !query.trim()) continue;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AntigravityApp/1.0',
        }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error('Geocoding failed for query:', query, error);
    }
    // Briefly pause between fallback queries to respect rate limits (max 1 req/sec per OSM policy)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return null;
}
