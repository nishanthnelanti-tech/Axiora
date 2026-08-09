import api from "../../utils/axios.js"

export const getConversation=async()=>{
    try{
        const {data}=await api.get("/api/chat/get-conversation")
        return data
    }
    catch(err){
        console.error("Error creating conversation:", err);
        return []
    }
}