import React from 'react'

const Modal = ({title, content, onClose}) => {
  return (
   <>
    <div 
    className="absolute flex justify-center items-center inset-0 bg-opacity-20 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
    onClick={onClose}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-800">{content}</p>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
   </>
  )
}

export default Modal
