# 🌾 FarmPrompt — AI Image Prompt Generator

A farm & agricultural educational image prompt generator powered by Meta Llama 4 (via Groq — **completely free**).

## ✨ Features
- Generate detailed AI image prompts for farm topics
- 6 aspect ratio options (1:1, 16:9, 9:16, 4:3, 3:2, 2:3)
- Optimized for Meta AI, Midjourney, and DALL-E
- Animated character-by-character prompt reveal
- "Use in Meta AI" one-click button
- Recent prompts history
- Real Next.js backend API route

---

## 🚀 Deploy to Vercel (Step by Step)

### Step 1: Get your FREE Groq API key
1. Go to **[console.groq.com](https://console.groq.com)**
2. Sign up for a free account
3. Click **"API Keys"** in the left sidebar
4. Click **"Create API Key"**
5. Copy your key — it starts with `gsk_...`

> **Why Groq?** Groq runs Meta's Llama 4 models for free. It's officially supported by Meta.

### Step 2: Push to GitHub
```bash
cd farm-prompt-gen
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/farm-prompt-gen.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to **[vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Click **"Environment Variables"**
5. Add:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `gsk_your_key_here`
6. Click **"Deploy"**

That's it! Your site will be live in ~2 minutes. 🎉

---

## 💻 Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Your free Groq API key from console.groq.com |

---

## 📁 Project Structure

```
farm-prompt-gen/
├── pages/
│   ├── api/
│   │   └── generate.js    ← Real backend API (calls Meta Llama via Groq)
│   ├── _app.js
│   └── index.js           ← Main UI page
├── styles/
│   └── globals.css        ← All styles + animations
├── .env.example
├── vercel.json
└── package.json
```

---

## 🌱 How to Use

1. Enter a **farm topic** (e.g., "rice paddy irrigation")
2. Choose a **visual style**, **mood**, **season**, and **audience level**
3. Select your **aspect ratio** (for Meta AI: use 1:1 or 9:16)
4. Click **Generate Farm Prompt**
5. Watch the prompt animate character by character
6. Click **"✦ Use in Meta AI"** to open it directly in meta.ai

### Meta AI Tip
Paste the generated prompt into [meta.ai](https://meta.ai) and type:
```
Imagine: [your generated prompt]
```

---

## 🤖 AI Models Used
- **Primary:** `meta-llama/llama-4-scout-17b-16e-instruct` (Meta Llama 4 Scout)
- **Fallback:** `llama-3.3-70b-versatile` (Llama 3.3 70B)

Both are completely **free** on Groq's API.
