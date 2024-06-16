import React from 'react';
type LoadingProps = {
  width?: any;
  height?: any;
}
const Loading = (props: LoadingProps) => {
  const { width, height } = props;
  return (
    <div className="flex justify-center items-center">
      <div style={{
        width: width,
        height: height
      }} className={`animate-spin rounded-full border-t-2 border-b-2 border-black dark:border-white`}></div>
    </div>
  );
};

export default Loading;
