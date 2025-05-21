import React from 'react'
import loaderGif from '../../assets/loader.gif'

const Loader = () => {
  return (
    <>
    <div className="fixed inset-0 flex justify-center items-center bg-white/70 z-50">
      <img src={loaderGif} alt="Loading..." className="w-15 h-15" />
    </div>
    </>
  )
}

export default Loader
