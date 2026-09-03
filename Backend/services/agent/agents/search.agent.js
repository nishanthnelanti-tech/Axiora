// search.agent.js
import { searchTool } from "../config/tavily.js"
import {deductCredits} from "../utils/deductCredits.js"

const MAX_RESULTS_FOR_CONTEXT = 4
const MAX_CONTENT_CHARS = 600 // per-result cap

export const searchAgent = async (state) => {
    try {
        const results = await searchTool.invoke({ query: state.prompt })
        await deductCredits(state.userId,"search")

        // Keep the full images array for the frontend
        const images = results.images || []

        // Build a slim, token-cheap context for the LLM — title/url/short snippet only
        const trimmedResults = (results.results || [])
            .slice(0, MAX_RESULTS_FOR_CONTEXT)
            .map(r => ({
                title: r.title,
                url: r.url,
                content: (r.content || "").slice(0, MAX_CONTENT_CHARS)
            }))

        return {
            ...state,
            searchResults: trimmedResults,
            images,
        }
    } catch (error) {
        console.error("Error in searchAgent:", error)
        return {
            ...state,
            searchResults: [],
            images: [],
        }
    }
}