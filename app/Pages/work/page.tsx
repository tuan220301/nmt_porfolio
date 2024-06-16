/* eslint-disable @next/next/no-img-element */
"use client";

import { IsMobileAtom } from "@/app/Atom/IsMobile";
import React from "react";
import { useRecoilValue } from "recoil";
import Link from "next/link";
type ProjecType = {
  id: number;
  img: string;
  title: string;
  desc: string;
  url: string;
};
const AboutPage = () => {
  const isMobileAtom = useRecoilValue(IsMobileAtom);

  const projectList: ProjecType[] = [
    { id: 1, url: "work/detail/loataixuong(admin)", img: '/img/loataixuong(admin).png', title: 'Loa tai xuong (admin)', desc: 'Effortlessly manage inventory, track sales performance, and enhance customer satisfaction with our comprehensive speaker management solution' },
    { id: 2, url: "work/detail/loataixuong(client)", img: '/img/loataixuong.png', title: 'Loa tai xuong (customer)', desc: 'A customer-centric website designed for an optimal user experience, with a focus on SEO and a user-friendly interface.' },
    { id: 3, url: "work/detail/Sentiment_analysis_website", img: '/img/Sentiment_analysis_website.png', title: 'Sentiment analysis website', desc: 'This website uses computer vision to analyze emotions from webcam footage. It calculates the percentage of each emotion expressed by the person being filmed during the video recording and displays the results in a chart.' },
  ];

  return (
    <div className={isMobileAtom ? 'w-full' : 'w-1/2'}>
      <div className="w-full flex items-center justify-center mb-6 text-center text-lg">
        Below are a few of my personal projects.Please click on each project for more information.
      </div>
      <p className="text-xl font-bold">Personal project !!!</p>
      <div className="border-2 rounded-lg w-36 mb-4"></div>
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
                key={project.id} className="border rounded-lg w-full flex flex-col h-80 items-center p-2 gap-4">
                <div className="h-1/2 w-1/2">
                  <img src={project.img} alt="img" className="w-full h-full object-cover" />
                </div>
                <div className="text-xl">
                  <p className="font-bold">{project.title}</p>
                </div>
                <div className="text-xl">
                  <p className="">{project.desc}</p>
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
