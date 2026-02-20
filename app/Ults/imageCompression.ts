/**
 * Client-side utility for image compression before upload
 * This reduces bandwidth and upload time significantly
 * REQUIRED: All images > 2MB must be compressed to max 5MB before server upload
 */

export const compressImageClient = async (
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.8,
): Promise<File> => {
    return new Promise((resolve, reject) => {
        try {
            // Skip compression for images smaller than 2MB
            if (file.size < 2 * 1024 * 1024) {
                resolve(file);
                return;
            }

            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        reject(new Error('Canvas context is null'));
                        return;
                    }

                    // Calculate new dimensions maintaining aspect ratio
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth || height > maxHeight) {
                        const aspectRatio = width / height;

                        if (width > height) {
                            width = maxWidth;
                            height = width / aspectRatio;
                        } else {
                            height = maxHeight;
                            width = height * aspectRatio;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Reduce quality iteratively until file size is under 5MB
                    let currentQuality = quality;
                    let attemptCount = 0;
                    const maxAttempts = 5;

                    const tryCompress = (currentQ: number) => {
                        canvas.toBlob(
                            (blob) => {
                                attemptCount++;

                                if (!blob) {
                                    reject(new Error('Canvas compression failed'));
                                    return;
                                }

                                const MAX_SIZE = 5 * 1024 * 1024; // 5MB max

                                // If file is still too large and we have attempts left, reduce quality
                                if (blob.size > MAX_SIZE && currentQ > 0.3 && attemptCount < maxAttempts) {
                                    console.log(`⚠️ Compression attempt ${attemptCount}: File size ${(blob.size / 1024 / 1024).toFixed(2)}MB, reducing quality...`);
                                    tryCompress(currentQ - 0.15);
                                    return;
                                }

                                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                });

                                // Log compression info
                                const originalSize = (file.size / 1024 / 1024).toFixed(2);
                                const newSize = (compressedFile.size / 1024 / 1024).toFixed(2);
                                const reduction = (((file.size - compressedFile.size) / file.size) * 100).toFixed(1);

                                console.log(
                                    `📸 Compressed: ${originalSize}MB → ${newSize}MB (${reduction}% reduction) [Quality: ${currentQ.toFixed(2)}, Attempts: ${attemptCount}]`,
                                );

                                if (compressedFile.size > MAX_SIZE) {
                                    console.warn(`⚠️ Final file still large: ${newSize}MB`);
                                }

                                resolve(compressedFile);
                            },
                            'image/jpeg',
                            currentQ,
                        );
                    };

                    tryCompress(currentQuality);
                };

                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = event.target?.result as string;
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Batch compress multiple images
 */
export const batchCompressImages = async (
    files: File[],
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.8,
): Promise<File[]> => {
    console.log(`🔄 Starting batch compression of ${files.length} files...`);
    const startTime = Date.now();

    const compressPromises = files.map((file) =>
        compressImageClient(file, maxWidth, maxHeight, quality).catch((err) => {
            console.error(`❌ Compression failed for ${file.name}:`, err);
            return file; // Return original if compression fails
        }),
    );

    const results = await Promise.all(compressPromises);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const totalOriginalSize = (files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2);
    const totalCompressedSize = (results.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2);

    console.log(
        `✅ Batch compression complete: ${totalOriginalSize}MB → ${totalCompressedSize}MB in ${duration}s`,
    );

    return results;
};
