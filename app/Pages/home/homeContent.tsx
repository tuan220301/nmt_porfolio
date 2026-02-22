/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef, use } from "react";
import Image from 'next/image';
import './home.css';
import { useRecoilValue } from "recoil";
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import { useApi } from "@/app/hooks/useApi";
import { saveAs } from 'file-saver';
const HomeContent = () => {
  const isMobileState = useRecoilValue(IsMobileAtom);
  const { callApi } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  // Fetch CV URL on component mount
  useEffect(() => {
    const fetchCvUrl = async () => {
      try {
        setIsLoading(true);
        setCvError(null);

        const urlData = await callApi('/api/cv/get', 'GET');
        console.log('[homeContent] CV API response:', urlData);

        if (urlData.isSuccess && urlData.data) {

          console.log('[homeContent] CV URL fetched successfully:', urlData.data);
          setCvUrl(urlData.data);
          setCvError(null);
        } else {
          console.error('[homeContent] Invalid response from CV API:', urlData);
          setCvError(urlData.message || 'Failed to fetch CV URL');
        }
      } catch (error: any) {
        console.log('[homeContent] CV not available (no file uploaded yet):', error.message);
        setCvError('No CV uploaded yet. Please login and upload your CV in the Contact page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCvUrl();
  }, []);

  useEffect(() => {
    console.log('[homeContent] CV URL state updated:', cvUrl);
  }, [cvUrl]);

  const ExportPDF = async () => {
    if (isLoading || !cvUrl) return;

    try {
      setIsLoading(true);
      console.log('[homeContent] ExportPDF: Downloading CV from URL:', cvUrl);

      // Download CV from API endpoint (avoids CORS issues)
      const cvResponse = await fetch('/api/cv/download');

      if (!cvResponse.ok) {
        console.error('[homeContent] Failed to download CV from S3:', cvResponse.status);
        throw new Error('Failed to download CV from S3');
      }

      const blob = await cvResponse.blob();
      console.log('[homeContent] CV downloaded successfully, blob info:', {
        size: blob.size,
        type: blob.type,
      });



      // Trigger download using multiple approaches for compatibility
      try {
        console.log('[homeContent] Calling saveAs to trigger download...');

        // Approach 1: Use file-saver saveAs
        saveAs(new Blob([blob], { type: 'application/pdf' }), 'NguyenMinhTuan_CV.pdf');
        console.log('[homeContent] saveAs completed successfully');
      } catch (saveError) {
        console.error('[homeContent] saveAs error, trying alternative approach:', saveError);

        // Approach 2: Fallback to URL + anchor tag
        try {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'NguyenMinhTuan_CV.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log('[homeContent] Fallback download method completed');
        } catch (fallbackError) {
          console.error('[homeContent] Fallback method also failed:', fallbackError);
          throw fallbackError;
        }
      }
    } catch (error) {
      console.error('[homeContent] Error exporting CV:', error);
      alert('Failed to download CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="text-lg flex flex-col items-center gap-5 ">
      <div className={`p-2 flex gap-2 justify-between items-center ${isMobileState ? 'w-full' : 'w-4/5'}`}>
        <div className="flex flex-col gap-2">
          <p className="text-2xl">Ngyễn Minh Tuấn</p>
          <p>Software engineer</p>
          <div className="w-full items-center">
            {cvError ? (
              <div className="text-sm text-red-500 dark:text-red-400 mb-2">
                {cvError}
              </div>
            ) : null}
            <button
              onClick={ExportPDF}
              disabled={isLoading || !cvUrl}
              className="hover-border border-2 border-transparent rounded-md px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed">
              <p>
                {(isLoading) ? 'Loading...' : 'My CV'}
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
};
export default HomeContent;
