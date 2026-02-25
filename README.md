# 🌈 FunEnglish Kids

A colorful, interactive website for children (ages 4–10) to learn English in a fun and engaging way.

## Features

- 🔤 **Alphabet Section** – 26 animated letter cards (A–Z), each with a keyword and emoji. Click a card to hear the letter and word spoken aloud.
- 📚 **Vocabulary Section** – 5 themed categories (Animals, Colors, Numbers, Fruits, Body Parts) with 12 illustrated word cards each. Click any card to hear the word pronounced.
- 🃏 **Memory Match Game** – Flip cards to find matching pairs. Includes a timer, move counter, and Easy/Medium difficulty.
- ❓ **Word Quiz Game** – 10 multiple-choice questions drawn from the vocabulary pool. Instant feedback with score tracking.
- 🎨 **Kid-friendly design** – Vibrant colors, animated floating shapes, smooth transitions, and a fully responsive layout.
- 🔊 **Text-to-speech** – Uses the Web Speech API (where available) to pronounce letters and words out loud.

## Project Structure

```
web_learning_english/
├── index.html          # Main page (all sections)
├── css/
│   └── style.css       # All styles, animations, responsive layout
├── js/
│   ├── data.js         # All learning content (alphabet, vocab, quiz questions)
│   ├── alphabet.js     # Alphabet grid rendering & interaction
│   ├── vocabulary.js   # Vocabulary grid & category switching
│   ├── memory.js       # Memory match game logic
│   ├── quiz.js         # Quiz game logic
│   └── main.js         # Navigation, scroll effects, game tab switching
└── README.md
```

## Getting Started

Open `index.html` in any modern web browser — no build step or server required.

## Deployment

This is a static website — no build step is needed. You can deploy it to any static hosting service.

### GitHub Pages (recommended)

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages on every push to `main`.

1. Go to your repository on GitHub.
2. Navigate to **Settings → Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Push to the `main` branch — the site will be live at `https://<username>.github.io/web_learning_english/`.

### Netlify

1. Go to [netlify.com](https://www.netlify.com/) and sign in with GitHub.
2. Click **Add new site → Import an existing project**.
3. Select this repository.
4. Leave the build command empty and set the publish directory to `.`.
5. Click **Deploy site**.

### Vercel

1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New → Project** and import this repository.
3. Use the default settings (no framework, no build command, output directory `.`).
4. Click **Deploy**.

### Manual / Any Static Host

Copy the project files (`index.html`, `css/`, `js/`) to any web server or static hosting service (e.g., AWS S3, Firebase Hosting, Cloudflare Pages, or a shared hosting provider).
