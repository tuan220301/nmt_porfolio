import exp from "constants";
import React, { useState } from "react";
import ButtonIconComponent from "./ButtonIconComponent";
import { AnimatePresence, motion } from "framer-motion";

type UploadImageProps = {
  selectedImage: any;
  setSelectedImage: (selectedImage: any) => void;
}
// Define a functional component named UploadAndDisplayImage
const UploadAndDisplayImage = (props: UploadImageProps) => {
  const { ...prop } = props;
  // Define a state variable to store the selected image

  // Return the JSX for rendering
  return (
    <div className="flex gap-4">
      {/* Conditionally render the selected image if it exists */}
      {prop.selectedImage && (
        <AnimatePresence>
          {prop.selectedImage && (
            <motion.img
              key="image"
              alt="not found"
              width={"250px"}
              src={URL.createObjectURL(prop.selectedImage)}
              initial={{ opacity: 0, scale: 0.5, x: -50 }} // Bắt đầu nhỏ + lệch trái
              animate={{ opacity: 1, scale: 1, x: 0 }} // Hiển thị đầy đủ
              exit={{ opacity: 0, scale: 0.5, x: 50 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>)}

      <div className="flex flex-col items-center">
        {/* Input File (Chỉ hiển thị khi chưa chọn ảnh) */}
        {!prop.selectedImage && (
          <AnimatePresence>
            <motion.input
              initial={{ opacity: 0, scale: 0.5, x: -50 }} // Bắt đầu nhỏ + lệch trái
              animate={{ opacity: 1, scale: 1, x: 0 }} // Hiển thị đầy đủ
              exit={{ opacity: 0, scale: 0.5, x: 50 }}
              key="box"
              transition={{ duration: 0.5 }}
              type="file"
              accept="image/*"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.files && event.target.files[0]) {
                  prop.setSelectedImage(event.target.files[0]);
                }
              }}
            />
          </AnimatePresence>
        )}

        {/* Remove Button */}
        {prop.selectedImage && (
          <ButtonIconComponent
            onClick={() => prop.setSelectedImage(null)}
            title="Remove"
            icon={
              <div className="text-lg pl-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

export default UploadAndDisplayImage;
