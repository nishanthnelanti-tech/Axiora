import mongoose from "mongoose"

const userschema=new mongoose.Schema({
    firebaseUid:{
        type:String,
        unique:true
    },

    name:String,
    email:String,
    avatar:String

},{
    timestamps:true,
})

const User=mongoose.model("User",userschema)
export default User;