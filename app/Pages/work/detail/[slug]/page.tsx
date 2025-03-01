'use client'

import { LoadingAtom } from "@/app/Atom/IsLoading";
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import { ToastAtom } from "@/app/Atom/ToastAtom";
import { WorkPageDetailStatus } from "@/app/Atom/WorkAtom";
import ButtonIconComponent from "@/app/Components/ButtonIconComponent";
import InputComponent from "@/app/Components/Input";
import Tiptap from "@/app/Components/Tiptap/Tiptap"
import UploadAndDisplayImage from "@/app/Components/UploadImage";
import { ProjectResponseType } from "@/app/Ults";
import { ResponseApi } from "@/app/api/models/response";
import { useApi } from "@/app/hooks/useApi";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const DetailProject = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<any>(null);
  const isMobileAtom = useRecoilValue(IsMobileAtom);
  const workPageStatus = useRecoilValue(WorkPageDetailStatus);
  const setLoadingAtom = useSetRecoilState(LoadingAtom);
  const setToastAtom = useSetRecoilState(ToastAtom);
  const { callApi } = useApi();
  const router = useRouter();


  const handleSave = async () => {
    setLoadingAtom(true);
    let user_id = '';
    user_id = localStorage.getItem('user_id') || '';
    const formData = new FormData();
    if (user_id !== '') {
      formData.append('title', title);
      formData.append('image', image);
      formData.append('content', content);
      formData.append('user_id', user_id);
      console.log('FormData contents:');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      const projectResponse: ResponseApi<ProjectResponseType> = await callApi('/persional_project/create', "POST", formData);
      if (projectResponse && projectResponse.isSuccess) {
        setToastAtom({
          isOpen: true,
          message: projectResponse.message,
          isAutoHide: true,
          status: 'SUCCESS'
        })

        setLoadingAtom(false);
        router.push("/Pages/work"); // Chuyển hướng khi token hết hạn

      } else {
        setLoadingAtom(false);
        setToastAtom({
          isOpen: true,
          message: projectResponse.message,
          isAutoHide: true,
          status: 'ERROR'
        })
      }
    } else {
      setLoadingAtom(false);
      setToastAtom({
        isOpen: true,
        status: "ERROR",
        message: "Token is invalid please login again",
        isAutoHide: true
      })
    }
  }
  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }
  const TitleInputMemo = useMemo(() => {
    return (
      <div>
        <div className="font-bold text-lg">Title</div>
        <InputComponent onChangeText={handleChangeTitle} value={title} type="text" />
      </div>
    )
  }, [title])

  const UpLoadImageMemo = useMemo(() => {
    return (
      <div>
        <div className="py-2 font-bold text-lg">Image </div>
        <UploadAndDisplayImage setSelectedImage={setImage} selectedImage={image} />
      </div>
    )
  }, [image])
  const EditorMemo = useMemo(() => {
    return (
      <div>
        <div className="font-bold text-lg px-2">Content</div>
        <Tiptap content={content} onChangeContent={setContent} />
      </div>
    )
  }, [content])
  if (isMobileAtom) {
    return (
      <div className="w-full h-auto text-center">
        <h1>This page is not support on mobile</h1>
      </div>
    )
  }
  return (
    <div className="w-2/3 h-full">
      <div className="flex flex-row justify-between items-center">
        <div>
          <p className="text-xl font-bold">{`${workPageStatus === 'EDIT' ? 'Detail Project!!!' : 'New Project !!!'}`}</p>
          <div className="border-2 rounded-lg w-24"></div>
        </div>
        <div className="p-2">
          <ButtonIconComponent
            title="Save"
            icon={
              <div className="text-lg ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm1 2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.28.53L8 9.06l-1.72 1.72A.75.75 0 0 1 5 10.25v-6Z" clipRule="evenodd" />
                </svg>
              </div>
            }
            onClick={handleSave}
          />
        </div>
      </div>
      <div className="p-2">
        {TitleInputMemo}
      </div>
      <div className="p-2">
        {UpLoadImageMemo}
      </div>
      {EditorMemo}
    </div>
  )
}
export default DetailProject
