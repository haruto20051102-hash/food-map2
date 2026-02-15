
import { Map } from "@/components/ui/Map";
import { getSpots } from "@/lib/db";
import { Suspense } from "react";

// Allow separate query params handling
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function MapContent({ searchParams }: Props) {
    const params = await searchParams;
    const latParam = params.lat;
    const lngParam = params.lng;
    const zoomParam = params.zoom;

    const spots = await getSpots();

    const initialCenter: [number, number] = latParam && lngParam
        ? [parseFloat(latParam as string), parseFloat(lngParam as string)]
        : [36.3659, 140.4712]; // Default to Mito

    const initialZoom = zoomParam ? parseInt(zoomParam as string) : 12;

    return (
        <div className="h-[calc(100vh-64px)] w-full">
            <Map 
                center={initialCenter} 
                zoom={initialZoom} 
                spots={spots} 
                className="h-full w-full" 
            />
        </div>
    );
}

export default function MapPage(props: Props) {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Map...</div>}>
            <MapContent searchParams={props.searchParams} />
        </Suspense>
    );
}
