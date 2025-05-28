import React from 'react'

const Modal = ({title, content, onClose, status}) => {
  return (
   <>  
   { status && (
    // <div className="absolute flex justify-center items-center inset-0 bg-opacity-20 backdrop-blur-sm">
    <div
    className={`absolute flex justify-center items-center inset-0 bg-opacity-20 backdrop-blur-sm transition-opacity duration-500 ${
      status ? 'opacity-00 z-30' : 'opacity-0 -z-10 pointer-events-none'
    }`}
  >

      <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-2xl w-150 ">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4 animate-pulse"> </div>
        <div className="h-4 bg-gray-300 rounded w-[83%] mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-[65%] mb-2 animate-pulse"></div>
        <div className="h-10 bg-gray-300 rounded w-24 ml-auto animate-pulse"></div>
      </div>
    </div>
   )}

{!status && ( 
  //  <div 
  //   className="absolute flex justify-center items-center inset-0 bg-opacity-20 backdrop-blur-sm"
  //   onClick={onClose}
  //   >
  <div
        className={`absolute flex justify-center items-center inset-0 bg-opacity-20 backdrop-blur-sm transition-opacity duration-500 ${
          !status ? 'opacity-100 z-50' : 'opacity-0 -z-10 pointer-events-none'
        }`}
        onClick={onClose}
      >
      <div className="bg-white p-6  border border-gray-300 rounded-lg shadow-2xl w-150">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-800 mb-2">{content.completionTime}</p>
        <p className="text-gray-800 mb-2">TotalWorked : {content.totalWorked}</p>
        <p className="text-gray-800 mb-2">Current time : {content.indianTime}</p>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>)}
   
   </>
  )
}

export default Modal
