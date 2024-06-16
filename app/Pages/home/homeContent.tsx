import React from "react";
import Image from 'next/image'
import './home.css'
import { useRecoilValue } from "recoil";
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import { saveAs } from 'file-saver';
const HomeContent = () => {
  const isMobileState = useRecoilValue(IsMobileAtom);

  const ExportPDF = async () => {
    try {
      const response = await fetch('/img/pdf/my_cv.pdf');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      saveAs(blob, 'NguyenMinhTuan_CV.pdf');
    } catch (error) {
      console.error('Error fetching the PDF:', error);
    }
  };
  return (
    <div className="text-lg flex flex-col items-center gap-5 ">
      <div className={`p-2 flex gap-2 justify-between items-center ${isMobileState ? 'w-full' : 'w-4/5'}`}>
        <div className="flex flex-col gap-2">
          <p className="text-2xl">Ngyễn Minh Tuấn</p>
          <p>Software engineer</p>
          <div className="w-full items-center">
            <button
              onClick={ExportPDF}
              className="hover-border border-2 border-transparent rounded-md px-4 py-2">
              <p>
                My CV
              </p>
            </button>
          </div>
        </div>
        <div>
          <Image
            className="inline-block rounded-full ring-2 ring-white"
            width={100}
            height={100}
            src="/img/avatar.jpg" alt="avatar" />
        </div>
      </div>
      <div className=" font-bold w-4/5">
        <p>Resume !!!</p>
        <div className="border-2 border-gray-500 dark:border-grey-100 rounded-lg w-14"></div>
      </div>
      <div className="w-4/5">
        <p className="mb-4">
          My name is Nguyễn Minh Tuấn, a Fullstack Developer with expertise in developing cross-platform applications for both IOS and Android. Additionally, I possess strong web development skills.
        </p>
        <ol className="relative border-s border-gray-500 dark:border-gray-700">
          <li className="ms-4">
            <div className="absolute w-3 h-3 bg-gray-500 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm leading-none text-gray-400 dark:text-gray-500">August 2019</time>
            <h3 className="text-lg text-gray-900 dark:text-white">University Information Technology</h3>
            {/* <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400"> */}
            {/*   During my four years at this institution, I have gained a solid foundation in software technologies and developed essential soft skills such as teamwork, time management, and self-directed learning. */}
            {/* </p> */}
            {/* <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">Learn more <svg className="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"> */}
            {/*   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" /> */}
            {/* </svg></a> */}
          </li>
          <li className="ms-4">
            <div className="absolute w-3 h-3 bg-gray-500 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">July 2021</time>
            <h3 className="text-lg text-gray-900 dark:text-white">Logisoft</h3>
            <p className="text-base text-gray-500 dark:text-gray-400">
              Frontend Partime
            </p>
          </li>
          <li className="ms-4">
            <div className="absolute w-3 h-3 bg-gray-500 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm leading-none text-gray-400 dark:text-gray-500">March 2023</time>
            <h3 className="text-lg  text-gray-900 dark:text-white">Hanbiro</h3>
            <p className="text-base text-gray-500 dark:text-gray-400">Frontend Intern</p>
          </li>
          <li className="ms-4">
            <div className="absolute w-3 h-3 bg-gray-500 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm leading-none text-gray-400 dark:text-gray-500">August 2023</time>
            <h3 className="text-lg  text-gray-900 dark:text-white">Patsoft</h3>
            <p className="text-base text-gray-500 dark:text-gray-400">
              Software engineer
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}
export default HomeContent;
