"use client";
import { useSearchParams } from "next/navigation";

const WorkDetail = () => {
  const searchParams = useSearchParams()

  const search = searchParams.get('idBlog');
  console.log('idblog: ', search)
  return (
    <p>detail</p>
  )
}

export default WorkDetail
