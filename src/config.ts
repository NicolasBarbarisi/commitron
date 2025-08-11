import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export type AiCommitConfig = {
  model: string;
  maxInputChars: number;
  commitStyle: "conventional" | "plain";
  includeBody: boolean;
  scopeFromPaths: boolean;
};

export function loadConfig(cwd = process.cwd()): AiCommitConfig {
  const defaults: AiCommitConfig = {
    model: process.env.AICOMMIT_MODEL || "mistral-large-latest",
    maxInputChars: process.env.AICOMMIT_MAX_INPUT
      ? parseInt(process.env.AICOMMIT_MAX_INPUT, 10)
      : 12000,
    commitStyle: (process.env.AICOMMIT_STYLE as any) || "conventional",
    includeBody: process.env.AICOMMIT_INCLUDE_BODY
      ? process.env.AICOMMIT_INCLUDE_BODY === "true"
      : true,
    scopeFromPaths: process.env.AICOMMIT_SCOPE_FROM_PATHS
      ? process.env.AICOMMIT_SCOPE_FROM_PATHS === "true"
      : true
  };

  const file = resolve(cwd, ".aicommitrc");
  if (existsSync(file)) {
    try {
      const parsed = JSON.parse(readFileSync(file, "utf8"));
      return { ...defaults, ...parsed };
    } catch {
      // ignore invalid config, stick to defaults
    }
  }
  return defaults;
}

export function getApiKey(): string {
  const key = process.env.MISTRAL_API_KEY || process.env.MISTRAL_API_TOKEN;
  if (!key) {
    throw new Error(
      "Missing MISTRAL_API_KEY env. Get it from console.mistral.ai and export it."
    );
  }
  return key;
}
