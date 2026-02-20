import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { compressImageServer } from "./imageCompressionServer";

const CLOUDFLARE_R2_URL = process.env.CLOUDFLARE_R2_URL || "";
const CLOUDFLARE_ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID || "";
const CLOUDFLARE_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "";
const CLOUDFLARE_BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || "";
const CLOUDFLARE_PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL || "";

// Debug: Log environment variables (masked for security)
console.log("=== Cloudflare R2 Configuration Debug ===");
console.log("CLOUDFLARE_R2_URL:", CLOUDFLARE_R2_URL || "✗ Missing");
console.log("CLOUDFLARE_ACCESS_KEY_ID:", CLOUDFLARE_ACCESS_KEY_ID ? `✓ Set (${CLOUDFLARE_ACCESS_KEY_ID.substring(0, 8)}...)` : "✗ Missing");
console.log("CLOUDFLARE_SECRET_ACCESS_KEY length:", CLOUDFLARE_SECRET_ACCESS_KEY?.length || 0);
console.log("CLOUDFLARE_BUCKET_NAME:", CLOUDFLARE_BUCKET_NAME || "✗ Missing");
console.log("CLOUDFLARE_PUBLIC_URL:", CLOUDFLARE_PUBLIC_URL || "✗ Missing");
console.log("=========================================");

// Validate environment variables
if (
    !CLOUDFLARE_R2_URL ||
    !CLOUDFLARE_ACCESS_KEY_ID ||
    !CLOUDFLARE_SECRET_ACCESS_KEY ||
    !CLOUDFLARE_BUCKET_NAME ||
    !CLOUDFLARE_PUBLIC_URL
) {
    console.error(
        "❌ ERROR: Missing Cloudflare R2 environment variables. Check your .env.local file."
    );
    console.error("Missing variables:", {
        CLOUDFLARE_R2_URL: !CLOUDFLARE_R2_URL,
        CLOUDFLARE_ACCESS_KEY_ID: !CLOUDFLARE_ACCESS_KEY_ID,
        CLOUDFLARE_SECRET_ACCESS_KEY: !CLOUDFLARE_SECRET_ACCESS_KEY,
        CLOUDFLARE_BUCKET_NAME: !CLOUDFLARE_BUCKET_NAME,
        CLOUDFLARE_PUBLIC_URL: !CLOUDFLARE_PUBLIC_URL,
    });
}

const s3Client = new S3Client({
    region: "auto",
    endpoint: CLOUDFLARE_R2_URL,
    credentials: {
        accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
    },
    maxAttempts: 3,
    requestHandler: {
        requestTimeout: 60000, // 60 giây timeout
    },
});

