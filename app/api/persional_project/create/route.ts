import { NextRequest, NextResponse } from "next/server";
import { uploadImageToS3, generateFileKey } from "@/app/lib/s3";
import { connectDB } from "@/app/lib/mongodb";
import { OnErrorReturn, CheckTokenInCookies } from "../../config";
import PersonalProject from "../../models/personalProject";

export async function POST(req: NextRequest) {
  try {
    return CheckTokenInCookies(async (decodedToken) => {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`[create/route.ts] START`);
      console.log(`${'═'.repeat(70)}`);

      await connectDB();

      const formData = await req.formData();
      const file = formData.get("image") as File;
      const contentsJson = formData.get("contents") as string;
      const userId = formData.get("user_id") as string;
      const title = formData.get("title") as string;
      const des = formData.get("des") as string;

      console.log(`📦 [create/route.ts] FormData received:`, {
        fileName: file?.name || 'undefined',
        fileSize: file ? (file.size / 1024).toFixed(2) + ' KB' : 'undefined',
        title: title,
        hasContents: !!contentsJson,
        userId: userId,
      });

      if (!file) {
        console.error(`❌ [create/route.ts] No preview image uploaded`);
        return OnErrorReturn("No preview image uploaded");
      }

      if (!contentsJson) {
        console.error(`❌ [create/route.ts] No contents provided`);
        return OnErrorReturn("No contents provided");
      }

      let contents;
      try {
        contents = JSON.parse(contentsJson);
        console.log(`✅ [create/route.ts] Contents parsed:`, {
          blockCount: contents?.length || 0,
        });
        
        // Log detailed block information
        console.log(`📦 [create/route.ts] Detailed block information:`);
        contents.forEach((block: any, idx: number) => {
          const imageCount = (block.content?.match(/<img/g) || []).length;
          console.log(`   Block ${idx} (index: ${block.index}, type: ${block.type}):`, {
            contentLength: block.content?.length || 0,
            imageCount: imageCount,
            preview: block.content?.substring(0, 80) || '',
          });
          if (imageCount > 0) {
            const imageUrls = block.content?.match(/src=["']([^"']+)["']/g) || [];
            console.log(`      📸 Images: ${imageUrls.length} found`);
          }
        });
      } catch {
        console.error(`❌ [create/route.ts] Invalid contents format`);
        return OnErrorReturn("Invalid contents format");
      }

      try {
        // Upload preview image to S3 (simplified - no folder structure)
        const fileKey = generateFileKey(file.name);
        console.log(`📤 [create/route.ts] Creating project with preview image: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);
        const uploadStart = Date.now();
        const previewImageUrl = await uploadImageToS3(file, fileKey);
        const uploadTime = ((Date.now() - uploadStart) / 1000).toFixed(2);
        console.log(`✅ [create/route.ts] Preview image upload completed (${uploadTime}s): ${previewImageUrl}`);

        console.log(`💾 [create/route.ts] Saving project to database:`, {
          title,
          des,
          contents_count: contents?.length || 0,
          user_id: userId,
          image_preview: previewImageUrl,
        });

        const newProject = await PersonalProject.create({
          title,
          des,
          contents, // Array of content blocks with URLs
          user_id: userId,
          create_at: new Date(),
          update_at: new Date(),
          image_preview: previewImageUrl,
        });

        console.log(`✅ [create/route.ts] Project created successfully:`, newProject._id);
        console.log(`${'═'.repeat(70)}\n`);

        return NextResponse.json({
          message: "Project created successfully",
          data: newProject,
          isSuccess: true,
        });
      } catch (error) {
        console.error(`❌ [create/route.ts] Error creating project:`, error);
        throw error;
      }
    });
  } catch (error) {
    console.error(`❌ [create/route.ts] Unexpected error:`, error);
    return OnErrorReturn(error);
  }
}

