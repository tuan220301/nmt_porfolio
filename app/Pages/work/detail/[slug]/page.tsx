"use client";

import { LoadingAtom } from "@/app/Atom/IsLoading";
import { LoggedAtom } from "@/app/Atom/IsLogged";
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import { ToastAtom } from "@/app/Atom/ToastAtom";
import { WorkPageDetailData, WorkPageDetailStatus } from "@/app/Atom/WorkAtom";
import ButtonIconComponent from "@/app/Components/ButtonIconComponent";
import InputComponent from "@/app/Components/Input";
import DeleteProjectModal from "@/app/Components/Modals/DeleteModal";
import UploadAndDisplayImage from "@/app/Components/UploadImage";
import MultiBlockEditor from "@/app/Components/Tiptap/MultiBlockEditor";
import { ContentBlock, ProjectResponseType } from "@/app/Ults";
import { ResponseApi } from "@/app/api/models/response";
import { useApi } from "@/app/hooks/useApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const DetailProject = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
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

  // Initialize with default block if editing existing project
  useEffect(() => {
    try {
      if (workPageStatus === "EDIT" && workPageDataAtom.image_preview) {
        console.log("work page detail: ", workPageDataAtom);

        // Use image_preview URL directly for preview
        setImage(workPageDataAtom.image_preview);
        setDes(workPageDataAtom.des ?? "");
        setTitle(workPageDataAtom.title ?? "");

        // Load existing blocks or create initial block
        if (workPageDataAtom.contents && workPageDataAtom.contents.length > 0) {
          setBlocks(workPageDataAtom.contents);
        } else {
          setBlocks([{ index: 0, type: "text", content: "" }]);
        }
      } else {
        // New project
        setImage(null);
        setTitle("");
        setDes("");
        setBlocks([{ index: 0, type: "text", content: "" }]);
      }
    } catch (error) {
      console.error("Failed to load project data:", error);
      setImage(null);
      setBlocks([{ index: 0, type: "text", content: "" }]);
    }
  }, [workPageStatus, workPageDataAtom]);

  const handleSave = async () => {
    setLoadingAtom(true);
    let user_id = "";
    user_id = localStorage.getItem("user_id") || "";
    const formData = new FormData();
    if (user_id !== "") {
      formData.append("title", title);
      formData.append("contents", JSON.stringify(blocks));

      // Only append preview image if it's a File (new upload), skip if it's a URL string
      if (image instanceof File) {
        formData.append("image", image);
      }

      formData.append("user_id", user_id);
      formData.append("des", des);

      if (workPageStatus === "EDIT") {
        formData.append("project_id", workPageDataAtom._id ?? "");
      }

      console.log("═══════════════════════════════════════════════════════════════════════");
      console.log("[DetailProject.handleSave] SAVING PROJECT");
      console.log("═══════════════════════════════════════════════════════════════════════");
      console.log("Saving project with data:");
      console.log(`- Title: ${title}`);
      console.log(`- Description: ${des}`);
      console.log(`- Content blocks: ${blocks.length}`);
      console.log(`- Preview image: ${image instanceof File ? 'New file' : image}`);

      // Log detailed block information
      console.log(`\n📦 [DetailProject.handleSave] Block contents to save:`);
      blocks.forEach((block, idx) => {
        const imageCount = (block.content.match(/<img/g) || []).length;
        console.log(`   Block ${idx} (index: ${block.index}, type: ${block.type}):`, {
          contentLength: block.content.length,
          imageCount: imageCount,
          hasContent: block.content !== '<p></p>' && block.content !== '',
          preview: block.content.substring(0, 80),
        });

        // Log image URLs in this block
        if (imageCount > 0) {
          const imageUrls = block.content.match(/src=["']([^"']+)["']/g) || [];
          console.log(`      📸 Image URLs (${imageCount}):`, imageUrls);
        }
      });

      const projectResponse: ResponseApi<ProjectResponseType> = await callApi(
        workPageStatus === "EDIT"
          ? "/api/persional_project/edit"
          : "/api/persional_project/create",
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

        console.log("✅ [DetailProject.handleSave] Project saved successfully!");
        console.log("═══════════════════════════════════════════════════════════════════════\n");
        setLoadingAtom(false);
        router.push("/Pages/work"); // Redirect after successful save
      } else {
        console.error("❌ [DetailProject.handleSave] Project save failed:", projectResponse?.message);
        console.log("═══════════════════════════════════════════════════════════════════════\n");
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
      `/api/persional_project/delete?project_id=${workPageDataAtom._id}`,
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
  }, [image]);

  const EditorMemo = useMemo(() => {
    console.log(`\n📋 [DetailProject.EditorMemo] Rendering MultiBlockEditor with:`, {
      projectTitle: title || "EMPTY",
      projectTitleTrimmed: title?.trim() || "EMPTY",
      projectTitleLength: title?.length || 0,
      isEdit,
      blockCount: blocks.length,
    });

    if (!title || title.trim() === '') {
      console.warn(`⚠️ [DetailProject.EditorMemo] WARNING: title is empty! Images will be stored without project folder organization`);
    }

    return (
      <div>
        <MultiBlockEditor
          blocks={blocks}
          onBlocksChange={setBlocks}
          isBorder={isEdit}
          projectTitle={title}
        />
      </div>
    );
  }, [blocks, isEdit, title]);

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
