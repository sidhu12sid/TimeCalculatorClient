import React from 'react'

const ModalSkeleton = () => {
  return (
    <div className="absolute flex justify-center items-center inset-0 bg-opacity-20 backdrop-blur-sm">
      <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-2xl w-150 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"> </div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-6"></div>
        <div className="h-10 bg-gray-300 rounded w-24 ml-auto"></div>
      </div>
    </div>
  );
};

export default ModalSkeleton;
