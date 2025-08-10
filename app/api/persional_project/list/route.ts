// app/api/personal_project/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import PersonalProject from "../../models/personalProject";
import { OnErrorReturn } from "../../config";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const projects = await PersonalProject.find()
      .sort({ create_at: -1 }) // Sửa lại đúng tên field
      .lean();

    // Thay vì đọc ảnh từ GridFS → chỉ trả URL
    const projectsWithImageUrl = projects.map((project) => {
      let image_url = null;
      if (project.image_preview) {
        // Nếu image_preview là ObjectId → chuyển thành string
        const fileId = project.image_preview.toString();
        image_url = `/api/image/${fileId}`;
      }

      return {
        ...project,
        image_url,
      };
    });

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Get list project successfully",
        data: projectsWithImageUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    return OnErrorReturn(error);
  }
}
