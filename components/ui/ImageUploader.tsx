"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/imageCompression";

interface ImageUploaderProps {
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    initialImages?: string[]; // URLs of existing images
    className?: string;
}

export function ImageUploader({
    onFilesChange,
    maxFiles = 5,
    initialImages = [],
    className,
}: ImageUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(initialImages);
    const inputRef = useRef<HTMLInputElement>(null);

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
    };

    const addFiles = async (newFiles: File[]) => {
        const totalImages = existingImages.length + files.length + newFiles.length;

        if (totalImages > maxFiles) {
            alert(`最大${maxFiles}枚までしかアップロードできません。`);
            return;
        }

        const validFiles = newFiles.filter(file => file.type.startsWith("image/"));

        // Generate preliminary previews for immediate feedback (optional, but good UX)
        // However, since compression is fast, we can wait. 
        // Let's compress first.

        try {
            const compressedFiles = await Promise.all(
                validFiles.map(file => compressImage(file))
            );

            const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));

            setFiles(prev => [...prev, ...compressedFiles]);
            setPreviews(prev => [...prev, ...newPreviews]);

            // Notify parent
            onFilesChange([...files, ...compressedFiles]);
        } catch (error) {
            console.error("Image compression failed:", error);
            alert("画像の圧縮に失敗しました。");
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        const newPreviews = [...previews];

        URL.revokeObjectURL(newPreviews[index]);

        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setFiles(newFiles);
        setPreviews(newPreviews);
        onFilesChange(newFiles);
    };

    const removeExistingImage = (index: number) => {
        const newExisting = [...existingImages];
        newExisting.splice(index, 1);
        setExistingImages(newExisting);
        // Note: We might need to tell parent about removed existing images if we want to delete them from DB.
        // For MVP, we'll just ignore them in the form submission (only new files are uploaded).
        // But strictly speaking, updating should handle deletions. 
        // Let's keep it simple: this visually removes it, but user might need to know.
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            addFiles(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />

                <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Upload className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-medium">クリックして画像を選択</p>
                        <p className="text-sm text-muted-foreground">またはドラッグ＆ドロップ</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        最大 {maxFiles} 枚まで (JPG, PNG, WebP)
                    </p>
                </div>
            </div>

            {/* Previews Grid */}
            {(existingImages.length > 0 || previews.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Existing Images */}
                    {existingImages.map((src, idx) => (
                        <div key={`existing-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                            {/* Hidden input to send existing images to server */}
                            <input type="hidden" name="existing_images" value={src} />

                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeExistingImage(idx); }}
                                    className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                登録済み
                            </div>
                        </div>
                    ))}

                    {/* New Previews */}
                    {previews.map((src, idx) => (
                        <div key={`new-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                    className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                                新規
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
