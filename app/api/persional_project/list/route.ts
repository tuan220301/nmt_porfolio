import { cookies } from "next/headers";
import { CheckTokenInCookies, OnErrorReturn } from "../../config";

export async function GET() {
  try {
    return CheckTokenInCookies(async (decoded) => {
      return new Response(
        JSON.stringify({ message: "Authenticate successfully", user: decoded }),
        { status: 200 }
      );
    });
  } catch (error) {
    return OnErrorReturn(error);
  }
}

