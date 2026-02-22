import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { ResponseApi } from "../../models/response";

const CLOUDFLARE_R2_URL = process.env.CLOUDFLARE_R2_URL || "";
const CLOUDFLARE_ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID || "";
const CLOUDFLARE_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "";
const CLOUDFLARE_BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || "";
const CLOUDFLARE_PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL || "";

const createS3Client = () => {
    const http = require("http");
    const https = require("https");

    const clientConfig: any = {
        region: "auto",
        endpoint: CLOUDFLARE_R2_URL,
        credentials: {
            accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
            secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
        },
        httpAgent: new http.Agent({ keepAlive: false, maxSockets: 1 }),
        httpsAgent: new https.Agent({ keepAlive: false, maxSockets: 1 }),
    };

    const client = new S3Client(clientConfig);
    return client;
};

const getS3Client = () => createS3Client();

export async function GET(req: NextRequest) {
    let response: ResponseApi<string> = {
        message: '',
        isSuccess: false
    };

    try {
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`[cv/get/route.ts] START`);
        console.log(`${'═'.repeat(70)}`);

        // List objects in CV folder
        const listCommand = new ListObjectsV2Command({
            Bucket: CLOUDFLARE_BUCKET_NAME,
            Prefix: 'uploads/cv/',
        });

        console.log(`📋 [cv/get/route.ts] Listing files in CV folder...`);
        const client = getS3Client();
        const listResponse = await client.send(listCommand);

        console.log(`📦 [cv/get/route.ts] List response:`, {
            contentsCount: listResponse.Contents?.length || 0,
        });

        if (!listResponse.Contents || listResponse.Contents.length === 0) {
            console.warn(`⚠️ [cv/get/route.ts] No CV files found in CV folder`);
            response.message = "No CV file found";
            response.isSuccess = false;
            console.log(`${'═'.repeat(70)}\n`);
            return NextResponse.json(response, { status: 404 });
        }

        // Sort by date and get the latest file
        const sortedFiles = listResponse.Contents.sort((a, b) => {
            const timeA = a.LastModified?.getTime() || 0;
            const timeB = b.LastModified?.getTime() || 0;
            return timeB - timeA;
        });

        const latestFile = sortedFiles[0];
        if (!latestFile.Key) {
            console.error(`❌ [cv/get/route.ts] No file key found`);
            return NextResponse.json(response, { status: 500 });
        }

        const cvUrl = `${CLOUDFLARE_PUBLIC_URL}/${latestFile.Key}`;

        console.log(`✅ [cv/get/route.ts] Found latest CV file:`, {
            fileName: latestFile.Key,
            size: latestFile.Size,
            lastModified: latestFile.LastModified,
            url: cvUrl,
        });

        response.message = "CV URL retrieved successfully";
        response.isSuccess = true;
        response.data = cvUrl;

        console.log(`✅ [cv/get/route.ts] COMPLETE - Returning CV URL`);
        console.log(`${'═'.repeat(70)}\n`);

        return NextResponse.json(response);
    } catch (error) {
        console.error(`❌ [cv/get/route.ts] Error:`, error);
        response.message = "Failed to get CV URL: " + (error as Error).message;
        response.isSuccess = false;
        return NextResponse.json(response, { status: 500 });
    }
}
