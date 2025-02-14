import mongoose, { Schema, Document } from "mongoose";

export type UserResponse = {
  _id: string,
  userName: string,
  email: string,
  password: string,
}
//INFO: create interface user
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

//INFO: create Schema in mongoose
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


//INFO: check schema user is exeted ? if not create new
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

