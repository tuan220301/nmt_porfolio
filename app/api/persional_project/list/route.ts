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
      .sort({ pin: -1, create_at: -1 }) // Pin first, then by create_at
      .lean();

    const projectsWithImageUrl = projects.map((project) => {
      let image_preview = null;
      if (project.image_preview) {
        let url = project.image_preview.toString();

        // Fix malformed URLs
        // Case 1: https:nmt-... → https://nmt-...
        if (url.startsWith('https:') && !url.startsWith('https://')) {
          url = url.replace('https:', 'https://');
        }
        // Case 2: nmt-... (no scheme) → https://nmt-...
        else if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        image_preview = url;
      }
      return {
        ...project,
        image_preview,
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
