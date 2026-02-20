import { Editor } from "@tiptap/react";
import { RefObject } from "react";

export type LoginFormType = {
  email: string,
  password: string;
};
export type LoginResponeType = {
  email: string,
  password: string,
  _id: string;
};

export type ContentBlock = {
  index: number;
  type: 'text' | 'image' | 'heading';
  content: string;
  imageUrl?: string;
};

export type ProjectResponseType = {
  _id?: string,
  title: string,
  des?: string,
  contents: ContentBlock[], // Changed from content: string
  user_id: string,
  create_at: Date,
  update_at: Date,
  image_preview: string,
  image_url: string,
};
export type ResponseApiType<T> = {
  data: T,
  isSuccess: boolean,
  message: string;
}



