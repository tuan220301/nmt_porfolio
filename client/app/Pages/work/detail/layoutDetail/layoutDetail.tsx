"use client";
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import React from "react";
import { useRecoilValue } from "recoil";

type LayOutDetailProps = {
  children: React.ReactNode;
  title: string;
};

const LayOutDetail = (props: LayOutDetailProps) => {
  const { children, title } = props;
  const isMobile = useRecoilValue(IsMobileAtom);
  const borderWidth = `${title.length * 0.95}ch`;
  return (
    <div className={isMobile ? "w-full" : "w-1/2"}>
      <div>
        <p className="text-xl font-bold">{title} !!!</p>
        <div
          className="border-2 rounded-lg mb-4"
          style={{ width: borderWidth }}
        ></div>
      </div>
      <div className="text-lg">
        {children}
      </div>
    </div>
  );
};

export default LayOutDetail;

