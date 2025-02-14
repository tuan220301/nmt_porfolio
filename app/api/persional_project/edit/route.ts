import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { getGridFSBucket } from "@/app/lib/gridfs";
import { ObjectId } from "mongodb";
import { Readable } from "stream";
import PersonalProject from "../../models/personalProject";
import { CheckTokenInCookies, OnErrorReturn } from "../../config";

export async function POST(req: NextRequest) {
  return CheckTokenInCookies(async (decodedToken) => {
    try {
      await connectDB();
      const bucket = await getGridFSBucket();
      if (!bucket) return OnErrorReturn("Failed to initialize GridFSBucket");

      const formData = await req.formData();
      const projectId = formData.get("project_id") as string;
      const content = formData.get("content") as string;
      const title = formData.get("title") as string;
      const file = formData.get("image") as File | null;

      if (!projectId) return OnErrorReturn("Project ID is required", 400);

      const project = await PersonalProject.findById(projectId);
      if (!project) return OnErrorReturn("Project not found", 404);
      const projectOwnerId = project.user_id instanceof ObjectId ? project.user_id.toString() : project.user_id;
      console.log("User from token:", decodedToken.userId);
      console.log("Project owner:", projectOwnerId);

      if (projectOwnerId !== decodedToken.userId) {
        return OnErrorReturn("Unauthorized: You can only edit your own project", 403);
      }

      let imageUrl = project.image_preview;

      // **🔥 Xử lý thay đổi hình ảnh**
      if (file) {
        // Xoá ảnh cũ nếu có
        if (project.image_preview) {
          const oldFileId = project.image_preview.split("/").pop();
          if (oldFileId) {
            try {
              await bucket.delete(new ObjectId(oldFileId));
            } catch (err) {
              console.error("Failed to delete old image:", err);
            }
          }
        }

        // **🔥 Lưu ảnh mới vào GridFS**
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);
        const uploadStream = bucket.openUploadStream(file.name);
        stream.pipe(uploadStream);

        const fileId = await new Promise<ObjectId>((resolve, reject) => {
          uploadStream.on("finish", () => resolve(uploadStream.id));
          uploadStream.on("error", reject);
        });

        // Cập nhật đường dẫn ảnh mới
        imageUrl = `/api/personal_project/images_return/${fileId}`;
      }

      // **🔥 Cập nhật project**
      project.title = title || project.title;
      project.content = content || project.content;
      project.update_at = new Date();
      project.image_preview = imageUrl;

      await project.save();

      return NextResponse.json({ message: "Project updated successfully", project });

    } catch (error) {
      return OnErrorReturn(error);
    }
  });
}

