import { getModel } from "../config/llmModels.js"

const CHAT_TIMEOUT_MS = Number(process.env.CHAT_TIMEOUT_MS || 20000)

export const chatAgent = async (state) => {
    const llm = await getModel("chat")
    const systemPrompt = "You are AxioraAI, an intelligent AI assistant."

    const response = await Promise.race([
        llm.invoke([
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "human",
                content: state.prompt
            }
        ]),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Chat model timeout")), CHAT_TIMEOUT_MS))
    ])

    return {
        ...state,
        aiResponse: response.content
    }
}