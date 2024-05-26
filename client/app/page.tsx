"use client";
import { useRecoilValue } from 'recoil';
import HomeContent from './Pages/home/homeContent';
import React from 'react';
import { IsMobileAtom } from './Atom/IsMobile';


export default function Home() {
  const isMobileState = useRecoilValue(IsMobileAtom);
  return (
    <>
      <div className={isMobileState ? 'w-full' : 'w-1/2'}>
        <HomeContent />
      </div>
    </>
  );
}
