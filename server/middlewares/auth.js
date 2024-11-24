import jwt from "jsonwebtoken";

const userAuth= async(req,res,next)=>{
    try {
        const{token}= req.headers;
        if(!token){
            return res.json({ success: false, message: "Not authorized, login to proceed" });
        }

        const decodedtoken= await jwt.verify(token,process.env.JWT_SECRET)
        if(decodedtoken.id){
            req.body.userId=decodedtoken.id;
        }else{
            return res.json({ success: false, message: "Not authorized, login to proceed" });

        }
        
        next()
        

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default userAuth