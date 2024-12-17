import mongoose from "mongoose";

export const connection = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: 'APPOINTMENT_SYSTEM',
    }).then(()=>{
        console.log('connected to the database');
    }).catch((err)=>{
        console.log(`error while connecting to database ${err}`);
    })
}