"use client";
import React from "react";
import { useRecoilState } from "recoil";
import { SidebarAtom } from "../Atom/Sidebar";

type SidebarProps = {
  children: React.ReactNode;
}

const Sidebar = (props: SidebarProps) => {
  const { children } = props;
  const [isOpen, setIsOpen] = useRecoilState(SidebarAtom);
  return (
    <div className="flex">
      <div className={`bg-gray-800 text-white 
                    fixed h-screen transition-all 
                    duration-300 z-10 
                    ${isOpen ? 'w-full' : 'w-0 overflow-hidden'
        }`}>
        <div className="flex flex-col items-center">
          <div className="mt-4">
            <div>
              <button>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Sidebar;
