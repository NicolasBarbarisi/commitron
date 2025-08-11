type ChatMessage = { role: "system" | "user"; content: string };

export type MistralOptions = {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
};

type MistralChatResponse = {
  choices?: Array<{
    message?: { content?: string };
    delta?: { content?: string };
  }>;
};

export async function chatCompletion({
  apiKey,
  model,
  messages,
  temperature = 0.3,
}: MistralOptions): Promise<string> {
  const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 256,
    }),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Mistral API error ${resp.status}: ${body}`);
  }

  const data = (await resp.json()) as MistralChatResponse;

  const text =
    data?.choices?.[0]?.message?.content?.trim() ??
    data?.choices?.[0]?.delta?.content?.trim() ??
    "";

  if (!text) throw new Error("Empty response from Mistral.");
  return text;
}

export function buildPrompt({
  diff,
  style,
  includeBody,
  scope,
}: {
  diff: string;
  style: "conventional" | "plain";
  includeBody: boolean;
  scope?: string | null;
}): { system: string; user: string } {
  const system = [
    "You are an assistant that writes excellent Git commit messages.",
    "Rules:",
    "- Write in English.",
    "- Be concise and specific.",
    "- Do NOT invent changes; only use the diff.",
    includeBody
      ? "- Provide a single-line summary, then an optional short body with bullets."
      : "- Provide a single-line summary only.",
    style === "conventional"
      ? "- Use Conventional Commits. Types: feat, fix, refactor, docs, test, chore, perf, build, ci, style."
      : "- No particular prefix required.",
  ].join("\n");

  const scopeFmt = scope && style === "conventional" ? `(${scope})` : "";

  const examples =
    style === "conventional"
      ? `Example:
feat${scopeFmt}: add rate limiting to public API

- limit 100 req/min per IP using sliding window
- return 429 with retry-after header`
      : `Example:
Add rate limiting to public API

- 100 req/min per IP using sliding window
- Return 429 with retry-after header`;

  const user = [
    `Here is a git diff. Write ONE commit message respecting the rules above.`,
    `Diff:\n${diff}`,
    examples,
  ].join("\n\n");

  return { system, user };
}
