"use client";
import React from "react";
import LayOutDetail from "../layoutDetail/layoutDetail";
import { useRecoilValue } from "recoil";
import { IsMobileAtom } from "@/app/Atom/IsMobile";

const LoataixuongClient = () => {
  const isMobileAtom = useRecoilValue(IsMobileAtom);
  return (
    <LayOutDetail title="Loa tai xuong (customer)">
      <div className="w-full p-2">
        <img src={'/img/loataixuong.png'} alt="img" className="w-full h-full object-cover" />
      </div>
      <div className="mt-2">
        <h1>A customer-centric website designed for an optimal user experience, with a focus on SEO and a user-friendly interface.</h1>
      </div>
      <div className="pr-2">
        <p className="font-bold">This website specializes in providing speaker-related services, including:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                View products:
              </p>
              Search and view products
            </div>
          </li>
          <li>
            <div className="">
              <p className="font-bold">
                Search Engine Optimization (SEO):
              </p>
              The website is optimized for the keyword "loataixuong" to increase visibility on search engines.            </div>
          </li>
        </ul>
        <p className="font-bold">Technologies Used:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Frontend (FE):
              </p>
              React.js, Radix UI
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Backend (BE):
              </p>
              Dotnet 8
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Database (DB):
              </p>
              MongoDB
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Docker:
              </p>
              Used to streamline API deployment to the server.
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Authentication (Auth):
              </p>
              Clerk.
            </div>
          </li>
        </ul>
        <p className="font-bold">Features:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              Displays all speaker products, blogs added from the admin page.
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              Details about the admin page can be found in the "loataixuong admin" article.            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              User Interface (UI) is complete.
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              The payment function is waiting for integration with Momo's API.            </div>
          </li>
        </ul>
        <p className="font-bold">Notes:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              The website is under development and will be updated with new features in the future.
            </div>
          </li>
        </ul>
        <p className="font-bold">Features:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              Displays all speaker products, blogs added from the admin page.
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              Details about the admin page can be found in the "loataixuong admin" article.            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              User Interface (UI) is complete.
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              The payment function is waiting for integration with Momo's API.            </div>
          </li>
        </ul>
        <div className={isMobileAtom ? "" : "flex items-center"}>
          <p className="font-bold">Url:</p>
          <a
            href="https://loataixuong.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500 underline"
          >
            loataixuong.com
          </a>
        </div>
      </div>
    </LayOutDetail>
  );
};
export default LoataixuongClient;
