import { Editor } from "@tiptap/react"
import { RefObject } from "react"

export type LoginFormType = {
  email: string,
  password: string
}
export type LoginResponeType = {
  email: string,
  password: string,
  _id: string
}
export type ProjectResponseType = {
  title: string,
  content: string,
  user_id: string,
  create_at: Date,
  update_at: Date,
  image_preview: string
}
export type ResponseApiType<T> = {
  data: T,
  isSuccess: boolean,
  message: string
}



