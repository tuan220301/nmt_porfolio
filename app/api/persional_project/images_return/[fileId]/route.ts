import { getImageFromS3 } from "@/app/lib/s3";
import { NextRequest } from "next/server";
import { OnErrorReturn } from "@/app/api/config";

// Placeholder SVG for missing images
const placeholderSVG = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="#e5e7eb"/>
  <text x="50%" y="50%" font-size="24" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
    Image not available
  </text>
</svg>`;

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string; }; },
) {
  try {
    // The fileId is now the full S3 URL key
    const decodedFileId = decodeURIComponent(params.fileId);

    if (!decodedFileId) {
      return new Response(placeholderSVG, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Get image from S3
    const imageBuffer = await getImageFromS3(decodedFileId);

    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400", // Cache 1 day
      },
    });
  } catch (error: any) {
    console.error("Error retrieving image from S3:", error);
    // Return placeholder image instead of error
    return new Response(placeholderSVG, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
