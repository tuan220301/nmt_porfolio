import { NextRequest, NextResponse } from "next/server";
import { uploadImageToS3, generateFileKey } from "@/app/lib/s3";
import { OnErrorReturn, CheckTokenInCookies } from "../../config";
import { ResponseApi } from "../../models/response";

export async function POST(req: NextRequest) {
  let response: ResponseApi<string> = {
    message: '',
    isSuccess: false
  };

  try {
    return CheckTokenInCookies(async (decoded) => {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`[upload/route.ts] START`);
      console.log(`${'═'.repeat(70)}`);

      const formData = await req.formData();
      const file = formData.get("image") as File;
      // Note: projectTitle param removed per Bugs.md - using direct S3 upload without folder structure

      console.log(`📦 [upload/route.ts] FormData received:`, {
        fileName: file?.name || 'undefined',
        fileSize: file ? (file.size / 1024).toFixed(2) + ' KB' : 'undefined',
      });

      if (!file) {
        console.error(`❌ [upload/route.ts] No file uploaded`);
        return OnErrorReturn("No file uploaded");
      }

      // Server will auto-compress large images
      if (file.size > 50 * 1024 * 1024) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        console.warn(`⚠️ [upload/route.ts] Large file ${sizeMB}MB will be auto-compressed`);
      }

      try {
        console.log(`\n📤 [upload/route.ts] Processing upload...`);
        console.log(`   File name: ${file.name}`);
        console.log(`   File size: ${(file.size / 1024).toFixed(2)}KB`);
        console.log(`   ProjectTitle: "${projectTitle}"`);

        const fileKey = generateFileKey(file.name);
        console.log(`✅ [upload/route.ts] File key generated:`, {
          fileKey: fileKey,
        });

        console.log(`📤 [upload/route.ts] Calling uploadImageToS3...`);
        const uploadStartTime = Date.now();
        const imageUrl = await uploadImageToS3(file, fileKey);
        const uploadTime = ((Date.now() - uploadStartTime) / 1000).toFixed(2);

        console.log(`✅ [upload/route.ts] uploadImageToS3 completed (${uploadTime}s)`);
        console.log(`   Image URL returned: ${imageUrl}`);
        console.log(`   URL is valid HTTPS: ${imageUrl.startsWith('https')}`);
        console.log(`   Ready to send back to client for editor insertion`);

        response.message = "Upload success";
        response.isSuccess = true;
        response.data = imageUrl;

        console.log(`📤 [upload/route.ts] Response object created:`, {
          isSuccess: response.isSuccess,
          message: response.message,
          dataExists: !!response.data,
          dataLength: response.data?.length || 0,
        });

        console.log(`✅ [upload/route.ts] COMPLETE - Returning response to client`);
        console.log(`${'═'.repeat(70)}\n`);

        return NextResponse.json(response);
      } catch (uploadError) {
        const errorMsg = (uploadError as Error).message;
        console.error(`❌ [upload/route.ts] Upload error:`, errorMsg);
        return OnErrorReturn("Upload failed: " + errorMsg);
      }
    });

  } catch (error) {
    console.error(`❌ [upload/route.ts] Unexpected error:`, error);
    return OnErrorReturn("Unexpected error: " + error);
  }
}
