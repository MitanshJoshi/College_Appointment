import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token)
    {
        return res.status(400).json({
            message:"User not authenticated",
        })
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
};


export const isAuthorized = (...roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return res.status(400).json({
                message:"User not authorized",
            });
        }
        next();
    }
}