import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { getGridFSBucket } from "@/app/lib/gridfs";
import { ObjectId } from "mongodb";
import PersonalProject from "../../models/personalProject";
import { CheckTokenInCookies, OnErrorReturn } from "../../config";

export async function DELETE(req: NextRequest) {
  return CheckTokenInCookies(async (decodedToken) => {
    try {
      const bucket = await getGridFSBucket();
      if (!bucket) return OnErrorReturn("Failed to initialize GridFSBucket");

      const { searchParams } = new URL(req.url);
      const projectId = searchParams.get("project_id");

      if (!projectId) return OnErrorReturn("Project ID is required", 400);

      const project = await PersonalProject.findById(projectId);
      if (!project) return OnErrorReturn("Project not found", 404);

      // **🔥 Kiểm tra quyền xoá**
      if (project.user_id.toString() !== decodedToken.userId) {
        return OnErrorReturn("Unauthorized", 403);
      }

      // **🔥 Xoá ảnh nếu có**
      if (project.image_preview) {
        const fileId = project.image_preview.split("/").pop();
        if (fileId) {
          try {
            await bucket.delete(new ObjectId(fileId));
          } catch (err) {
            console.error("Failed to delete image:", err);
          }
        }
      }

      // **🔥 Xoá project**
      await project.deleteOne();

      return NextResponse.json({ message: "Project deleted successfully" });

    } catch (error) {
      return OnErrorReturn(error);
    }
  });
}