export const uploadImageToS3 = async (
    file: File,
    fileKey: string,
): Promise<string> => {
    try {
        // 1. START: Log time, file key, bucket info
        const uploadStartTime = Date.now();
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`[uploadImageToS3] START | ${new Date().toISOString()}`);
        console.log(`${'═'.repeat(70)}`);

        console.log(`\n📎 [uploadImageToS3] File details:`, {
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(2) + ' KB',
            fileKey: fileKey,
            bucket: CLOUDFLARE_BUCKET_NAME,
            r2Endpoint: CLOUDFLARE_R2_URL,
        });

        let buffer = Buffer.from(await file.arrayBuffer());

        // 2. BUFFER INFO BEFORE: size bytes, KB, MB
        const originalBufferSize = buffer.length;
        console.log(`\n📦 [uploadImageToS3] Buffer info BEFORE compression:`, {
            sizeBytes: buffer.length,
            sizeKB: (buffer.length / 1024).toFixed(2),
            sizeMB: (buffer.length / 1024 / 1024).toFixed(2),
        });

        // 3. COMPRESSION STATUS (if >1MB)
        if (buffer.length > 1024 * 1024) {
            console.log(`\n🔄 [uploadImageToS3] File > 1MB, attempting server-side compression...`);
            try {
                const compressionStartTime = Date.now();
                const compressResult = await compressImageServer(buffer, file.name);
                const compressedBuffer = compressResult.buffer;
                buffer = compressedBuffer;
                
                const compressionDuration = ((Date.now() - compressionStartTime) / 1000).toFixed(2);
                const reduction = (((originalBufferSize - buffer.length) / originalBufferSize) * 100).toFixed(1);
                
                console.log(`✅ [uploadImageToS3] Compression successful (${compressionDuration}s):`, {
                    originalSizeMB: (originalBufferSize / 1024 / 1024).toFixed(2),
                    compressedSizeMB: (buffer.length / 1024 / 1024).toFixed(2),
                    reductionPercent: reduction + '%',
                });
            } catch (compressionError) {
                console.warn('⚠️ [uploadImageToS3] Compression failed, using original:', compressionError);
            }
        } else {
            console.log(`ℹ️ [uploadImageToS3] File <= 1MB, skipping compression`);
        }

        // 4. BUFFER INFO AFTER compression
        console.log(`\n📦 [uploadImageToS3] Buffer info AFTER compression:`, {
            sizeBytes: buffer.length,
            sizeKB: (buffer.length / 1024).toFixed(2),
            sizeMB: (buffer.length / 1024 / 1024).toFixed(2),
        });

        // 5. PUTOBJECTCOMMAND CREATION: log bucket, key
        console.log(`\n📤 [uploadImageToS3] Creating PutObjectCommand...`);
        const command = new PutObjectCommand({
            Bucket: CLOUDFLARE_BUCKET_NAME,
            Key: fileKey,
            Body: buffer,
            ContentType: file.type || 'image/jpeg',
        });
        
        console.log(`✅ [uploadImageToS3] PutObjectCommand created:`, {
            commandType: 'PutObjectCommand',
            bucket: CLOUDFLARE_BUCKET_NAME,
            key: fileKey,
            bodySize: buffer.length,
            contentType: file.type || 'image/jpeg',
        });

        // 6. S3 SEND: log timing, response
        console.log(`\n🚀 [uploadImageToS3] Sending to S3/R2...`);
        console.log(`   Bucket: ${CLOUDFLARE_BUCKET_NAME}`);
        console.log(`   Key: ${fileKey}`);
        console.log(`   Size: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
        
        const sendStartTime = Date.now();
        let sendResult;
        try {
          sendResult = await s3Client.send(command);
        } catch (sendError) {
          console.error(`❌ [uploadImageToS3] S3 send FAILED:`, sendError);
          throw sendError;
        }
        const sendDuration = ((Date.now() - sendStartTime) / 1000).toFixed(2);
        
        console.log(`✅ [uploadImageToS3] S3 send successful (${sendDuration}s):`, {
            httpStatusCode: sendResult.$metadata?.httpStatusCode,
            requestId: sendResult.$metadata?.requestId ? '✓ (exists)' : '✗ (missing)',
            attempt: 'sent successfully',
        });

        // 7. PUBLIC URL: log URL generation
        console.log(`\n🔗 [uploadImageToS3] Generating public URL...`);
        const publicUrl = `${CLOUDFLARE_PUBLIC_URL}/${fileKey}`;
        
        console.log(`✅ [uploadImageToS3] Public URL generated:`, {
            baseUrl: CLOUDFLARE_PUBLIC_URL,
            fileKey: fileKey,
            fullUrl: publicUrl,
            urlLength: publicUrl.length,
            isHttps: publicUrl.startsWith('https'),
            accessible: 'Ready to insert into editor',
        });

        const totalDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`[uploadImageToS3] COMPLETE ✅ (Total: ${totalDuration}s)`);
        console.log(`Summary:`, {
            fileName: file.name,
            originalSize: (originalBufferSize / 1024 / 1024).toFixed(2) + 'MB',
            finalSize: (buffer.length / 1024 / 1024).toFixed(2) + 'MB',
            publicUrl: publicUrl,
            status: 'Successfully uploaded and ready for insertion',
        });
        console.log(`${'═'.repeat(70)}\n`);

        return publicUrl;
    } catch (error) {
        // 8. ERROR HANDLING: detailed logging
        const errorMsg = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'N/A';
        
        console.error(`\n❌ [uploadImageToS3] ERROR:`, {
            message: errorMsg,
            type: error instanceof Error ? error.name : typeof error,
            stack: errorStack,
        });
        
        console.log(`${'═'.repeat(70)}\n`);
        throw new Error("Failed to upload image to S3: " + errorMsg);
    }
};

// Batch upload multiple images in parallel with auto-compression
export const batchUploadToS3 = async (
    files: File[],
    projectTitle?: string,
): Promise<string[]> => {
    try {
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`[batchUploadToS3] START - Batch uploading ${files.length} files`);
        console.log(`${'═'.repeat(70)}`);
        console.log(`📦 [batchUploadToS3] Files to upload:`, {
            count: files.length,
            projectTitle: projectTitle || 'undefined',
            files: files.map(f => ({
                name: f.name,
                size: (f.size / 1024).toFixed(2) + ' KB',
            })),
        });

        const startTime = Date.now();
        const uploadPromises = files.map(async (file, index) => {
            console.log(`\n📤 [batchUploadToS3] Processing file ${index + 1}/${files.length}: ${file.name}`);
            const fileKey = generateFileKey(file.name, projectTitle);
            const url = await uploadImageToS3(file, fileKey);
            console.log(`✅ [batchUploadToS3] File ${index + 1} uploaded:`, { url });
            return url;
        });

        const results = await Promise.all(uploadPromises);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`\n${'═'.repeat(70)}`);
        console.log(`[batchUploadToS3] COMPLETE ✅`);
        console.log(`✅ [batchUploadToS3] All ${results.length} files uploaded in ${duration}s`);
        console.log(`📋 [batchUploadToS3] URLs:`, results);
        console.log(`${'═'.repeat(70)}\n`);
        
        return results;
    } catch (error) {
        console.error('❌ [batchUploadToS3] Batch upload failed:', error);
        throw error;
    }
};

export const deleteImageFromS3 = async (fileKey: string): Promise<void> => {
    try {
        console.log(`\n🗑️ [deleteImageFromS3] Starting deletion:`, {
            fileKeyInput: fileKey,
        });

        // Extract key from URL if it's a full URL
        let key = fileKey;
        if (fileKey.startsWith("http")) {
            const url = new URL(fileKey);
            key = url.pathname.substring(1); // Remove leading /
            console.log(`📍 [deleteImageFromS3] Extracted key from URL:`, {
                originalInput: fileKey,
                extractedKey: key,
            });
        }

        console.log(`📤 [deleteImageFromS3] Creating DeleteObjectCommand:`, {
            bucket: CLOUDFLARE_BUCKET_NAME,
            key: key,
        });

        const command = new DeleteObjectCommand({
            Bucket: CLOUDFLARE_BUCKET_NAME,
            Key: key,
        });

        const deleteStart = Date.now();
        await s3Client.send(command);
        const deleteDuration = ((Date.now() - deleteStart) / 1000).toFixed(2);

        console.log(`✅ [deleteImageFromS3] Successfully deleted (${deleteDuration}s):`, {
            key: key,
        });
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error("❌ [deleteImageFromS3] Error deleting from S3:", {
            fileKey: fileKey,
            error: errorMsg,
        });
        throw new Error("Failed to delete image from S3: " + errorMsg);
    }
};

// Delete all images from a folder (used for cleanup when project not saved)
export const deleteImagesFromFolder = async (folderPath: string): Promise<void> => {
    try {
        console.log(`\n🗑️ [deleteImagesFromFolder] Starting folder deletion:`, {
            folderPath: folderPath,
        });

        // List all objects in the folder
        const listCommand = new ListObjectsV2Command({
            Bucket: CLOUDFLARE_BUCKET_NAME,
            Prefix: folderPath + '/',
        });

        console.log(`📋 [deleteImagesFromFolder] Listing objects in folder...`);
        const listStartTime = Date.now();
        const listResponse = await s3Client.send(listCommand);
        const listDuration = ((Date.now() - listStartTime) / 1000).toFixed(2);

        if (!listResponse.Contents || listResponse.Contents.length === 0) {
            console.log(`ℹ️ [deleteImagesFromFolder] No images found in folder: ${folderPath}`);
            return;
        }

        console.log(`📊 [deleteImagesFromFolder] Found ${listResponse.Contents.length} objects (${listDuration}s):`, {
            count: listResponse.Contents.length,
            keys: listResponse.Contents.map(obj => obj.Key).slice(0, 5), // Show first 5
        });

        // Delete each object
        console.log(`🗑️ [deleteImagesFromFolder] Deleting ${listResponse.Contents.length} objects...`);
        const deleteStartTime = Date.now();
        const deletePromises = listResponse.Contents.map((obj) =>
            s3Client.send(
                new DeleteObjectCommand({
                    Bucket: CLOUDFLARE_BUCKET_NAME,
                    Key: obj.Key!,
                })
            )
        );

        await Promise.all(deletePromises);
        const deleteDuration = ((Date.now() - deleteStartTime) / 1000).toFixed(2);

        console.log(`✅ [deleteImagesFromFolder] Deleted ${listResponse.Contents.length} images in ${deleteDuration}s from folder: ${folderPath}`);
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.warn(`⚠️ [deleteImagesFromFolder] Failed to delete folder ${folderPath}:`, errorMsg);
        // Don't throw, just warn - cleanup failure shouldn't break the app
    }
};

export const getImageFromS3 = async (fileKey: string): Promise<Buffer> => {
    try {
        // Extract key from URL if it's a full URL
        let key = fileKey;
        if (fileKey.startsWith("http")) {
            const url = new URL(fileKey);
            key = url.pathname.substring(1);
        }

        const command = new GetObjectCommand({
            Bucket: CLOUDFLARE_BUCKET_NAME,
            Key: key,
        });

        const response = await s3Client.send(command);

        if (!response.Body) {
            throw new Error("No body in response");
        }

        // Convert stream to buffer
        const chunks: Uint8Array[] = [];
        const stream = response.Body as any;

        return new Promise((resolve, reject) => {
            stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
            stream.on("error", reject);
            stream.on("end", () => {
                const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                const result = Buffer.allocUnsafe(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    result.set(chunk, offset);
                    offset += chunk.length;
                }
                resolve(result);
            });
        });
    } catch (error) {
        console.error("Error getting from S3:", error);
        throw new Error("Failed to get image from S3");
    }
};

// Generate a unique file key with timestamp (simplified - no folder structure per Bugs.md)
export const generateFileKey = (fileName: string): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const nameWithoutExt = fileName.split(".").slice(0, -1).join(".");
    const ext = fileName.split(".").pop();

    console.log(`\n🔑 [generateFileKey] Generating file key:`, {
        fileName,
        timestamp,
        randomString,
        extension: ext,
        note: 'Direct upload (no folder structure per Bugs.md)',
    });

    // Direct upload without project folder
    const fileKey = `uploads/${timestamp}_${randomString}_${nameWithoutExt}.${ext}`;
    console.log(`✅ [generateFileKey] Generated file key:`, {
        fileKey,
    });
    return fileKey;
};