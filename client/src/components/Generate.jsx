import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Generate = () => {

  const {user,setshowlogin}=useContext(AppContext)
  const navigate=useNavigate()

  const handleclick=()=>{
    if(user){
      navigate('/result')
    }else{
      setshowlogin(true)
    }
  }
  return (
    <motion.div 
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className='pb-16 text-center flex flex-col justify-center items-center'>
    <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-8'>
      See the magic. Try now
    </h1>
    
    <button onClick={handleclick} className="bg-black text-white py-3 px-6 rounded-full flex items-center space-x-2 hover:bg-gray-800 transition">
      <span>Generate Images</span>
      <img src={assets.star_group} alt="Star Group" className="w-5 h-5" />
    </button>
  </motion.div>
  

  )
}

export default Generate