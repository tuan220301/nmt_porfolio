import { useState, useCallback } from 'react';
import { compressImageClient, batchCompressImages } from '@/app/Ults/imageCompression';

interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

interface UseImageUploadOptions {
    maxFileSize?: number; // Default: 5MB
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<UploadProgress | null>(null);

    const {
        maxFileSize = 5 * 1024 * 1024,
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 0.8,
    } = options;

    /**
     * Compress and upload a single image
     */
    const uploadImage = useCallback(
        async (file: File, endpoint: string, projectTitle?: string): Promise<string | null> => {
            try {
                setLoading(true);
                setError(null);

                // Step 1: Compress if needed
                console.log(`📦 Processing image: ${file.name}`);
                const compressed = await compressImageClient(file, maxWidth, maxHeight, quality);

                // Step 2: Check final size
                if (compressed.size > maxFileSize) {
                    const sizeMB = (compressed.size / 1024 / 1024).toFixed(2);
                    throw new Error(
                        `Image still too large (${sizeMB}MB) after compression. Try a lower quality setting.`,
                    );
                }

                // Step 3: Upload
                const formData = new FormData();
                formData.append('image', compressed);
                if (projectTitle) {
                    formData.append('projectTitle', projectTitle);
                }

                console.log(`📤 Uploading to ${endpoint}...`);
                const uploadStart = Date.now();

                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                });

                const uploadTime = ((Date.now() - uploadStart) / 1000).toFixed(2);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Upload failed with status ${response.status}`);
                }

                const data = await response.json();
                console.log(`✅ Upload completed in ${uploadTime}s`);

                return data.data;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Upload failed';
                setError(message);
                console.error('❌ Upload error:', message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [maxFileSize, maxWidth, maxHeight, quality],
    );

    /**
     * Compress and batch upload multiple images
     */
    const batchUploadImages = useCallback(
        async (files: File[], endpoint: string, projectTitle?: string): Promise<string[]> => {
            try {
                setLoading(true);
                setError(null);

                // Step 1: Compress all
                console.log(`📦 Processing ${files.length} images...`);
                const compressed = await batchCompressImages(files, maxWidth, maxHeight, quality);

                // Step 2: Check sizes
                const oversized = compressed.filter((f) => f.size > maxFileSize);
                if (oversized.length > 0) {
                    throw new Error(
                        `${oversized.length} image(s) still too large after compression. Try a lower quality setting.`,
                    );
                }

                // Step 3: Batch upload
                const formData = new FormData();
                compressed.forEach((file) => {
                    formData.append('images', file);
                });
                if (projectTitle) {
                    formData.append('projectTitle', projectTitle);
                }

                console.log(`📤 Starting batch upload to ${endpoint}...`);
                const uploadStart = Date.now();

                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                });

                const uploadTime = ((Date.now() - uploadStart) / 1000).toFixed(2);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Upload failed with status ${response.status}`);
                }

                const data = await response.json();
                console.log(
                    `✅ Batch upload complete: ${compressed.length} images in ${uploadTime}s`,
                );

                return data.data || [];
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Batch upload failed';
                setError(message);
                console.error('❌ Batch upload error:', message);
                return [];
            } finally {
                setLoading(false);
            }
        },
        [maxFileSize, maxWidth, maxHeight, quality],
    );

    return {
        uploadImage,
        batchUploadImages,
        loading,
        error,
        progress,
        setError,
    };
};
