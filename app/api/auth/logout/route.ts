import { cookies } from "next/headers";
import { ResponseApi } from "../../models/response";

export async function POST() {
  cookies().set("token", "", { expires: new Date(0), path: "/" });
  const response: ResponseApi<string> = {
    message: 'Logged out successfully !!!',
    isSuccess: true,
  }
  return new Response(JSON.stringify(response), { status: 200 });
}

