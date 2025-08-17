import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { ToastAtom } from "../Atom/ToastAtom";
type ToastProps = {
  content: String;
  isOpen: boolean;
  isAutoHide?: boolean;
  status?: "INFO" | "SUCCESS" | "ERROR" | "";
};
const Toast = (props: ToastProps) => {
  const { content, isOpen, isAutoHide = false, status = "INFO" } = props;
  const setToast = useSetRecoilState(ToastAtom);
  useEffect(() => {
    if (isOpen && isAutoHide) {
      const timer = setTimeout(() => {
        setToast({
          isOpen: false,
          message: "",
          isAutoHide: false,
          status: "",
        });
      }, 2000); // Reset tooltip after 2 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isOpen, isAutoHide, setToast]);
  const handleStatus = (statusInput: "INFO" | "SUCCESS" | "ERROR" | "") => {
    switch (statusInput) {
      case "INFO":
        return "bg-blue-500"; // Màu xanh dương cho thông tin
      case "SUCCESS":
        return "bg-green-500"; // Màu xanh lá cây cho thành công
      case "ERROR":
        return "bg-red-500"; // Màu đỏ cho lỗi
      default:
        return "bg-gray-500"; // Màu xám cho trạng thái không xác định
    }
  };

  return (
    <div className={`${isOpen ? "" : "hidden"} absolute bottom-0 right-10`}>
      <div
        id="toast-default"
        className={`flex items-center w-full max-w-xs p-4 rounded-lg shadow text-white ${handleStatus(status)}`}
        role="alert"
      >
        <div className="ms-3 text-sm ">{content}</div>
      </div>
    </div>
  );
};

export default Toast;
