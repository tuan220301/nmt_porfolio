import { NextRequest, NextResponse } from "next/server";
import { getGridFSBucket } from "@/app/lib/gridfs";
import { connectDB } from "@/app/lib/mongodb";
import { Readable } from "stream";
import { ObjectId } from "mongodb";
import { OnErrorReturn } from "../../config";
import PersonalProject from "../../models/personalProject";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const bucket = await getGridFSBucket();
    if (!bucket) {
      return OnErrorReturn("Failed to initialize GridFSBucket");
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const content = formData.get("content") as string;
    const userId = formData.get("user_id") as string;
    const title = formData.get("title") as string;
    if (!file) {
      return OnErrorReturn("No image uploaded");
    }

    // Lưu hình ảnh vào GridFS
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);
    const uploadStream = bucket.openUploadStream(file.name);

    stream.pipe(uploadStream);

    // Chờ khi upload xong
    const fileId = await new Promise<ObjectId>((resolve, reject) => {
      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", reject);
    });

    // Tạo URL hình ảnh
    const imageUrl = `/api/persional_project/images_return/${fileId}`;

    // Lưu project vào database
    const newProject = await PersonalProject.create({
      title,
      content,
      user_id: userId,
      create_at: new Date(),
      update_at: new Date(),
      image_preview: imageUrl, // Lưu URL hình ảnh
    });

    return NextResponse.json({ message: "Project created successfully", project: newProject });

  } catch (error) {
    return OnErrorReturn(error);
  }
}

