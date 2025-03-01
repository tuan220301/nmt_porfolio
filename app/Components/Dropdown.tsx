import React from "react";

type DropDownProps = {
  children: React.ReactNode;
  open: boolean;
}
const Dropdown = (props: DropDownProps) => {
  const { children, open } = props;
  return (
    <>
      {
        open ?
          <div className="z-10 flex items-center justify-center right-1 w-32 mt-2 bg-white absolute divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
            <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {children}
            </div>
          </div> : <></>
      }
    </>
  );
};

export default Dropdown;

