#!/usr/bin/env node
import chalk from "chalk";
import { loadConfig, getApiKey } from "./config.js";
import { ensureRepo, getStagedDiff, extractScopeFromPaths, commit } from "./git.js";
import { buildPrompt, chatCompletion } from "./mistral.js";
import { chooseAction, editMessage } from "./prompts.js";

async function main() {
  try {
    const cfg = loadConfig();
    await ensureRepo();

    const diffFull = await getStagedDiff();
    if (!diffFull) {
      console.error(chalk.red("No staged changes. Stage files first (git add)."));
      process.exit(1);
    }

    // Troncature pour éviter d’exploser le prompt/token
    const diff = diffFull.length > cfg.maxInputChars
      ? diffFull.slice(0, cfg.maxInputChars) + "\n...\n[diff truncated]"
      : diffFull;

    const scope = cfg.scopeFromPaths ? extractScopeFromPaths(diffFull) : null;

    const { system, user } = buildPrompt({
      diff,
      style: cfg.commitStyle,
      includeBody: cfg.includeBody,
      scope
    });

    const apiKey = getApiKey();

    let currentMessage = await chatCompletion({
      apiKey,
      model: cfg.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    });

    function sanitizeCommitMessage(msg: string): string {
      // Retire le gras Markdown et les backticks
      return msg
        .replace(/^\s*\*\*(.*?)\*\*\s*$/gm, "$1") // enlève **gras**
        .replace(/`/g, "")                        // enlève les backticks
        .trim();
    }    

    while (true) {
      const action = await chooseAction(currentMessage);
      if (action === "cancel") {
        console.log(chalk.yellow("Cancelled."));
        process.exit(0);
      }
      if (action === "edit") {
        const edited = await editMessage(currentMessage);
        if (!edited) continue;
        currentMessage = edited;
        continue;
      }
      if (action === "regen") {
        currentMessage = await chatCompletion({
          apiKey,
          model: cfg.model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user }
          ],
          temperature: 0.6
        });
        continue;
      }
      if (action === "commit") {
        const cleanMessage = sanitizeCommitMessage(currentMessage);
        // Garder uniquement la 1ère ligne si l’utilisateur préfère un message court ? Non : on laisse tel quel.
        await commit(cleanMessage);
        console.log(chalk.green("Committed ✔"));
        process.exit(0);
      }
    }
  } catch (err: any) {
    console.error(chalk.red("Error:"), err?.message || err);
    process.exit(1);
  }
}

main();
