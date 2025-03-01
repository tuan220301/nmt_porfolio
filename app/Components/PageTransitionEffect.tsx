"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { useContext, useRef } from "react";
import Toast from "./Toast";
import { ToastAtom } from "../Atom/ToastAtom";
import { useRecoilValue } from "recoil";
import { LoadingAtom } from "../Atom/IsLoading";
import LoadingModal from "./LoadingModal";

function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}
const variants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 300 },
};

const PageTransitionEffect = ({ children }: { children: React.ReactNode }) => {
  // The `key` is tied to the url using the `usePathname` hook.
  const key = usePathname();
  const toast = useRecoilValue(ToastAtom)
  const isLoadingFromAtom = useRecoilValue(LoadingAtom);
  return (
    <>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={key}
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={variants}
          transition={{ type: "easeInOut", duration: 0.75 }}
          className="overflow-hidden w-full"
        >
          <FrozenRouter>
            <div className="flex items-center justify-center w-full">
              {children}
            </div>
            <Toast isOpen={toast.isOpen} content={toast.message} isAutoHide={toast.isAutoHide} status={toast.status} />
          </FrozenRouter>
        </motion.div>
      </AnimatePresence>
      <LoadingModal isLoading={isLoadingFromAtom} />
    </>
  );
};

export default PageTransitionEffect;
