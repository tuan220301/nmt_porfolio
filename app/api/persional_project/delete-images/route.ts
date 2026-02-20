import { NextRequest, NextResponse } from "next/server";
import { deleteImageFromS3 } from "@/app/lib/s3";
import { CheckTokenInCookies, OnErrorReturn } from "../../config";

/**
 * Delete multiple images from S3
 * Body: { imageUrls: string[] }
 */
export async function POST(req: NextRequest) {
    return CheckTokenInCookies(async (decoded) => {
        try {
            console.log(`\n${'═'.repeat(70)}`);
            console.log(`[delete-images/route.ts] START`);
            console.log(`${'═'.repeat(70)}`);

            const { imageUrls } = await req.json();

            console.log(`📦 [delete-images/route.ts] Request received:`, {
                urlCount: imageUrls?.length || 0,
                urls: imageUrls?.slice(0, 3) || [], // Show first 3
            });

            if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
                console.error(`❌ [delete-images/route.ts] No image URLs provided`);
                return OnErrorReturn("No image URLs provided");
            }

            console.log(`🗑️ [delete-images/route.ts] Deleting ${imageUrls.length} images...`);
            const deleteStartTime = Date.now();

            const deletePromises = imageUrls.map(async (url) => {
                try {
                    console.log(`   Deleting: ${url.substring(0, 60)}...`);
                    await deleteImageFromS3(url);
                    console.log(`   ✅ Deleted`);
                } catch (error) {
                    console.warn(`   ⚠️ Failed to delete ${url}:`, error);
                    // Don't throw - continue deleting other images
                }
            });

            await Promise.all(deletePromises);
            const deleteDuration = ((Date.now() - deleteStartTime) / 1000).toFixed(2);

            console.log(`\n✅ [delete-images/route.ts] Deletion complete (${deleteDuration}s)`);
            console.log(`${'═'.repeat(70)}\n`);

            return NextResponse.json({
                message: `Deleted ${imageUrls.length} images`,
                isSuccess: true,
                deletedCount: imageUrls.length,
            });
        } catch (error) {
            console.error(`❌ [delete-images/route.ts] Error:`, error);
            return OnErrorReturn(error);
        }
    });
}
