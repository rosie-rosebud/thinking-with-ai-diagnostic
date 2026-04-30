# Thinking with AI — Diagnostic

The interactive diagnostic quiz for thinkingwithai.co.

## Running it on your laptop

You need Node.js and the Netlify CLI installed. If you've followed the setup
walkthrough, Node.js is already there.

First-time setup (only do this once):

```
cd thinking-with-ai-diagnostic
npm install
npm install -g netlify-cli
```

Create a file called `.env` in this folder with your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

(There's a `.env.example` file showing the format.)

Then, every time you want to run it:

```
netlify dev
```

This will open http://localhost:8888 in your browser. The diagnostic runs there.
Changes you make to the code will hot-reload automatically.

## What's where

- `src/thinking-with-ai-diagnostic.jsx` — the whole diagnostic (questions,
  scoring, types, report rendering). This is the main file you'd ever edit.
- `src/main.jsx` — React entry point, rarely touched.
- `index.html` — the page shell (loads fonts, sets up the root).
- `netlify/functions/generate-report.mjs` — the serverless function that
  forwards quiz responses to Anthropic's API (keeps the API key secret).
- `public/logo.png` — the site logo.
- `netlify.toml` — Netlify's build config.

## Deploying

Any push to the `main` branch on GitHub auto-deploys to Netlify — assuming
you've connected the repo to Netlify. Set `ANTHROPIC_API_KEY` in Netlify's
Environment Variables panel (not committed to the repo).
