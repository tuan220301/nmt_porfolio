import { NextRequest, NextResponse } from "next/server";
import { getGridFSBucket } from "@/app/lib/gridfs";
import { Readable } from "stream";
import { OnErrorReturn, CheckTokenInCookies } from "../../config"; // Giữ lại hàm xử lý lỗi
import { ResponseApi } from "../../models/response";

export async function POST(req: NextRequest) {
  let response: ResponseApi<string> = {
    message: '',
    isSuccess: false
  };

  try {
    return CheckTokenInCookies(async (decoded) => {
      const bucket = await getGridFSBucket();
      if (!bucket) {
        return OnErrorReturn("Failed to initialize GridFSBucket");
      }

      const formData = await req.formData();
      const file = formData.get("image") as File;

      if (!file) {
        return OnErrorReturn("No file uploaded");
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);
      const uploadStream = bucket.openUploadStream(file.name);

      return new Promise((resolve) => {
        uploadStream.on("finish", () => {
          response.message = "Upload success";
          response.isSuccess = true;
          response.data = uploadStream.id.toString();
          resolve(NextResponse.json(response));
        });

        uploadStream.on("error", (error) => {
          resolve(OnErrorReturn("Upload failed: " + error.message));
        });

        stream.pipe(uploadStream);
      });

    });

  } catch (error) {
    return OnErrorReturn("Unexpected error: " + error);
  }
}
