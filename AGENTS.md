# Codex Optimization Rules (Token Saving Mode)

## 🎯 Goal
Minimize token usage, avoid unnecessary computation, and keep responses concise.

---

## ⚡ Output Rules (VERY IMPORTANT)
- Respond in the **shortest possible way**
- Do NOT explain obvious code
- Do NOT add comments unless asked
- Prefer code over explanation
- Maximum response length: minimal working solution

---

## 📦 Context Usage
- Read ONLY necessary files
- Do NOT scan entire repository unless required
- Avoid loading large files
- Prefer targeted search (specific file/function)

---

## 🚫 Logs & Command Output
- NEVER print full logs
- Summarize outputs in 1–2 lines
- Only report:
  - success / failure
  - key error message

---

## 🔁 Repetition Control
- Do NOT repeat previous answers
- Do NOT restate problem
- Continue from last state

---

## 🧠 Code Strategy
- Make minimal changes (small diffs only)
- Do NOT rewrite full files unless requested
- Reuse existing functions/components
- Follow current project structure strictly

---

## ⚙️ Commands
- Avoid running heavy commands
- Do NOT run build unless necessary
- Prefer:
  - lint
  - test (only if needed)

---

## 📁 Project Assumptions
- Stack: MERN (MongoDB, Express, React, Node.js)
- Frontend: React + Tailwind
- Backend: REST API

---

## ❌ Avoid
- Long explanations
- Large code dumps
- Unused imports
- Adding new dependencies

---

## ✅ Prefer
- Short answers
- Efficient code
- Existing patterns

---

## 🔒 Token Saving Mode
- Think step-by-step internally
- Output only final answer
- Compress responses aggressively