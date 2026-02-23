import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import PersonalProject from "../../models/personalProject";
import { OnErrorReturn } from "../../config";

export const dynamic = "force-dynamic"; // 🚀 Buộc Next.js luôn chạy server-side mỗi lần gọi API
export const revalidate = 0; // 🚀 Không ISR, luôn fetch mới

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const projects = await PersonalProject.find()
      .sort({ create_at: -1 })
      .lean();

    const projectsWithImageUrl = projects.map((project) => {
      let image_url = null;
      if (project.image_preview) {
        const preview = project.image_preview.toString();
        // Fix malformed URLs (https: -> https://)
        if (preview.startsWith('https:') && !preview.startsWith('https://')) {
          image_url = preview.replace('https:', 'https://');
        } else {
          image_url = preview;
        }
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

    // 🚀 Chặn cache ở mọi tầng
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
