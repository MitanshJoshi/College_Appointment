import User from "../models/userSchema.js";
import { generateJwtToken } from "../utils/jwtToken.js";


export const register = async(req,res,next) =>{
    try {
        const { email, name, password, role } = req.body;
        const isPresent = await User.findOne({email:email});
        if(isPresent)
        {
            return res.status(400).json({
                status:400,
                message:"user already registered"
            })
        }
        if(!email || !password || !name || !role)
        {
            return res.status(400).json({
                status:400,
                message:"email, userName, password and role is required"
            })
        }
        if(role != "student" && role != "professor")
        {
            return res.status(400).json({
                message:"role can only be student or professor"
            })
        }
        const user = await User.create({
            email: email,
            name: name,
            password,
            role,
        })
        await user.save()
        generateJwtToken(user, "User Registered", 201, res);
    } catch (error) {
        next(error);
    }
}

export const login = async (req,res,next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user)
        {
            return res.status(400).json({
                status:400,
                message:"user not registered"
            })
        }
        const isCorrect = user.comparePassword(password);
        if(!isCorrect)
        {
            return res.status(400).json("Incorrect Password");
        }
        generateJwtToken(user, "Login Successful", 200, res);
    } catch (error) {
        next(error);
    }
}