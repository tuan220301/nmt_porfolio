import { cookies } from "next/headers";
import { ResponseApi } from "../models/response";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";

export const OnErrorReturn = (error: any, status: number = 500) => {
  const response: ResponseApi<string> = {
    message: `Get error: ${error}`,
    isSuccess: false,
  };
  return new Response(JSON.stringify(response), { status });
};

export const CheckTokenInCookies = async (
  callback: (decodedToken: any) => Promise<Response>,
) => {
  await connectDB();
  const token = cookies().get("token")?.value;

  if (!token) {
    return OnErrorReturn("Authentication failed", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret_key",
    );
  } catch (error) {
    return OnErrorReturn("Invalid or expired token", 401);
  }

  // Let callback errors bubble up to outer catch block
  return await callback(decoded);
};
