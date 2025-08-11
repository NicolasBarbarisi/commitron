import prompts from "prompts";
import chalk from "chalk";

export async function chooseAction(proposal: string) {
  console.log("\n" + chalk.bold("Proposal:") + "\n" + proposal + "\n");
  const { action } = await prompts({
    type: "select",
    name: "action",
    message: "What next?",
    choices: [
      { title: "✅ Commit with this message", value: "commit" },
      { title: "🔁 Regenerate", value: "regen" },
      { title: "✏️  Edit manually", value: "edit" },
      { title: "🚫 Cancel", value: "cancel" }
    ],
    initial: 0
  });
  return action as "commit" | "regen" | "edit" | "cancel";
}

export async function editMessage(initial: string): Promise<string | null> {
  const { text } = await prompts({
    type: "text",
    name: "text",
    message: "Edit commit message:",
    initial
  });
  if (typeof text !== "string") return null;
  return text.trim();
}
