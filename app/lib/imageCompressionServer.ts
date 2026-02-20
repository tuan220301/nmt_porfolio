/**
 * Server-side image compression using Sharp
 * Automatically compresses large images before S3 upload
 */

import sharp from 'sharp';

export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

/**
 * Compress image buffer server-side
 * Auto-scales and optimizes for web
 */
export const compressImageServer = async (
    buffer: Buffer,
    fileName: string,
    options: CompressionOptions = {},
): Promise<{ buffer: Buffer; size: number; originalSize: number; }> => {
    const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 80,
    } = options;

    try {
        const originalSize = buffer.length;

        // Skip compression for small files
        if (originalSize < 1024 * 1024) {
            return { buffer, size: originalSize, originalSize };
        }

        console.log(`📦 Compressing image: ${fileName} (${(originalSize / 1024 / 1024).toFixed(2)}MB)`);

        // Use Sharp for server-side compression
        const compressedBuffer = await sharp(buffer)
            .resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .jpeg({
                quality,
                progressive: true,
                mozjpeg: true, // Better compression
            })
            .toBuffer();

        const compressedSize = compressedBuffer.length;
        const reduction = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

        console.log(
            `✅ Compressed: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`,
        );

        return {
            buffer: compressedBuffer,
            size: compressedSize,
            originalSize,
        };
    } catch (error) {
        console.warn(`⚠️ Compression failed for ${fileName}, using original:`, error);
        // Return original buffer if compression fails
        return {
            buffer,
            size: buffer.length,
            originalSize: buffer.length,
        };
    }
};

/**
 * Compress multiple images in batch
 */
export const batchCompressImages = async (
    buffers: { buffer: Buffer; fileName: string; }[],
    options: CompressionOptions = {},
): Promise<{ buffer: Buffer; fileName: string; stats: { buffer: Buffer; size: number; originalSize: number; }; }[]> => {
    console.log(`🔄 Starting server-side batch compression of ${buffers.length} images...`);
    const startTime = Date.now();

    const results = await Promise.all(
        buffers.map(async ({ buffer, fileName }) => {
            const stats = await compressImageServer(buffer, fileName, options);
            return {
                buffer: stats.buffer,
                fileName,
                stats,
            };
        }),
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const totalOriginal = results.reduce((acc, r) => acc + r.stats.originalSize, 0);
    const totalCompressed = results.reduce((acc, r) => acc + r.stats.size, 0);
    const overallReduction = (((totalOriginal - totalCompressed) / totalOriginal) * 100).toFixed(1);

    console.log(
        `✅ Batch compression complete: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalCompressed / 1024 / 1024).toFixed(2)}MB (${overallReduction}% reduction) in ${duration}s`,
    );

    return results;
};
