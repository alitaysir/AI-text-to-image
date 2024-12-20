import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const [image, setimage] = useState(assets.sample_img_1)
  const [isimageLoaded, setisimageLoaded] = useState(false)
  const [loading, setloading] = useState(false)
  const [input, setinput] = useState('')
  const {generateimage}= useContext(AppContext)

  const onSubmitHandler= async(e)=>{
    e.preventDefault()
    setloading(true)

    
    if(input){
      const image=await generateimage(input)
      if(image){
        setisimageLoaded(true)
        setimage(image)
      }
    }
    setloading(false)
  }

  return (
    <motion.form 
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    onSubmit={onSubmitHandler}
    className=" flex flex-col min-h-[90vh] justify-center items-center ">

      <div>
        <div className="relative">
          <img src={image} alt="" className="max-w-sm rounded" />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500
        ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}
          />
        </div>
        <p className={loading? '' : 'hidden'}>Loading......</p>
      </div>

      
      {!isimageLoaded &&
      <div
        className="flex w-full max-w-xl bg-neutral-500 text-white
         text-sm p-0.5 mt-10 rounded-full"
      >
        <input
          type="text"
          onChange={e=>setinput(e.target.value)}
          value={input}
          placeholder="Describe what you want to generate"
          className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20
          placeholder-color"
        />
        <button
          type="submit"
          onClick={onSubmitHandler}
          className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
        >
          Generate
        </button>
      </div> }


      {isimageLoaded &&
      <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
        <p onClick={()=>setisimageLoaded(false)} className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer">Generate Another</p>
        <a className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer' href={image} download>Download</a>
      </div> }

    </motion.form>
  );
};

export default Result;
