# 🕵️‍♂️ MysteryVerse – AI-Powered Mystery Investigation Room

> **An immersive, high-stakes detective investigation game powered by Google Gemini AI, React, Tailwind CSS, Node.js, Express, and MongoDB.**

---

## 🔍 Features Overview

- **Interactive Crime Scene Exploration**: Inspect 2D/isometric crime scenes with forensic tools (Magnifier, UV light, Fingerprint dust, Digital Scanner).
- **Unscripted AI Suspect Interrogations**: Real-time conversations with dynamic suspects powered by Google Gemini, complete with hidden secrets, behavioral tells, and a live psychological **Stress Meter**.
- **Contradiction Confrontation System**: Catch suspects in lies by presenting physical clues to shatter false alibis.
- **Evidence String Board**: Organize clues, suspects, and timelines on a noir murder board with red connecting strings.
- **AI Chief Inspector & Deduction Chamber**: Gemini evaluates your murder hypothesis (culprit, motive, method, corroborating evidence) and generates a cinematic case post-mortem.
- **Detective Ranking & Global Leaderboards**: Mathematical scoring rewarding deductive logic, interrogation efficiency, and forensic thoroughness.

---

## 🛠️ Technology Stack

- **Frontend**: React 18+ (Vite), Tailwind CSS, Lucide Icons, Web Audio API
- **Backend**: Node.js, Express.js (RESTful API, Rate Limiting, JWT)
- **Database**: MongoDB + Mongoose
- **Artificial Intelligence**: Google Gemini API (`gemini-1.5-flash` / `gemini-1.5-pro`)

---

## 📁 Project Architecture

```
MysteryVerse/
├── client/          # React + Vite + Tailwind CSS frontend
│   ├── public/      # Audio SFX, case artwork, favicon
│   └── src/
│       ├── assets/  # SVGs, textures
│       ├── components/
│       │   ├── common/
│       │   ├── dossier/
│       │   ├── evidence/
│       │   ├── interrogation/
│       │   ├── deduction/
│       │   └── leaderboard/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── utils/
├── server/          # Node.js + Express backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── prompts/
│       ├── routes/
│       ├── services/
│       └── utils/
├── SPEC.md          # Complete Technical Specification Document
├── .gitignore
└── .env.example
```

---

## 📋 Technical Specification

Please refer to [`SPEC.md`](./SPEC.md) for the complete blueprint covering:
- Detailed user flows & detective game loop
- Full UI/UX page-by-page specifications & noir design system
- Complete REST API endpoint reference
- Database schemas (Users, Cases, Suspects, Clues, Investigation Sessions, Leaderboard)
- Gemini prompt engineering architectures & anti-jailbreak guardrails
- Mathematical scoring engine & Detective Rank matrix
- Security protocols & acceptance criteria
