/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import LayOutDetail from "../layoutDetail/layoutDetail";
import { useRecoilValue } from "recoil";
import { IsMobileAtom } from "@/app/Atom/IsMobile";

const SentimentAnalysisWebsite = () => {
  const isMobileAtom = useRecoilValue(IsMobileAtom);

  return (
    <LayOutDetail title="Sentiment analysis website">
      <div className="w-full p-2">
        <img src={'/img/Sentiment_analysis_website.png'} alt="img" className="w-full h-full object-cover" />
      </div>
      <div className="mt-2">
        <h1>This website uses computer vision to analyze emotions from webcam footage. It calculates the percentage of each emotion expressed by the person being filmed during the video recording and displays the results in a chart.</h1>
      </div>
      <div className="pr-2">
        <p className="font-bold">Technologies Used:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Front End:
              </p>
              React.js, Recoil
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Emotion Recognition:
              </p>
              Face API </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Styling:
              </p>
              Tailwind CSS </div>
          </li>
        </ul>
        <p className="font-bold">Purpose:</p>
        <p>This is a small demo project to demonstrate the integration of Face API into React.js.</p>
        <div className={isMobileAtom ? "" : "flex items-center"}>
          <p className="font-bold">Url:</p>
          <a
            href="https://patsoft.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500 underline"
          >
            https://loataixuong.com
          </a>
        </div>
      </div>
    </LayOutDetail>
  );
};
export default SentimentAnalysisWebsite;
