import { getGridFSBucket } from "@/app/lib/gridfs";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { CheckTokenInCookies, OnErrorReturn } from "@/app/api/config";

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    return CheckTokenInCookies(async (decoded) => {
      const bucket = await getGridFSBucket();
      if (!bucket) {
        return OnErrorReturn("Failed to initialize GridFSBucket");
      }

      const { fileId } = params;
      if (!fileId) {
        return OnErrorReturn("File ID is required");
      }

      const objectId = new ObjectId(fileId); // Chuyển đổi fileId thành ObjectId
      const stream = bucket.openDownloadStream(objectId);

      return new Response(stream as any, {
        headers: { "Content-Type": "image/jpeg" }, // Hoặc điều chỉnh loại MIME phù hợp với hình ảnh
      });
    });
  } catch (error: any) {
    console.error("Error retrieving image:", error);
    return OnErrorReturn(error);
  }
}

