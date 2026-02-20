import mongoose, { Schema, Document } from "mongoose";

export interface IContentBlock extends Document {
  index: number;
  type: 'text' | 'image' | 'heading';
  content: string; // HTML content for text/heading blocks
  imageUrl?: string; // S3 URL for image blocks
}

export interface IPersonalProject extends Document {
  title: string;
  des: string;
  contents: IContentBlock[]; // Array of content blocks (Notion-like structure)
  create_at: Date;
  update_at: Date;
  user_id: mongoose.Schema.Types.ObjectId;
  image_preview: string; // Store S3 URL of the preview image
}

const ContentBlockSchema = new Schema<IContentBlock>({
  index: { type: Number, required: true },
  type: { type: String, enum: ['text', 'image', 'heading'], required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: false },
});

const PersonalProjectSchema = new Schema<IPersonalProject>({
  title: { type: String, required: true },
  des: { type: String, required: true },
  contents: { type: [ContentBlockSchema], required: true, default: [] },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  image_preview: { type: String, required: false }, // Store S3 image URL
});
const PersonalProject =
  mongoose.models.PersonalProject ||
  mongoose.model<IPersonalProject>("PersonalProject", PersonalProjectSchema);

export default PersonalProject;
