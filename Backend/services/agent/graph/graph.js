import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state";
import { router } from "./router";
import { chatAgent } from "../agents/chat.agent";
import { codingAgent } from "../agents/coding.agent";
import { visionAgent } from "../agents/vision.agent";
import { pdfAgent } from "../agents/pdf.agent";
import { pptAgent } from "../agents/ppt.agent";
import { searchAgent } from "../agents/search.agent";

const workflow=new StateGraph(agentState)

workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("coding",codingAgent)
workflow.addNode("vision",visionAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)
workflow.addNode("search",searchAgent)

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",(state)=>{
    switch(state.agent){
        case "chat":
            return "chat";
        case "coding":
            return "coding";
        case "ppt":
            return "ppt";
        case "pdf":
            return "pdf";
        case "vision":
            return "vision";
        case "search":
            return "search";
        default:
            return "chat";
    }
},{
    chat:"chat",
    ppt:"ppt",
    pdf:"pdf",
    search:"search",
    vision:"vision",
    coding:"coding"
})

workflow.addEdge("search","chat")
workflow.addEdge("coding","__end__")
workflow.addEdge("chat","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("vision","__end__")

export const graph=workflow.compile()