import { connectDB } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import User, { UserResponse } from "../../models/users";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // Import cookies từ Next.js
import { ResponseApi } from "../../models/response";

export async function POST(req: Request) {
  let response: ResponseApi<UserResponse> = {
    message: "",
    isSuccess: false,
  };

  try {
    await connectDB();
    const { email, password } = await req.json();

    // Kiểm tra user có tồn tại không
    const user = (await User.findOne({ email })) as UserResponse;
    if (!user) {
      response.message = "Email or password is not correct !!!";
      response.isSuccess = false;
      return new Response(JSON.stringify(response), { status: 400 });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      response.message = "Email or password is not correct !!!";
      response.isSuccess = false;
      return new Response(JSON.stringify(response), { status: 400 });
    }

    // Tạo token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "1h" }
    );

    // Lưu token vào cookie (HTTP Only để tránh XSS)
    cookies().set("token", token, {
      httpOnly: true,  // Bảo vệ khỏi JavaScript (tránh XSS)
      secure: process.env.NODE_ENV === "production", // Chỉ dùng HTTPS trên production
      sameSite: "strict", // Bảo vệ CSRF
      path: "/", // Áp dụng cho toàn bộ site
      maxAge: 3600, // Token hết hạn sau 1 giờ
    });

    response.message = "Login successful !!!";
    response.isSuccess = true;
    response.data = {
      _id: user._id,
      userName: user.userName,
      password: "",
      email: user.email,
    };

    return new Response(JSON.stringify(response), { status: 200 });

  } catch (error: any) {
    response.message = error.toString();
    response.isSuccess = false;
    return new Response(JSON.stringify(response), { status: 500 });
  }
}
