export type ResponseApi<T> = {
  message: string,
  isSuccess: boolean,
  data?: T
}
