"use client";

import { LoadingAtom } from "@/app/Atom/IsLoading";
import { LoggedAtom } from "@/app/Atom/IsLogged";
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import { ToastAtom } from "@/app/Atom/ToastAtom";
import { WorkPageDetailData, WorkPageDetailStatus } from "@/app/Atom/WorkAtom";
import ButtonIconComponent from "@/app/Components/ButtonIconComponent";
import InputComponent from "@/app/Components/Input";
import DeleteProjectModal from "@/app/Components/Modals/DeleteModal";
import Tiptap from "@/app/Components/Tiptap/Tiptap";
import UploadAndDisplayImage from "@/app/Components/UploadImage";
import { ProjectResponseType } from "@/app/Ults";
import { ResponseApi } from "@/app/api/models/response";
import { API_BASE_URL, useApi } from "@/app/hooks/useApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const DetailProject = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<any>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [des, setDes] = useState("");
  const isMobileAtom = useRecoilValue(IsMobileAtom);
  const isLogedAtom = useRecoilValue(LoggedAtom);
  const workPageStatus = useRecoilValue(WorkPageDetailStatus);
  const [workPageDataAtom, setWorkPageDataAtom] =
    useRecoilState(WorkPageDetailData);
  const [isEdit, setIsEdit] = useState(false);
  const setLoadingAtom = useSetRecoilState(LoadingAtom);
  const setToastAtom = useSetRecoilState(ToastAtom);
  const { callApi } = useApi();
  const router = useRouter();

  useEffect(() => {
    const fetchImage = async () => {
      if (workPageStatus === "EDIT" && workPageDataAtom.image_preview) {
        console.log("work page detail: ", workPageDataAtom);

        // Chuyển URL ảnh từ API thành File
        const file_img = await urlToFile(
          API_BASE_URL.slice(0, -4) + workPageDataAtom.image_preview,
        );
        setDes(workPageDataAtom.des ?? "");
        setImage(file_img);
        setContent(workPageDataAtom.content);
        setTitle(workPageDataAtom.title);
      } else {
        setImage(null);
        setContent("");
        setTitle("");
        setDes("");
      }
    };

    fetchImage();
  }, [workPageStatus, workPageDataAtom]);

  const urlToFile = async (url: string, fileName?: string): Promise<File> => {
    const response = await fetch(url, { credentials: "include" }); // Gửi kèm cookie nếu cần
    const blob = await response.blob(); // Chuyển dữ liệu thành Blob
    const ext = blob.type.split("/")[1] || "jpg"; // Lấy đuôi file từ mime type
    const finalFileName = fileName || url.split("/").pop() || `image.${ext}`;

    return new File([blob], finalFileName, { type: blob.type });
  };
  const handleSave = async () => {
    setLoadingAtom(true);
    let user_id = "";
    user_id = localStorage.getItem("user_id") || "";
    const formData = new FormData();
    if (user_id !== "") {
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", image);
      formData.append("user_id", user_id);
      formData.append("des", des);
      if (workPageStatus === "EDIT") {
        formData.append("project_id", workPageDataAtom._id ?? "");
      }
      console.log("FormData contents:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      const projectResponse: ResponseApi<ProjectResponseType> = await callApi(
        workPageStatus === "EDIT"
          ? "/persional_project/edit"
          : "/persional_project/create",
        "POST",
        formData,
      );
      if (projectResponse && projectResponse.isSuccess) {
        setToastAtom({
          isOpen: true,
          message: projectResponse.message,
          isAutoHide: true,
          status: "SUCCESS",
        });

        setLoadingAtom(false);
        router.push("/Pages/work"); // Chuyển hướng khi token hết hạn
      } else {
        setLoadingAtom(false);
        setToastAtom({
          isOpen: true,
          message: projectResponse.message,
          isAutoHide: true,
          status: "ERROR",
        });
      }
    } else {
      setLoadingAtom(false);
      setToastAtom({
        isOpen: true,
        status: "ERROR",
        message: "Token is invalid please login again",
        isAutoHide: true,
      });
    }
  };

  const handleDelete = async () => {
    setDeleteModalOpen(false);
    setLoadingAtom(true);

    const response = await callApi(
      `/persional_project/delete?project_id=${workPageDataAtom._id}`,
      "DELETE",
      { project_id: workPageDataAtom._id },
    );

    if (response?.isSuccess) {
      setToastAtom({
        isOpen: true,
        message: "Project deleted",
        status: "SUCCESS",
        isAutoHide: true,
      });
      setLoadingAtom(false);
      router.push("/Pages/work");
    } else {
      setLoadingAtom(false);
      setToastAtom({
        isOpen: true,
        message: response?.message || "Failed to delete",
        status: "ERROR",
        isAutoHide: true,
      });
    }
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleChangeDes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDes(e.target.value);
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };
  const TitleInputMemo = useMemo(() => {
    return (
      <div>
        <div className="font-bold text-lg">Title</div>
        <InputComponent
          onChangeText={handleChangeTitle}
          value={title}
          type="text"
          isShowBorder={isEdit}
        />
      </div>
    );
  }, [title, isEdit]);
  const DesInputMemo = useMemo(() => {
    return (
      <div>
        <div className="font-bold text-lg">Desciption</div>
        <InputComponent
          onChangeText={handleChangeDes}
          value={des}
          type="text"
          isShowBorder={isEdit}
        />
      </div>
    );
  }, [des, isEdit]);

  const UpLoadImageMemo = useMemo(() => {
    return (
      <div>
        <div className="py-2 font-bold text-lg">Image </div>
        <UploadAndDisplayImage
          setSelectedImage={setImage}
          selectedImage={image}
        />
      </div>
    );
  }, [image, workPageStatus]);
  const EditorMemo = useMemo(() => {
    return (
      <div>
        <div className="font-bold text-lg px-2">Content</div>
        <Tiptap
          content={content}
          onChangeContent={setContent}
          isBorder={isEdit}
        />
      </div>
    );
  }, [content, isEdit]);
  if (isMobileAtom) {
    return (
      <div className="w-full h-auto text-center">
        <h1>This page is not support on mobile</h1>
      </div>
    );
  }
  return (
    <div className="w-2/3 h-full">
      <div className="flex flex-row justify-between items-center">
        <div>
          <p className="text-xl font-bold">{`${workPageStatus === "EDIT" ? "Detail Project!!!" : "New Project !!!"}`}</p>
          <div className="border-2 rounded-lg w-24"></div>
        </div>
        <div className="p-2">
          {isLogedAtom && (
            <div className="flex items-center gap-2">
              {workPageStatus === "EDIT" && (
                <ButtonIconComponent
                  title="Delete"
                  icon={
                    <div className="text-lg ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Z" />
                        <path
                          fillRule="evenodd"
                          d="M13 6H3v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6ZM5.72 7.47a.75.75 0 0 1 1.06 0L8 8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06L9.06 9.75l1.22 1.22a.75.75 0 1 1-1.06 1.06L8 10.81l-1.22 1.22a.75.75 0 0 1-1.06-1.06l1.22-1.22-1.22-1.22a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  }
                  onClick={() => setDeleteModalOpen(true)}
                />
              )}
              <ButtonIconComponent
                title="Edit"
                icon={
                  <div className="text-lg ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M12.146 1.854a.5.5 0 0 1 .708 0l1.292 1.292a.5.5 0 0 1 0 .708l-8.5 8.5a.5.5 0 0 1-.168.11l-3 1a.5.5 0 0 1-.65-.65l1-3a.5.5 0 0 1 .11-.168l8.5-8.5Z" />
                      <path
                        fillRule="evenodd"
                        d="M11.207 2.5 13.5 4.793 12.793 5.5 10.5 3.207 11.207 2.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                }
                onClick={handleEdit}
              />
              <ButtonIconComponent
                title="Save"
                icon={
                  <div className="text-lg ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm1 2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.28.53L8 9.06l-1.72 1.72A.75.75 0 0 1 5 10.25v-6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                }
                onClick={handleSave}
              />
            </div>
          )}
        </div>
      </div>
      <div className="p-2">{TitleInputMemo}</div>
      <div className="p-2">{DesInputMemo}</div>

      <div className="p-2">{UpLoadImageMemo}</div>
      {EditorMemo}
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
export default DetailProject;
