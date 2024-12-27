import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt; // we are extracting the token from the cookie

        if(!token){
            return res.status(401).json({message: "Unauthorized:- No token provided"});
        }

        const decoded = jwt.verify(token, process.env.SECRET)// we are verifying the user 

        if(!decoded){
            return res.status(401).json({message: "Unauthorized:- Invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password"); // thiss will select everything from a user except fpr the password
        // decoded.userId:- after decoding the token we will get the user id because we passed it as the parameter during the generation of the token in utils.js
        
        if(!user){
            return res.status(404).json({message:" User not found "});
        }

        req.user = user; // finally we are passing the user in the request

        next();


        
    } catch (error) {
        console.log("Error in the protectRoute middleware: ", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}
