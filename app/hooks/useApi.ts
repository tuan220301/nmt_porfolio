"use client";

import { useRouter } from "next/navigation";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_URL_API || "http://localhost:3000";

export function useApi() {
  const router = useRouter();

  const callApi = async (
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
  ) => {
    try {
      const isFormData = body instanceof FormData;
      const noCacheUrl = `${API_BASE_URL}${endpoint}?t=${Date.now()}`;

      const response = await fetch(noCacheUrl, {
        method,
        cache: "no-store",
        headers: isFormData
          ? { "Cache-Control": "no-store" }
          : {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
        credentials: "include",
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      });
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/Pages/login"); // Token hết hạn → login lại
          return { error: "Unauthorized" };
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "API call failed");
      }

      return response.json();
    } catch (error: any) {
      console.error("API Error:", error.message);
      throw new Error(error.message);
    }
  };

  return { callApi };
}
