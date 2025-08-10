import mongoose, { Schema, Document } from "mongoose";

export interface IPersonalProject extends Document {
  title: string;
  des: string;
  content: string;
  create_at: Date;
  update_at: Date;
  user_id: mongoose.Schema.Types.ObjectId;
  image_preview: string; // Lưu ObjectID của ảnh trong GridFS
}

const PersonalProjectSchema = new Schema<IPersonalProject>({
  title: { type: String, required: true },
  des: { type: String, required: true },
  content: { type: String, required: true },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  image_preview: { type: String, required: false }, // Lưu ID ảnh từ GridFS
});
const PersonalProject =
  mongoose.models.PersonalProject ||
  mongoose.model<IPersonalProject>("PersonalProject", PersonalProjectSchema);

export default PersonalProject;
