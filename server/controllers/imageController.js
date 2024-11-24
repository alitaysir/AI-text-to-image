import axios from "axios";
import FormData from "form-data";
import userModel from "../models/userModel.js";

export const generateImage= async(req,res)=>{
    try {
        const {userId,prompt}=req.body
        const user= await userModel.findById(userId)

        if(!user || !prompt){
            return res.json({ success: false, message: "Missing details",creditBalance:user.creditBalance });
        }

        if(user.creditBalance===0){
            return res.json({ success: false, message: "No credits left" });
        }

        const formdata= new FormData
        formdata.append('prompt',prompt)

        const {data}= await axios.post('https://clipdrop-api.co/text-to-image/v1',
         formdata,{
            headers:{
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType:'arraybuffer'
        })

        const base64image= Buffer.from(data,'binary').toString('base64')
        const resultimage= `data:image/png;base64,${base64image}`

        await userModel.findByIdAndUpdate(user._id,{creditBalance:user.creditBalance-1})

        res.json({success:true,message:"Image generated", creditBalance: user.creditBalance-1, resultimage})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}