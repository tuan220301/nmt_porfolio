"use client";
import React, { Suspense, useEffect, useState } from "react";
import Loading from "./Loading";
import Spline from "@splinetool/react-spline";

const IntroUI = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const resumeText = 'Wellcome to my porfolio ^^';
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < resumeText.length) {
        setDisplayText((prevText) => prevText + resumeText[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);
        setShowCursor(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, resumeText]);
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prevShowCursor) => !prevShowCursor);
    }, 890);
    return () => clearInterval(cursorInterval);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      <Suspense fallback={<Loading />}>
        <div className="w-60 h-60">
          <Spline scene="https://prod.spline.design/TmZ7maoJxxLFeBAI/scene.splinecode" />
        </div>

        <div className="flex w-80 items-center justify-center border-[1px] border-black dark:border-white rounded-lg px-4 py-2">
          {displayText}
          <div className="w-2">
            {showCursor || currentIndex !== resumeText.length ? '_' : null}
          </div>
        </div>
      </Suspense>
    </div>
  )
}
export default IntroUI;
