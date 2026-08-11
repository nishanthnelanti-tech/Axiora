import axios from "axios"
import graph from "../graph/graph.js"

const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 20000)

export const agent = async (req, res) => {
    try {
        const { conversationId, prompt } = req.body

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "user",
            content: prompt
        }, {
            timeout: 15000
        })

        const result = await Promise.race([
            graph.invoke({ prompt, conversationId }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI request timed out")), AI_TIMEOUT_MS))
        ])

        return res.status(200).json(result.aiResponse)
    } catch (error) {
        console.error("agent error:", error)
        return res.status(504).json({
            message: error?.message || "AI service unavailable",
            error: "The agent request timed out or failed while contacting the model provider."
        })
    }
}