import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";

dotenv.config();

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    apiKey: process.env.GOOGLE_API_KEY,
});

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY,
});

const openRouter = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    temperature:0,
    maxTokens:2500,
    apiKey: process.env.OPENROUTER_API_KEY
});

export const getModel=async(agent)=>{
    switch(agent){
        case "chat":
            return groq;
        case "coding":
            return openRouter;
        case "search":
            return groq;
        case "imageAnalyzer":
            return gemini;

        default:
            return groq;
    }
}

