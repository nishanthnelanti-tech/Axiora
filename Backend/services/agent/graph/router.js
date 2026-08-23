import { getModel } from "../config/llmModels.js";

const ROUTER_TIMEOUT_MS = Number(process.env.ROUTER_TIMEOUT_MS || 15000);

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
  }

  const llm = await getModel("router");
  const prompt = `You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- vision

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

vision:
Generate image,
create image

Return ONLY one word:

chat
search
coding
pdf
ppt
vision

User Query:
${state.prompt}
`;

  const response = await Promise.race([
    llm.invoke(prompt),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Router timeout")), ROUTER_TIMEOUT_MS),
    ),
  ]);

  return {
    ...state,
    agent: String(response.content).trim().toLowerCase(),
  };
};
