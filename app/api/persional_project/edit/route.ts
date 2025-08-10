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
      const des = formData.get("des") as string;
      const file = formData.get("image") as File;

      if (!projectId) return OnErrorReturn("Project ID is required", 400);

      const project = await PersonalProject.findById(projectId);
      if (!project) return OnErrorReturn("Project not found", 404);
      const projectOwnerId =
        project.user_id instanceof ObjectId
          ? project.user_id.toString()
          : project.user_id;

      if (projectOwnerId !== decodedToken.userId) {
        return OnErrorReturn(
          "Unauthorized: You can only edit your own project",
          403,
        );
      }

      // 🔥 **XÓA ẢNH CŨ TRƯỚC KHI LƯU ẢNH MỚI**
      if (project.image_preview) {
        const oldFileId = project.image_preview.split("/").pop();
        if (oldFileId && ObjectId.isValid(oldFileId)) {
          try {
            console.log("oldFileId: ", oldFileId);
            // await bucket.delete(new ObjectId(oldFileId));
          } catch (err) {
            console.error("❌ Lỗi khi xóa ảnh cũ:", err);
          }
        }
      }

      // 🔥 **LƯU ẢNH MỚI**
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);
      const uploadStream = bucket.openUploadStream(file.name);

      stream.pipe(uploadStream);

      const fileId: ObjectId = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => resolve(uploadStream.id as ObjectId));
        uploadStream.on("error", reject);
      });

      if (!fileId) return OnErrorReturn("Failed to upload image", 500);

      // Cập nhật đường dẫn mới của ảnh
      const imageUrl = `/api/persional_project/images_return/${fileId.toString()}`;

      // 🔥 **CẬP NHẬT PROJECT**
      project.title = title || project.title;
      project.content = content || project.content;
      project.update_at = new Date();
      project.image_preview = imageUrl;
      project.des = des;
      await project.save();

      return NextResponse.json({
        message: "✅ Project updated successfully",
        isSuccess: true,
        project,
      });
    } catch (error) {
      return OnErrorReturn(error);
    }
  });
}
