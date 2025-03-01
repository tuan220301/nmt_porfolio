/* eslint-disable @next/next/no-img-element */
"use client";

import { IsMobileAtom } from "@/app/Atom/IsMobile";
import React, { useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Link from "next/link";
import { LoggedAtom } from "@/app/Atom/IsLogged";
import ButtonIconComponent from "@/app/Components/ButtonIconComponent";
import { useRouter } from "next/navigation";
import { WorkPageDetailStatus } from "@/app/Atom/WorkAtom";
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
  const setWorkDetailStatus = useSetRecoilState(WorkPageDetailStatus);
  const projectList: ProjecType[] = [
    { id: 1, url: "work/detail/loataixuong(admin)", img: '/img/loataixuong(admin).png', title: 'Loa tai xuong (admin)', desc: 'Effortlessly manage inventory, track sales performance, and enhance customer satisfaction with our comprehensive speaker management solution' },
    { id: 2, url: "work/detail/loataixuong(client)", img: '/img/loataixuong.png', title: 'Loa tai xuong (customer)', desc: 'A customer-centric website designed for an optimal user experience, with a focus on SEO and a user-friendly interface.' },
    { id: 3, url: "work/detail/Sentiment_analysis_website", img: '/img/Sentiment_analysis_website.png', title: 'Sentiment analysis website', desc: 'This website uses computer vision to analyze emotions from webcam footage. It calculates the percentage of each emotion expressed by the person being filmed during the video recording and displays the results in a chart.' },
    { id: 4, url: "work/detail/HaiNam", img: '/img/HaiNamMain.jpg', title: 'Hai Nam', desc: 'This is a project about an Android mobile app used for scanning QR code information to support warehouse import and export needs, as well as inventory management, product information entry for different stages, and label printing.' },
  ];
  const handleProjectAction = (action: string) => {
    if (action === 'create') {
      setWorkDetailStatus('NEW');
      router.push("work/detail/[slug]")
    } else {
      setWorkDetailStatus('EDIT')
      router.push("work/detail/[slug]")
    }
  }
  const ButtonAddProjectMemo = useMemo(() => {
    return (
      <>
        {
          isLoggedAtom ? <div>
            <ButtonIconComponent
              onClick={() => handleProjectAction('create')}
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
          projectList.map((project: ProjecType) => {
            return (
              <Link
                href={{
                  pathname: project.url, query: {
                    idBlog: project.id
                  }
                }}
                key={project.id}
                className="border rounded-lg w-full flex flex-col h-80 items-center p-2 gap-4">
                <div className="h-[40%] w-1/2">
                  <img src={project.img} alt="img"
                    className="w-full h-full max-h-[100px] object-cover" />
                </div>
                <div className="h-[58%]">
                  <div className="text-xl text-center">
                    <p className="font-bold">{project.title}</p>
                  </div>
                  <div className="text-xl">
                    <p className="text-[14px]">{project.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })
        }
      </div>
    </div>
  );
};
export default AboutPage;
