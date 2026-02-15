export async function getCoordinates(address: string): Promise<{ lat: number; lng: number; address?: Record<string, string> } | null> {
    try {
        const query = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&addressdetails=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'FoodMapApp/1.0' // Nominatim requires a User-Agent
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch coordinates');
        }

        const data = await response.json() as any[];

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                address: data[0].address // Returns detailed address components
            };
        }

        return null; // Not found
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}
