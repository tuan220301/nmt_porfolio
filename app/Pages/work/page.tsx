/* eslint-disable @next/next/no-img-element */
"use client";

import { IsMobileAtom } from "@/app/Atom/IsMobile";
import React, { useEffect, useMemo, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Link from "next/link";
import { LoggedAtom } from "@/app/Atom/IsLogged";
import ButtonIconComponent from "@/app/Components/ButtonIconComponent";
import { useRouter } from "next/navigation";
import { WorkPageDetailData, WorkPageDetailStatus } from "@/app/Atom/WorkAtom";
import { ProjectResponseType } from "@/app/Ults";
import { LoadingAtom } from "@/app/Atom/IsLoading";
import { ToastAtom } from "@/app/Atom/ToastAtom";
import { ResponseApi } from "@/app/api/models/response";
import { useApi } from "@/app/hooks/useApi";
type ProjecType = {
  id: number;
  img: string;
  title: string;
  desc: string;
  url: string;
};
const AboutPage = () => {
  const router = useRouter();
  const isMobileAtom = useRecoilValue(IsMobileAtom);
  const isLoggedAtom = useRecoilValue(LoggedAtom);
  const setLoadingAtom = useSetRecoilState(LoadingAtom);
  const setToastAtom = useSetRecoilState(ToastAtom);
  const setWorkDetailStatus = useSetRecoilState(WorkPageDetailStatus);
  const { callApi } = useApi();
  const setProjectDataAtom = useSetRecoilState(WorkPageDetailData);
  const [listProject, setListProject] = useState<ProjectResponseType[]>([]);
  useEffect(() => {
    setProjectDataAtom({
      content: '',
      image_preview: '',
      title: '',
      create_at: new Date(),
      update_at: new Date(),
    } as ProjectResponseType)
    handleGetListProject();
  }, [])
  const handleGetListProject = async () => {
    setLoadingAtom(true);
    try {
      const projectResponse: ResponseApi<ProjectResponseType[]> = await callApi('/persional_project/list', "GET");
      if (projectResponse && projectResponse.isSuccess) {
        setToastAtom({
          isOpen: true,
          isAutoHide: true,
          message: projectResponse.message,
          status: 'SUCCESS'
        })
        console.log('project list data: ', projectResponse.data);
        if (projectResponse.data) {
          setListProject(projectResponse.data);
        }
      } else {
        setLoadingAtom(false);
        setToastAtom({
          isOpen: true,
          isAutoHide: true,
          message: 'Get list error',
          status: 'ERROR'
        })
      }
    } catch (error: any) {
      setToastAtom({
        isOpen: true,
        isAutoHide: true,
        message: error.message,
        status: 'ERROR'
      })
    } finally {
      setLoadingAtom(false);
    }
  }
  const handleProjectAction = (item?: ProjectResponseType) => {
    if (item) {
      setProjectDataAtom(item);
      setWorkDetailStatus('EDIT')
      router.push("work/detail/[slug]")
    } else {
      setWorkDetailStatus('NEW');
      router.push("work/detail/[slug]")
    }
  }
  const ButtonAddProjectMemo = useMemo(() => {
    return (
      <>
        {
          isLoggedAtom ? <div>
            <ButtonIconComponent
              onClick={() => handleProjectAction()}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              }
            />
          </div>
            : <></>
        }
      </>
    )
  }, [isLoggedAtom])
  return (
    <div className={isMobileAtom ? 'w-full' : 'w-1/2'}>
      <div className="w-full flex items-center justify-center mb-6 text-center text-lg">
        Below are a few of my personal projects.Please click on each project for more information.
      </div>
      <div className={`w-full py-2 flex ${isLoggedAtom ? "items-center justify-between" : ""}`}>
        <div className={`flex flex-col justify-center ${isLoggedAtom ? "w-1/2" : "w-full"}`}>
          <div>
            <div className="text-xl font-bold">Personal project !!!</div>
            <div className="border-2 rounded-lg w-36 "></div>
          </div>
        </div>
        {ButtonAddProjectMemo}
      </div>
      <div className={`grid ${isMobileAtom ? 'grid-cols-1' : 'grid-cols-2'} gap-4 items-center w-full`}>
        {
          listProject.length > 0 && listProject.map((project: ProjectResponseType) => {
            return (
              <button
                onClick={() => handleProjectAction(project)}

                key={project._id}
                className="border rounded-lg w-full flex flex-col h-80 items-center p-2 gap-4">
                <div className="h-[55%] w-1/2">
                  <div className="text-xl text-center py-2">
                    <p className="font-bold">{project.title}</p>
                  </div>
                  <img src={project.image_preview} alt="img"
                    className="w-full h-full max-h-[100px] object-cover" />
                </div>
                <div className="h-[40%]">
                  <div>
                    <p>{project.des}</p>
                  </div>
                </div>
              </button>
            )
          })
        }
      </div>
    </div>
  );
};
export default AboutPage;
