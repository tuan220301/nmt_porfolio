import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import PersonalProject from "../../models/personalProject";
import { OnErrorReturn } from "../../config";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const projects = await PersonalProject.find()
      .sort({ create_at: -1 })
      .lean();

    // Thay vì đọc ảnh từ GridFS → chỉ trả URL
    const projectsWithImageUrl = projects.map((project) => {
      let image_url = null;
      if (project.image_preview) {
        const fileId = project.image_preview.toString();
        image_url = `/api/image/${fileId}`;
      }
      return {
        ...project,
        image_url,
      };
    });

    const res = NextResponse.json(
      {
        isSuccess: true,
        message: "Get list project successfully",
        data: projectsWithImageUrl,
      },
      { status: 200 },
    );

    // Chặn cache hoàn toàn phía server & proxy
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");

    return res;
  } catch (error) {
    return OnErrorReturn(error);
  }
}
