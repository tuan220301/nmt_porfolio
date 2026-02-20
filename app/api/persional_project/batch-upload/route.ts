import { NextRequest, NextResponse } from "next/server";
import { batchUploadToS3 } from "@/app/lib/s3";
import { OnErrorReturn, CheckTokenInCookies } from "../../config";
import { ResponseApi } from "../../models/response";

export async function POST(req: NextRequest) {
    let response: ResponseApi<string[]> = {
        message: '',
        isSuccess: false
    };

    try {
        return CheckTokenInCookies(async (decoded) => {
            console.log(`\n${'═'.repeat(70)}`);
            console.log(`[batch-upload/route.ts] START`);
            console.log(`${'═'.repeat(70)}`);

            const formData = await req.formData();

            // Extract all files from formData
            const files: File[] = [];
            const projectTitle = formData.get("projectTitle") as string;

            // Collect all files
            for (const [key, value] of formData.entries()) {
                if (key === "images" && value instanceof File) {
                    files.push(value);
                }
            }

            console.log(`📦 [batch-upload/route.ts] FormData received:`, {
                filesCount: files.length,
                projectTitle: projectTitle || 'undefined',
                files: files.map(f => ({
                    name: f.name,
                    size: (f.size / 1024).toFixed(2) + ' KB',
                })),
            });

            if (!files || files.length === 0) {
                return OnErrorReturn("No files uploaded");
            }

            // Server will auto-compress large images
            const largeFiles = files.filter(f => f.size > 50 * 1024 * 1024);
            if (largeFiles.length > 0) {
                console.warn(`[batch-upload/route.ts] ${largeFiles.length} large files will be auto-compressed`);
            }

            try {
                console.log(`📤 [batch-upload/route.ts] Calling batchUploadToS3...`);
                const startTime = Date.now();

                // Upload all files in parallel
                const imageUrls = await batchUploadToS3(files, projectTitle);

                const duration = ((Date.now() - startTime) / 1000).toFixed(2);
                const totalSize = (files.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(2);
                console.log(`✅ [batch-upload/route.ts] batchUploadToS3 completed (${duration}s):`, {
                    filesUploaded: files.length,
                    urlsReturned: imageUrls.length,
                    totalSize: totalSize + ' KB',
                });

                response.message = "Batch upload success";
                response.isSuccess = true;
                response.data = imageUrls;

                console.log(`✅ [batch-upload/route.ts] COMPLETE - Returning response`);
                console.log(`${'═'.repeat(70)}\n`);

                return NextResponse.json(response);
            } catch (uploadError) {
                const errorMsg = (uploadError as Error).message;
                console.error(`❌ [batch-upload/route.ts] Upload error:`, errorMsg);
                return OnErrorReturn("Upload failed: " + errorMsg);
            }
        });

    } catch (error) {
        console.error(`❌ [batch-upload/route.ts] Unexpected error:`, error);
        return OnErrorReturn("Unexpected error: " + error);
    }
}
