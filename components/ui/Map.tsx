"use client";

import dynamic from "next/dynamic";
import { Spot } from "@/lib/db";

const MapInner = dynamic(() => import("./MapInner"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-xl animate-pulse">
            <span className="text-muted-foreground">Loading Map...</span>
        </div>
    ),
});

interface MapProps {
    center?: [number, number];
    zoom?: number;
    spots?: Spot[];
    className?: string;
}

export function Map({ center = [36.3659, 140.4712], zoom = 10, spots = [], className }: MapProps) {
    return <MapInner center={center} zoom={zoom} spots={spots} className={className} />;
}
