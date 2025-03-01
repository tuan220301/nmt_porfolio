import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ResponseApi } from "../../models/response";

export async function GET() {
  const token = cookies().get("token")?.value || null;

  const response: ResponseApi<boolean> = {
    message: 'Get cookies successfully !!!',
    isSuccess: true,
    data: token ? true : false
  }

  return NextResponse.json(response);
}

