import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { deleteImageFromS3, deleteImagesFromFolder } from "@/app/lib/s3";
import PersonalProject from "../../models/personalProject";
import { CheckTokenInCookies, OnErrorReturn } from "../../config";

export async function DELETE(req: NextRequest) {
  return CheckTokenInCookies(async (decodedToken) => {
    try {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`[delete/route.ts] START`);
      console.log(`${'═'.repeat(70)}`);

      await connectDB();

      const { searchParams } = new URL(req.url);
      const projectId = searchParams.get("project_id");

      console.log(`📦 [delete/route.ts] Request received:`, {
        projectId: projectId,
        userId: decodedToken.userId,
      });

      if (!projectId) {
        console.error(`❌ [delete/route.ts] Project ID is required`);
        return OnErrorReturn("Project ID is required", 400);
      }

      const project = await PersonalProject.findById(projectId);
      if (!project) {
        console.error(`❌ [delete/route.ts] Project not found: ${projectId}`);
        return OnErrorReturn("Project not found", 404);
      }

      // Check authorization
      if (project.user_id.toString() !== decodedToken.userId) {
        console.error(`❌ [delete/route.ts] Unauthorized - User ${decodedToken.userId} trying to delete project of ${project.user_id}`);
        return OnErrorReturn("Unauthorized", 403);
      }

      console.log(`📋 [delete/route.ts] Project details:`, {
        title: project.title,
        hasPreviewImage: !!project.image_preview,
        contentsCount: project.contents?.length || 0,
      });

      // Delete preview image from S3 if exists
      if (project.image_preview) {
        try {
          console.log(`🗑️ [delete/route.ts] Deleting preview image...`);
          await deleteImageFromS3(project.image_preview);
        } catch (err) {
          console.warn("⚠️ [delete/route.ts] Failed to delete preview image from S3:", err);
        }
      }

      // Delete all project content block images and project folder from S3
      const titleSlug = project.title.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
      const folderPath = `uploads/${titleSlug}`;
      
      console.log(`🗑️ [delete/route.ts] Deleting project folder from S3:`, {
        folderPath: folderPath,
      });
      await deleteImagesFromFolder(folderPath);

      // Delete project from database
      console.log(`💾 [delete/route.ts] Deleting project from database...`);
      const deleteStartTime = Date.now();
      await project.deleteOne();
      const deleteDuration = ((Date.now() - deleteStartTime) / 1000).toFixed(2);

      console.log(`✅ [delete/route.ts] Project deleted successfully (${deleteDuration}s)`);
      console.log(`${'═'.repeat(70)}\n`);

      return NextResponse.json({
        message: "Project deleted successfully",
        isSuccess: true,
      });
    } catch (error) {
      console.error(`❌ [delete/route.ts] Error:`, error);
      return OnErrorReturn(error);
    }
  });
}
