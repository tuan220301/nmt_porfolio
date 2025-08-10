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

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        cache: "no-store", // 🚀 Luôn lấy dữ liệu mới
        headers: isFormData
          ? { "Cache-Control": "no-store" } // Không set Content-Type khi là FormData
          : {
              "Content-Type": "application/json",
              "Cache-Control": "no-store", // 🚀 Ngăn cache CDN & browser
            },
        credentials: "include", // Gửi cookie chứa token
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
