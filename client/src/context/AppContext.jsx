import { createContext, useEffect, useState } from "react";
import axios from 'axios'
//import Header from "../components/Header";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'


export const AppContext =createContext()

const AppContextProvider=(props)=>{

    const navigate=useNavigate()
    const [user, setuser] = useState(false)
    const [showlogin, setshowlogin] = useState(false)
    const backendurl=import.meta.env.VITE_BACKEND_URL
    const [token, settoken] = useState(localStorage.getItem('token'))

    const [credit, setcredit] = useState(false)

    const loadcredits= async ()=>{

        try {
            const { data } = await axios.get(`${backendurl}/api/user/credit`, {
                headers: {
                  token 
                }
              });          
            if(data.success){
                setcredit(data.credits)
                setuser(data.user)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    const logout=()=>{
        localStorage.removeItem('token')
        setuser(null)
        settoken('')
    }

    const generateimage=async(prompt)=>{
        try {
            const {data}= await axios.post(backendurl+'/api/image/generate-image',{prompt},{headers:{token}})
            if(data.success){
                loadcredits()
                return data.resultimage
            }else{
                toast.error(data.message)
                loadcredits()
                if(credit===0){
                    navigate('/buy')                    
                }
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    useEffect(()=>{
        if(token){
            loadcredits()
        }
    },[token])

    const value={
        user,setuser,
        showlogin,setshowlogin,
        backendurl,
        token,settoken,
        credit,setcredit,
        loadcredits,
        logout,
        generateimage
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>

    )
}

export default AppContextProvider