import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["student", "professor"] },
});

UserSchema.pre("save", async function (next) {
    try {
        
        if (this.isModified("password")) {
            const salt = await bcrypt.genSalt(10); 
            this.password = await bcrypt.hash(this.password, salt); 
        }
        next(); 
    } catch (error) {
        next(error); 
    }
});

UserSchema.methods.comparePassword=async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword,this.password);
}

UserSchema.methods.generateToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}


const User = mongoose.model("User",UserSchema);
export default User;
