import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import axios from 'axios'
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const {setshowlogin,backendurl,setuser,settoken,} = useContext(AppContext)

  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const onsubmitHandler=async (e)=>{
    e.preventDefault()
    
    try {
      if(state==='Login'){
        const {data}= await axios.post(backendurl+`/api/user/login`,{email,password})
        if(data.success){
          setuser(data.user)
          settoken(data.token)
          localStorage.setItem('token',data.token)
          setshowlogin(false)
        }else{
          toast.error(data.message)
        }
      }

      if(state==='Signup'){
        const {data}= await axios.post(backendurl+`/api/user/register`,{name,email,password})
        if(data.success){
          setuser(data.user)
          settoken(data.token)
          localStorage.setItem('token',data.token)
          setshowlogin(false)
        }else{
          toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{

    document.body.style.overflow='hidden'
    return()=>{
        document.body.style.overflow='unset'
    }
  },[])

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form onSubmit={onsubmitHandler}
      initial={{ opacity: 0.2, y: 15 }}
      transition={{ duration: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
        <img
          src={assets.cross_icon}
          onClick={()=>setshowlogin(false)}
          alt="Close"
          className="absolute top-5 right-5 w-4 h-4 cursor-pointer"
        />
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          {state}
        </h1>

        {state === "Signup" ? (
          <p className="text-sm text-gray-600 mb-6 text-center">
            Welcome! Please sign up to continue
          </p>
        ) : (
          <p className="text-sm text-gray-600 mb-6 text-center">
            Welcome back! Please log in to continue
          </p>
        )}

        {state === "Signup" && (
          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={e=>setname(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="mb-6">
          <input
            type="email"
            value={email}
            onChange={e=>setemail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            value={password}
              onChange={e=>setpassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="text-left text-blue-500 text-sm cursor-pointer mb-4 px-2">
          Forgot password?
        </p>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 mb-4"
        >
          {state === "Signup" ? "Sign Up" : "Login"}
        </button>

        {state === "Signup" ? (
          <p className="text-sm text-center">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-500 cursor-pointer"
            >
              Login
            </span>
          </p>
        ) : (
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => setState("Signup")}
              className="text-blue-500 cursor-pointer"
            >
              Signup
            </span>
          </p>
        )}
      </motion.form>
    </div>
  );
};

export default Login;
