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

export async function getAddressFromCoordinates(lat: number, lng: number): Promise<{ displayName: string; address: Record<string, string> } | null> {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'FoodMapApp/1.0'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch address');
        }

        const data = await response.json();

        if (data && data.display_name) {
            // Simplify display name to typical Japanese format (remove postcodes, sometimes it's too detailed/backwards)
            // Or just use the raw display_name and let the user edit it.
            // A common approach for Japan is to extract province, city, suburb, etc.
            let simpleAddress = data.display_name;
            if (data.address) {
                const a = data.address;
                const parts = [a.province, a.city || a.town || a.village || a.county, a.suburb, a.neighbourhood, a.road, a.house_number].filter(Boolean);
                if (parts.length > 0) {
                    simpleAddress = parts.join(""); // Japanese addresses concatenate nicely
                }
            }

            return {
                displayName: simpleAddress || data.display_name,
                address: data.address
            };
        }

        return null;
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
    }
}
