import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import PersonalProject from "../../models/personalProject";
import { CheckTokenInCookies, OnErrorReturn } from "../../config";

export async function GET(req: NextRequest) {
  return CheckTokenInCookies(async () => {
    try {
      await connectDB(); // Kết nối MongoDB

      const projects = await PersonalProject.find().sort({ created_at: -1 }).lean();

      return NextResponse.json({ message: "Success", data: projects }, { status: 200 });
    } catch (error) {
      return OnErrorReturn(error);
    }
  });
}
