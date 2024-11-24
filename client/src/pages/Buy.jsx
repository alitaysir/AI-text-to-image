import React, { useContext } from "react";
import { plans, assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const Buy = () => {
  const { user,backendurl,token,loadcredits,setshowlogin } = useContext(AppContext);
  const navigate=useNavigate()

  const initpay=async(order)=>{
    const options={
       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
       amount:order.amount,
       currency:order.currency,
       name:"credits payment",
       description:"credits payment",
       order_id:order.id,
       receipt:order.receipt,

       handler:async (response)=>{
        //console.log(response)
         try {
          const {data}= await axios.post(backendurl+'/api/user/verify-razor',{
            razorpay_order_id: response.razorpay_order_id })
          if(data.success===true){
            loadcredits()
            navigate('/')
            toast.success("Credits added")
          }else{
            toast.error(data.message)
          }
         } catch (error) {
          toast.error(error.message)
         }
       }
    }
    const rzp =new window.Razorpay(options)
    rzp.open()
  }

  const paymentrazorpay=async(planId )=>{
    try {
      if(!user){
        navigate('/')
      }
      const {data}= await axios.post(backendurl+'/api/user/pay-razor',{planId},{headers:{token}})
      if(data.success){
        initpay(data.order)
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center p-6"
    >
      <div className="px-4 py-1 rounded-full flex items-center justify-center mt-6 bg-transparent border border-gray-300">
        <p className="text-sm font-normal">Our Plans</p>
      </div>
      <h2 className="font-medium text-3xl sm:text-4xl mt-6 text-center">
        Choose the plan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full px-4 md:px-10">
        {plans.map((item, index) => (
          <div
            key={index}
            className="flex flex-col p-6 border rounded-lg shadow-md bg-white space-y-2 max-w-[300px] mx-auto sm:mx-0"
          >
            <img
              src={assets.logo_icon}
              width={35}
              alt="Plan Icon"
              className="mb-2"
            />
            <p className="text-lg font-medium">{item.id}</p>
            <p className="text-sm text-gray-600 leading-tight">{item.desc}</p>
            <p className="text-lg font-medium">
              Rs.{item.price} /{" "}
              <span className="text-sm text-gray-500">{item.credits} credits</span>
            </p>
            <button onClick={()=>paymentrazorpay(item.id)} className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Buy;
