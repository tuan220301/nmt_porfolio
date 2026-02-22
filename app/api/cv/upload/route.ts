import { NextRequest, NextResponse } from "next/server";
import { uploadImageToS3, generateFileKey, deleteImagesFromFolder } from "@/app/lib/s3";
import { CheckTokenInCookies, OnErrorReturn } from "../../config";
import { ResponseApi } from "../../models/response";

export async function POST(req: NextRequest) {
    let response: ResponseApi<string> = {
        message: '',
        isSuccess: false
    };

    try {
        return CheckTokenInCookies(async (decoded) => {
            console.log(`\n${'═'.repeat(70)}`);
            console.log(`[cv/upload/route.ts] START`);
            console.log(`${'═'.repeat(70)}`);

            const formData = await req.formData();
            const file = formData.get("pdf") as File;

            console.log(`📦 [cv/upload/route.ts] FormData received:`, {
                fileName: file?.name || "undefined",
                fileSize: file ? (file.size / 1024).toFixed(2) + " KB" : "undefined",
                formDataKeys: Array.from(formData.keys()),
            });

            if (!file) {
                console.error(`❌ [cv/upload/route.ts] No file uploaded`);
                return OnErrorReturn("No file uploaded");
            }

            // Check if file is PDF
            if (!file.name.toLowerCase().endsWith('.pdf') && !file.type.includes('pdf')) {
                console.error(`❌ [cv/upload/route.ts] File is not a PDF`);
                return OnErrorReturn("Please upload a PDF file");
            }

            // Check file size (max 10MB for PDF)
            if (file.size > 10 * 1024 * 1024) {
                const sizeMB = (file.size / 1024 / 1024).toFixed(2);
                console.warn(`⚠️ [cv/upload/route.ts] File too large: ${sizeMB}MB`);
                return OnErrorReturn("File size must be less than 10MB");
            }

            try {
                console.log(`📤 [cv/upload/route.ts] Processing CV upload...`);
                console.log(`   File name: ${file.name}`);
                console.log(`   File size: ${(file.size / 1024).toFixed(2)}KB`);

                // Delete old CV files from CV folder before uploading new one
                console.log(`🗑️ [cv/upload/route.ts] Deleting old CV files...`);
                try {
                    await deleteImagesFromFolder('uploads/cv');
                    console.log(`✅ [cv/upload/route.ts] Old CV files deleted`);
                } catch (deleteError) {
                    console.warn(`⚠️ [cv/upload/route.ts] Failed to delete old CV files, continuing with upload...`, deleteError);
                }

                // Generate file key with CV folder
                const fileKey = generateFileKey(file.name, "CV");
                console.log(`✅ [cv/upload/route.ts] File key generated:`, {
                    fileKey: fileKey,
                    folder: "CV",
                });

                console.log(`📤 [cv/upload/route.ts] Calling uploadImageToS3...`);
                const uploadStartTime = Date.now();
                const pdfUrl = await uploadImageToS3(file, fileKey);
                const uploadTime = ((Date.now() - uploadStartTime) / 1000).toFixed(2);

                console.log(`✅ [cv/upload/route.ts] uploadImageToS3 completed (${uploadTime}s)`);
                console.log(`   PDF URL returned: ${pdfUrl}`);
                console.log(`   URL is valid HTTPS: ${pdfUrl.startsWith('https')}`);

                response.message = "CV uploaded successfully";
                response.isSuccess = true;
                response.data = pdfUrl;

                console.log(`📤 [cv/upload/route.ts] Response object created:`, {
                    isSuccess: response.isSuccess,
                    message: response.message,
                    dataExists: !!response.data,
                    dataLength: response.data?.length || 0,
                });

                console.log(`✅ [cv/upload/route.ts] COMPLETE - Returning response to client`);
                console.log(`${'═'.repeat(70)}\n`);

                return NextResponse.json(response);
            } catch (uploadError) {
                const errorMsg = (uploadError as Error).message;
                console.error(`❌ [cv/upload/route.ts] Upload error:`, errorMsg);
                return OnErrorReturn("CV upload failed: " + errorMsg);
            }
        });

    } catch (error) {
        console.error(`❌ [cv/upload/route.ts] Unexpected error:`, error);
        return OnErrorReturn("Unexpected error: " + error);
    }
}
