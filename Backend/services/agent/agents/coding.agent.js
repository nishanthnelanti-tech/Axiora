import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
    const t0 = Date.now();

    try {
        const intentLlm = await getModel("intent");
        const llm = await getModel("coding");

        const intentRes = await intentLlm.invoke(`
You are an intent classifier for a coding assistant.
Return ONLY one of these values, nothing else:

WEB_PROJECT       - a full page/site/app (multiple sections, landing pages, dashboards)
UI_COMPONENT      - a single reusable component (navbar, button, card, modal, calculator UI, etc.)
CODE_SNIPPET      - a standalone function/program/algorithm in a specific language (C++, Python, Java, etc.), not web UI
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
`);

        const intent = String(intentRes.content).trim().toUpperCase();
        console.log(`[codingAgent] INTENT: "${intent}" (${Date.now() - t0}ms)`);

        if (intent === "WEB_PROJECT") {
            return await generateFiles(llm, state, {
                fileNames: ["index.html", "style.css", "script.js"],
                extraRules: `
Rules:
- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.
- Use React / Next.js / Vue ONLY if explicitly requested.

IMAGES:
- Always use real Unsplash images.
- Never use placeholders.`
            });
        }

        if (intent === "UI_COMPONENT") {
            return await generateFiles(llm, state, {
                fileNames: ["component.html", "component.css", "component.js"],
                extraRules: `
Rules:
- Generate ONLY the single requested component, not a full page.
- HTML + CSS + minimal JS only, unless a framework is explicitly requested.
- Responsive, modern styling, CSS variables.
- NO placeholder or stock images unless explicitly requested.
- Keep it self-contained and drop-in ready.`
            });
        }

        if (intent === "CODE_SNIPPET") {
            const res = await llm.invoke(`
You are AxioraAI Coding Agent.

Write the requested code snippet directly, in the language the user specifies
(or the most sensible default if unspecified).

Return clean Markdown:
- A short one-line description
- The code in a single fenced code block with the correct language tag
- A brief explanation (2-4 lines max)

Do NOT generate a project, HTML/CSS/JS scaffolding, or JSON — just the snippet.

User Request:
${state.prompt}
`);
            console.log(`[codingAgent] snippet generated (${Date.now() - t0}ms)`);
            return { ...state, aiResponse: res.content, artifacts: [] };
        }

        // CODE_REVIEW / CODE_EXPLANATION / DEBUGGING / OPTIMIZATION / CONVERSION / DOCUMENTATION
        const res = await llm.invoke(`
The user's intent is:

${intent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:

${state.prompt}
`);
        console.log(`[codingAgent] ${intent} response generated (${Date.now() - t0}ms)`);
        return { ...state, aiResponse: res.content, artifacts: [] };

    } catch (error) {
        console.error("[codingAgent] error:", error?.message || error);
        return {
            ...state,
            aiResponse: error?.message || "Code generation failed.",
            artifacts: []
        };
    }
};

async function generateFiles(llm, state, { fileNames, extraRules }) {
    const prompt = `
You are AxioraAI Coding Agent.

Generate the requested project/component.

Default stack:
- HTML
- CSS
- JavaScript

${extraRules}

Return ONLY valid JSON.

Schema:

{
  "files": [
${fileNames.map(name => `    { "name": "${name}", "content": "..." }`).join(",\n")}
  ]
}

Rules:
- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No code fences
- Never mention intent

User Request:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    console.log("RAW CODING RESPONSE:");
    console.log(res.content);

    let data;
    try {
        data = JSON.parse(res.content);
    } catch (parseErr) {
        console.error("CODE GENERATION JSON PARSE ERROR:", parseErr.message);
        return {
            ...state,
            aiResponse: "I generated code but the output wasn't valid — please try again.",
            artifacts: []
        };
    }

    return {
        ...state,
        aiResponse: "Code Generated Successfully.",
        artifacts: [
            {
                id: Date.now(),
                type: "Project",
                title: state.prompt,
                files: data.files || []
            }
        ]
    };
}