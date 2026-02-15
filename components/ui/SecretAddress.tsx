"use client";

import { useState } from "react";
import { MapPin, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecretAddressProps {
    address: string;
    className?: string;
}

export function SecretAddress({ address, className }: SecretAddressProps) {
    return (
        <div
            className={cn(
                "relative group overflow-hidden rounded-lg border border-white/10 p-4 transition-all duration-300 hover:border-primary/50 bg-muted/10",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <div className="rounded-full p-2 transition-colors bg-primary/20 text-primary">
                    <MapPin className="h-5 w-5" />
                </div>

                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-0.5">Address</p>
                    <p className="font-mono text-base">
                        {address}
                    </p>
                </div>
            </div>
        </div>
    );
}
