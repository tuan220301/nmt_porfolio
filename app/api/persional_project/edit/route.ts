import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { uploadImageToS3, deleteImageFromS3, generateFileKey } from "@/app/lib/s3";
import { ObjectId } from "mongodb";
import PersonalProject from "../../models/personalProject";
import { CheckTokenInCookies, OnErrorReturn } from "../../config";

export async function POST(req: NextRequest) {
  return CheckTokenInCookies(async (decodedToken) => {
    try {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`[edit/route.ts] START`);
      console.log(`${'═'.repeat(70)}`);

      await connectDB();

      const formData = await req.formData();
      const projectId = formData.get("project_id") as string;
      const contentsJson = formData.get("contents") as string;
      const title = formData.get("title") as string;
      const des = formData.get("des") as string;
      const file = formData.get("image") as File;

      console.log(`📦 [edit/route.ts] FormData received:`, {
        projectId: projectId,
        title: title,
        des: des,
        hasFile: !!file,
        fileName: file?.name || 'undefined',
        fileSize: file ? (file.size / 1024).toFixed(2) + ' KB' : 'undefined',
        hasContents: !!contentsJson,
      });

      if (!projectId) {
        console.error(`❌ [edit/route.ts] Project ID is required`);
        return OnErrorReturn("Project ID is required", 400);
      }

      const project = await PersonalProject.findById(projectId);
      if (!project) {
        console.error(`❌ [edit/route.ts] Project not found: ${projectId}`);
        return OnErrorReturn("Project not found", 404);
      }

      const projectOwnerId =
        project.user_id instanceof ObjectId
          ? project.user_id.toString()
          : project.user_id;

      if (projectOwnerId !== decodedToken.userId) {
        console.error(`❌ [edit/route.ts] Unauthorized - User ${decodedToken.userId} trying to edit project of ${projectOwnerId}`);
        return OnErrorReturn(
          "Unauthorized: You can only edit your own project",
          403,
        );
      }

      let contents;
      if (contentsJson) {
        try {
          contents = JSON.parse(contentsJson);
          console.log(`✅ [edit/route.ts] Contents parsed:`, {
            blockCount: contents?.length || 0,
          });

          // Log detailed block information
          console.log(`📦 [edit/route.ts] Detailed block information:`);
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
          console.error(`❌ [edit/route.ts] Invalid contents format`);
          return OnErrorReturn("Invalid contents format", 400);
        }
      } else {
        contents = project.contents;
      }

      try {
        // Handle preview image upload if provided
        let imageUrl = project.image_preview;

        if (file) {
          // Delete old preview image from S3
          if (project.image_preview) {
            try {
              console.log(`🗑️ [edit/route.ts] Deleting old preview image...`);
              await deleteImageFromS3(project.image_preview);
              console.log(`✅ [edit/route.ts] Deleted old preview image`);
            } catch (err) {
              console.warn("⚠️ [edit/route.ts] Failed to delete old preview image from S3:", err);
            }
          }

          // Upload new preview image to S3 with folder structure using project title
          const fileKey = generateFileKey(file.name, title);
          console.log(`📤 [edit/route.ts] Updating project with new preview image: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);
          console.log(`   Folder structure: uploads/${title}/...`);
          const uploadStart = Date.now();
          imageUrl = await uploadImageToS3(file, fileKey);
          const uploadTime = ((Date.now() - uploadStart) / 1000).toFixed(2);
          console.log(`✅ [edit/route.ts] Image upload completed (${uploadTime}s): ${imageUrl}`);
        }

        // Update project
        console.log(`💾 [edit/route.ts] Updating project ${projectId}:`, {
          title: title || "unchanged",
          des: des || "unchanged",
          contents_count: contents?.length || "unchanged",
          image_preview_updated: !!file,
        });

        project.title = title || project.title;
        project.contents = contents || project.contents;
        project.update_at = new Date();
        project.image_preview = imageUrl;
        project.des = des;
        await project.save();

        console.log(`✅ [edit/route.ts] Project updated successfully`);
        console.log(`${'═'.repeat(70)}\n`);

        return NextResponse.json({
          message: "Project updated successfully",
          isSuccess: true,
          project,
        });
      } catch (error) {
        console.error(`❌ [edit/route.ts] Error updating project:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`❌ [edit/route.ts] Unexpected error:`, error);
      return OnErrorReturn(error);
    }
  });
}
