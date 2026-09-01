import axios from "axios"
import {graph} from "../graph/graph.js"

const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 20000)
const CODING_TIMEOUT_MS = Number(process.env.CODING_TIMEOUT_MS || 60000)

export const agent = async (req, res) => {
    try {
        const { conversationId, prompt, agent} = req.body

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "user",
            content: prompt
        }, {
            timeout: 15000
        })

        const timeoutMs = agent === "coding" ? CODING_TIMEOUT_MS : AI_TIMEOUT_MS

        const result = await Promise.race([
            graph.invoke({ prompt, conversationId, agent }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI request timed out")), timeoutMs))
        ])
        const response=result.aiResponse

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "assistant",
            content: result?.aiResponse,
            images:result?.images,
            artifacts:result?.artifacts
        }, {
            timeout: 15000
        })


        return res.status(200).json({
            answer: result?.aiResponse,
            images:result?.images,
            artifacts:result?.artifacts
        })
    } catch (error) {
    console.error("agent error:", error?.response?.data || error.message)
    return res.status(500).json({
        message: error?.response?.data?.message || error.message || "AI service unavailable"
    })
}
}