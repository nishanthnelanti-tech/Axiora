import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro"
})

const groq = new ChatGroq({
model: "openai/gpt-oss-120b"
});

export const getModel=async(agent)=>{
    switch(agent){
        case "chat":
            return groq;
        case "coding":
            return gemini;
        case "search":
            return groq;

        default:
            return groq;
    }
}

