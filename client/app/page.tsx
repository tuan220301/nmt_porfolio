"use client";
import HomeContent from './Pages/home/homeContent';
import { Suspense } from 'react';
import Loading from './Components/Loading';
import React from 'react';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

export default function Home() {

  return (
    <>
      <div className='w-1/2'>
        <HomeContent />
      </div>
      {/* <Suspense fallback={<Loading />}> */}
      {/*   <div className="w-60 h-60"> */}
      {/*     <Spline scene="https://prod.spline.design/TmZ7maoJxxLFeBAI/scene.splinecode" /> */}
      {/*   </div> */}
      {/* </Suspense> */}

    </>
  );
}
