import { connectDB } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../models/users";
import { OnErrorReturn } from "../../config";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, email, password } = await req.json();

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return OnErrorReturn("Email has been used !!!");
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return new Response(JSON.stringify({ message: "Đăng ký thành công!" }), { status: 201 });
  } catch (error) {
    return OnErrorReturn(error);
  }
}

