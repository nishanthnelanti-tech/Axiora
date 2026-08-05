import mongoose from "mongoose";

const messageScheme=new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    role:{
        type:String,
        enum:["user","assistant"]
    },
    content:String
},{
    timestamps:true
})

const Message=mongoose.model("Message",messageScheme)
export default Message