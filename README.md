# commitron

> Generate high-quality Git commit messages from your staged changes using **Mistral AI**.

`commitron` analyzes your staged Git diff, sends it to the Mistral API, and proposes a commit message.  
You can **regenerate**, **edit**, or **commit** directly — all from your terminal.

---

## ✨ Features

- **Instant commit messages** generated from your staged changes.
- **Conventional Commits** support out of the box.
- **Interactive mode** with:
  - Regenerate
  - Edit manually
  - Commit immediately
- **Non-interactive mode** for CI or aliases (`--yes`, `--print`).
- **Scope detection** from modified paths.
- Configurable via `.aicommitrc` or environment variables.
- Works with **Node.js 18+** (fetch API native).

---

## 📦 Installation

Global install (recommended):

```bash
npm install -g commitron
```

Or run without installing:

```bash
npx commitron
```

---

## 🔑 Requirements

You need a [Mistral API key](https://console.mistral.ai/):

```bash
export MISTRAL_API_KEY="sk-..."
```

---

## 🚀 Usage

1. Stage your changes:
   ```bash
   git add .
   ```
2. Run:
   ```bash
   commitron
   ```

3. Choose:
   - ✅ Commit with this message
   - 🔁 Regenerate
   - ✏️  Edit manually
   - 🚫 Cancel

---

## ⚙️ Configuration

You can configure `commitron` with environment variables or a `.aicommitrc` file (JSON).

### Environment variables
| Variable | Default | Description |
|----------|---------|-------------|
| `MISTRAL_API_KEY` | **required** | Your Mistral API key |
| `AICOMMIT_MODEL` | `mistral-large-latest` | Model name |
| `AICOMMIT_MAX_INPUT` | `12000` | Max diff characters sent |
| `AICOMMIT_STYLE` | `conventional` | `conventional` or `plain` |
| `AICOMMIT_INCLUDE_BODY` | `true` | Include commit body (true/false) |
| `AICOMMIT_SCOPE_FROM_PATHS` | `true` | Detect scope from file paths |

### `.aicommitrc` example
```json
{
  "model": "mistral-large-latest",
  "maxInputChars": 10000,
  "commitStyle": "conventional",
  "includeBody": true,
  "scopeFromPaths": true
}
```

---

## 📄 CLI Flags

| Flag | Description |
|------|-------------|
| `--print`, `-p` | Print proposed commit and exit |
| `--yes`, `-y` | Commit immediately without prompt |
| `--style=plain` | Disable Conventional Commit formatting |
| `--no-body` | Single-line commit message only |
| `--verbose`, `-v` | Show debug info (diff size, scope, model) |

---

## 🛡 Safety

- **Never** stage secrets or sensitive data before running `commitron`.
- Use `.gitignore` and selective staging (`git add -p`) to control what’s sent to Mistral.
- You can reduce `AICOMMIT_MAX_INPUT` to limit diff size sent to the API.

---

## 🛠 Development

Clone the repo:
```bash
git clone https://github.com/NicolasBarbarisi/commitron.git
cd commitron
npm install
```

Run in dev mode:
```bash
npm run dev
```

Test globally without publishing:
```bash
npm run build
npm link
commitron
```

---

## 📜 License

MIT © [Nicolas Barbarisi](https://github.com/NicolasBarbarisi)
