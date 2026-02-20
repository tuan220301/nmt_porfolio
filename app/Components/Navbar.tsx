"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { isMobile } from "react-device-detect";
import Dropdown from "./Dropdown";
import { useRecoilState, useSetRecoilState } from "recoil";
import { IsMobileAtom } from "../Atom/IsMobile";
import { usePathname } from "next/navigation";
import { LoggedAtom } from "../Atom/IsLogged";
import { useApi } from "../hooks/useApi";
import { ResponseApi } from "../api/models/response";
import { ToastAtom } from "../Atom/ToastAtom";
const Navbar = () => {
  const { callApi } = useApi();
  const [isMobileState, setIsMobileState] = useRecoilState(IsMobileAtom);
  const [isLoggedAtom, setIsLoggedAtom] = useRecoilState(LoggedAtom);
  const setToastAtom = useSetRecoilState(ToastAtom);

  const [openDropDown, setOpenDropDown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMobile) {
      setIsMobileState(true);
    } else {
      setIsMobileState(false);
    }
  }, [setIsMobileState]);
  const handleOpenDropDown = () => {
    setOpenDropDown(!openDropDown);
  };
  const getLinkClass = (path: any) => (pathname === path ? "underline" : "");
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data: ResponseApi<boolean> = await callApi("/api/auth/cookie", "GET");
        if (data && data.isSuccess && data.data) {
          setIsLoggedAtom(data.data);
        }
      } catch (error: any) {
        console.log("nav bar: ", error.toString());
        // setToastAtom({
        //   isAutoHide: true,
        //   isOpen: true,
        //   message: error.toString(),
        //   status: "ERROR",
        // });
      }
    };
    checkAuth();
  });
  const handleLoggout = async () => {
    try {
      const data: ResponseApi<string> = await callApi("/api/auth/logout", "POST");
      if (data && data.isSuccess) {
        setToastAtom({
          isOpen: true,
          isAutoHide: true,
          message: data.message,
          status: "SUCCESS",
        });
        setIsLoggedAtom(!isLoggedAtom);
      } else {
        setToastAtom({
          isOpen: true,
          isAutoHide: true,
          message: data.message,
          status: "ERROR",
        });
      }
    } catch (error: any) {
      setToastAtom({
        isOpen: true,
        isAutoHide: true,
        message: error.toString(),
        status: "ERROR",
      });
    }
    setOpenDropDown(!openDropDown);
  };
  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-center p-2 text-xl h-16 bg-neutral-100 dark:bg-neutral-950/30 backdrop-blur-md rounded-xl ${isMobileState ? "w-full" : "w-1/2"}`}
    >
      <div className="w-full flex items-center justify-between p-2">
        <div className={isMobileState ? "w-1/2" : "w-[210px]"}>
          <Link href={"/"}>Nguyễn Minh Tuấn</Link>
        </div>
        <div
          className={
            isMobileState
              ? "w-1/4 flex gap-2 items-center justify-between"
              : `${isLoggedAtom ? "w-[400px]" : "w-[350px]"} flex gap-9 items-center`
          }
        >
          {isMobileState ? (
            <></>
          ) : (
            <div className="flex gap-6 items-center w-[280px]">
              <Link className={getLinkClass("/")} href={"/"}>
                Home
              </Link>
              <Link
                className={getLinkClass("/Pages/work")}
                href={"/Pages/work"}
              >
                Work
              </Link>
              <Link
                className={getLinkClass("/Pages/contact")}
                href={"/Pages/contact"}
              >
                Contact
              </Link>
              <Link
                className={getLinkClass("/Pages/login")}
                href={"/Pages/login"}
              >
                Login
              </Link>
            </div>
          )}
          <div className="w-28 flex items-center gap-2 justify-between">
            <ThemeSwitcher />

            {isLoggedAtom && !isMobileState ? (
              <div className="w-10">
                <button
                  onClick={handleOpenDropDown}
                  className="flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg w-10 h-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>
                <Dropdown open={openDropDown}>
                  <div className="flex flex-col gap-3 text-lg">
                    <Link onClick={handleOpenDropDown} href={"/Pages/contact"}>
                      Contact
                    </Link>
                    <Link onClick={handleLoggout} href={"/Pages/login"}>
                      Logout
                    </Link>
                  </div>
                </Dropdown>
              </div>
            ) : (
              <></>
            )}
          </div>
          {isMobileState ? (
            <div>
              <button
                onClick={handleOpenDropDown}
                className="flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg w-10 h-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
              <Dropdown open={openDropDown}>
                <div className="flex flex-col gap-3 text-lg">
                  <Link onClick={handleOpenDropDown} href={"/"}>
                    Home
                  </Link>
                  <Link onClick={handleOpenDropDown} href={"/Pages/work"}>
                    Work
                  </Link>
                  <Link onClick={handleOpenDropDown} href={"/Pages/contact"}>
                    Contact
                  </Link>
                  <Link onClick={handleOpenDropDown} href={"/Pages/login"}>
                    Login
                  </Link>
                </div>
              </Dropdown>
            </div>
          ) : (
            <></>
          )}
          {/* </div> */}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
