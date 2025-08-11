import { execa } from "execa";

export async function ensureRepo(): Promise<void> {
  await execa("git", ["rev-parse", "--is-inside-work-tree"]);
}

export async function getStagedDiff(): Promise<string> {
  const { stdout } = await execa("git", ["diff", "--staged", "--patch", "--no-color"]);
  return stdout.trim();
}

export async function getTopLevel(): Promise<string> {
  const { stdout } = await execa("git", ["rev-parse", "--show-toplevel"]);
  return stdout.trim();
}

export function extractScopeFromPaths(diff: string): string | null {
  // très simple : prend le 1er dossier top-level dans les paths +/-
  const re = /^diff --git a\/([^\/\s]+)\/?/m;
  const m = diff.match(re);
  if (m && m[1]) {
    const candidate = m[1].replace(/[^\w.-]/g, "").slice(0, 30);
    return candidate || null;
  }
  return null;
}

export async function commit(message: string): Promise<void> {
  await execa("git", ["commit", "-m", message]);
}
