"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { isMobile } from "react-device-detect";
import Dropdown from "./Dropdown";
const Navbar = () => {
  const [mobile, setMobile] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  useEffect(() => {
    if (isMobile) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [])
  const handleOpenDropDown = () => {
    setOpenDropDown(!openDropDown);
  }
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-center p-2  text-xl h-16 bg-neutral-100 dark:bg-neutral-950/30 backdrop-blur-md w-1/2 rounded-xl">
      <div className="w-full flex items-center justify-between p-2">
        <div className={mobile ? "w-1/2" : "w-[210px]"}>
          <Link href={"/"}>Nguyễn Minh Tuấn</Link>
        </div>
        <div className={mobile ? "w-1/4 flex gap-2 items-center justify-between" : "w-[350px] flex gap-9 items-center"}>
          {
            mobile ? <></> :
              <div className="flex gap-6 items-center w-[240px]">
                <Link href={"/"}>Home</Link>
                <Link href={"/Pages/work"}>Work</Link>
                <Link href={"/Pages/contact"}>Contact</Link>
              </div>
          }
          <ThemeSwitcher />
          {
            mobile ?
              <div>
                <button
                  onClick={handleOpenDropDown}
                  className="flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg w-10 h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
                <Dropdown open={openDropDown}>
                  <div className="flex flex-col gap-3 text-lg">
                    <Link onClick={handleOpenDropDown} href={"/"}>Home</Link>
                    <Link onClick={handleOpenDropDown} href={"/Pages/about"}>About</Link>
                    <Link onClick={handleOpenDropDown} href={"/Pages/contact"}>contact</Link>
                  </div>
                </Dropdown>
              </div>
              : <></>
          }
          {/* </div> */}
        </div>
      </div>
    </nav>
  )
}
export default Navbar
