// app/api/image/[fileId]/route.ts
import { getGridFSBucket } from "@/app/lib/gridfs";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { OnErrorReturn } from "@/app/api/config";

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } },
) {
  try {
    const bucket = await getGridFSBucket();
    if (!bucket) {
      return OnErrorReturn("Failed to initialize GridFSBucket");
    }

    const { fileId } = params;
    if (!fileId) {
      return OnErrorReturn("File ID is required");
    }

    const objectId = new ObjectId(fileId);
    const stream = bucket.openDownloadStream(objectId);

    return new Response(stream as any, {
      headers: {
        "Content-Type": "image/jpeg", // Bạn có thể lưu contentType thực tế khi upload
        "Cache-Control": "public, max-age=86400", // Cache 1 ngày
      },
    });
  } catch (error: any) {
    console.error("Error retrieving image:", error);
    return OnErrorReturn(error);
  }
}
