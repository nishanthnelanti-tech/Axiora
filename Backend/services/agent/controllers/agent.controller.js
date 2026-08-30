import axios from "axios"
import { graph } from "../graph/graph.js"

const DEFAULT_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 20000)
const CODING_TIMEOUT_MS = Number(process.env.CODING_TIMEOUT_MS || 60000)

class TimeoutError extends Error {}

export const agent = async (req, res) => {
    const { conversationId, prompt, agent: agentType } = req.body

    try {
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "user",
            content: prompt
        }, {
            timeout: 15000
        })
    } catch (error) {
        console.error("agent: failed saving user message:", error?.response?.data || error.message)
        return res.status(502).json({
            message: error?.response?.data?.message || "Failed to save your message."
        })
    }

    const timeoutMs = agentType === "coding" ? CODING_TIMEOUT_MS : DEFAULT_TIMEOUT_MS
    console.log(`agent: running "${agentType}" with a ${timeoutMs}ms budget`)

    let result
    try {
        result = await Promise.race([
            graph.invoke({ prompt, conversationId, agent: agentType }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new TimeoutError("AI request timed out")), timeoutMs))
        ])
    } catch (error) {
        if (error instanceof TimeoutError) {
            console.error(`agent: graph.invoke exceeded ${timeoutMs}ms for agent "${agentType}"`)
            return res.status(504).json({ message: "The AI took too long to respond." })
        }
        console.error("agent: graph.invoke threw:", error?.message || error)
        return res.status(500).json({ message: error?.message || "AI generation failed." })
    }

    const response = result?.aiResponse

    try {
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "assistant",
            content: response,
            images: result?.images,
            artifacts: result?.artifacts
        }, {
            timeout: 15000
        })
    } catch (error) {
        console.error("agent: failed saving assistant message:", error?.response?.data || error.message)
        // still return the generated answer even if persistence failed
        return res.status(200).json({
            answer: response,
            images: result?.images,
            artifacts: result?.artifacts,
            warning: "Response generated but not saved to history."
        })
    }

    return res.status(200).json({
        answer: response,
        images: result?.images,
        artifacts: result?.artifacts
    })
}