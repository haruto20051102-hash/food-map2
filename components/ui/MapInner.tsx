"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Spot } from "@/lib/db";
import L from "leaflet";
import { useEffect } from "react";
import Link from "next/link";

// Fix for default marker icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapInnerProps {
    center: [number, number];
    zoom: number;
    spots: Spot[];
    className?: string;
}

// Helper component to update map view
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function MapInner({ center, zoom, spots, className }: MapInnerProps) {
    return (
        <div className={className}>
            <MapContainer
                key={`${center[0]}-${center[1]}-${zoom}`}
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="h-full w-full rounded-xl z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapUpdater center={center} zoom={zoom} />
                {spots.map((spot) => (
                    <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={icon}>
                        <Popup className="custom-popup">
                            <div className="p-1">
                                <strong className="block text-sm font-bold mb-1">{spot.name}</strong>
                                <span className="text-xs text-muted-foreground block mb-2">{spot.type}</span>
                                <Link href={`/spots/${spot.id}`} className="text-xs text-primary underline hover:text-primary/80">
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
