import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { ResponseApi } from "../../models/response";

const CLOUDFLARE_R2_URL = process.env.CLOUDFLARE_R2_URL || "";
const CLOUDFLARE_ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID || "";
const CLOUDFLARE_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "";
const CLOUDFLARE_BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || "";

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
    try {
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`[cv/download/route.ts] START`);
        console.log(`${'═'.repeat(70)}`);

        // List objects in CV folder
        const listCommand = new ListObjectsV2Command({
            Bucket: CLOUDFLARE_BUCKET_NAME,
            Prefix: 'uploads/cv/',
        });

        console.log(`📋 [cv/download/route.ts] Listing files in CV folder...`);
        let client = getS3Client();
        const listResponse = await client.send(listCommand);

        console.log(`📦 [cv/download/route.ts] Files found:`, {
            count: listResponse.Contents?.length || 0,
        });

        if (!listResponse.Contents || listResponse.Contents.length === 0) {
            console.warn(`⚠️ [cv/download/route.ts] No CV files found`);
            return new NextResponse('No CV file found', { status: 404 });
        }

        // Sort by date and get the latest file
        const sortedFiles = listResponse.Contents.sort((a, b) => {
            const timeA = a.LastModified?.getTime() || 0;
            const timeB = b.LastModified?.getTime() || 0;
            return timeB - timeA;
        });

        const latestFile = sortedFiles[0];
        if (!latestFile.Key) {
            console.error(`❌ [cv/download/route.ts] No file key found`);
            return new NextResponse('File key not found', { status: 500 });
        }

        console.log(`📥 [cv/download/route.ts] Downloading file from S3:`, {
            key: latestFile.Key,
            size: latestFile.Size,
        });

        // Get file from S3
        const getCommand = new GetObjectCommand({
            Bucket: CLOUDFLARE_BUCKET_NAME,
            Key: latestFile.Key,
        });

        client = getS3Client();
        const response = await client.send(getCommand);

        if (!response.Body) {
            console.error(`❌ [cv/download/route.ts] No body in response`);
            return new NextResponse('Failed to get file', { status: 500 });
        }

        // Convert stream to buffer
        const chunks: Uint8Array[] = [];
        const stream = response.Body as any;

        const buffer = await new Promise<Buffer>((resolve, reject) => {
            stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => {
                const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                const result = Buffer.allocUnsafe(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    result.set(chunk, offset);
                    offset += chunk.length;
                }
                resolve(result);
            });
        });

        console.log(`✅ [cv/download/route.ts] File downloaded successfully:`, {
            size: buffer.length,
            sizeKB: (buffer.length / 1024).toFixed(2),
        });

        console.log(`${'═'.repeat(70)}\n`);

        // Return PDF with proper headers
        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="NguyenMinhTuan_CV.pdf"',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error(`❌ [cv/download/route.ts] Error:`, error);
        return new NextResponse('Failed to download CV: ' + (error as Error).message, {
            status: 500,
        });
    }
}
