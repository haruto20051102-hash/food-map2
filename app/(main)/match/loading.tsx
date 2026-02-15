import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="container min-h-[calc(100vh-80px)] py-8 flex flex-col items-center justify-center overflow-hidden">
            <div className="text-center mb-8 animate-pulse">
                <div className="h-8 w-48 bg-muted rounded-md mx-auto mb-2"></div>
                <div className="h-4 w-64 bg-muted rounded-md mx-auto"></div>
            </div>

            <div className="relative h-[650px] w-full flex flex-col items-center justify-center">
                {/* Category Filters Skeleton */}
                <div className="absolute top-0 z-20 w-full overflow-x-auto pb-2 px-4 no-scrollbar">
                    <div className="flex items-center gap-2 justify-center min-w-max mx-auto">
                        <div className="bg-background/80 backdrop-blur-md p-1 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-7 w-16 bg-muted rounded-full"></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative w-full max-w-[360px] h-[600px] mt-12 bg-card border border-white/10 rounded-3xl shadow-xl overflow-hidden animate-pulse">
                    <div className="h-2/3 bg-muted w-full"></div>
                    <div className="p-6 space-y-4">
                        <div className="h-8 w-3/4 bg-muted rounded"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-muted rounded"></div>
                            <div className="h-4 w-5/6 bg-muted rounded"></div>
                        </div>
                    </div>
                </div>
                {/* Controls Skeleton */}
                <div className="absolute bottom-[-80px] flex items-center gap-6 opacity-50">
                    <div className="h-16 w-16 rounded-full bg-muted"></div>
                    <div className="h-12 w-12 rounded-full bg-muted"></div>
                    <div className="h-16 w-16 rounded-full bg-muted"></div>
                </div>
            </div>
        </div>
    );
}
