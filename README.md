<div align="center">

# ✍️ Blogiphilia

### *Where Thoughts Take Flight*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=20232a)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&labelColor=20232a)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white&labelColor=20232a)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white&labelColor=20232a)](https://tailwindcss.com/)
[![TipTap](https://img.shields.io/badge/TipTap-v3-6C63FF?labelColor=20232a)](https://tiptap.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-E7088D?logo=framer&logoColor=white&labelColor=20232a)](https://www.framer.com/motion/)

**[🌐 Live Site](https://blogiphilia.netlify.app)** · **[⚡ API](https://masterblogiphilia.onrender.com)** · **[🐛 Report a Bug](https://github.com/ESAditya1729/MasterBlogiphilia/issues)**

</div>

---

## 📖 About

**Blogiphilia** is a full-stack blogging platform built for thoughtful writers and curious readers. It pairs a distraction-free rich-text editor with a vibrant community layer — publish stories, discover fresh perspectives by genre, collect bookmarks, and grow as a writer.

The name says it all: *blog* + *-philia*, the love of blogging. 💜

---

## ✨ Features

### 📝 Writing Experience
- **Rich editor powered by TipTap v3** — Medium-style inline title, bubble menu, highlights, code blocks with syntax highlighting, tables & task lists
- **Smart image handling** — upload from disk, paste or drag-drop straight into the editor, or embed via URL (powered by Cloudinary)
- **YouTube embeds** — drop a link, get a player
- **Autosave & dirty-state guards** — never lose a draft; leaving mid-edit asks first
- **Publish quality gate** — live word count with 100–3,000 word validation before publishing
- **"(edited)" tag** — honest timestamps that show when a published post was revised

### 🌍 Community & Social
- 🔐 Secure auth with JWT, remember-me sessions & password reset flow
- 👍 Like, 🔖 bookmark & 👁️ view tracking on every post
- 🤝 Follow system with follower/following counts and modals
- 👤 Rich profiles — avatars, bio, social links
- 🔎 User search & trending genres/posts discovery

### 📊 Creator Dashboard
- **Overview** — trending posts & genre analytics at a glance
- **Content Management** — your real published posts with Read / Edit / Delete actions and genre filters
- **Bookmarks** — everything you've saved for later, one click away
- **Editor Studio** — quick-launch workspace for new posts

### 🎨 Platform Polish
- 🌗 Full dark/light mode across every page
- 🪄 3D interactions — mouse-tracked tilt cards with glare, floating depth layers, scroll-driven reveals (pure Framer Motion, zero WebGL payload)
- 🛡️ Hardened backend — HTML sanitization, per-resource ownership guards (403), optional-auth public routes
- 🤖 **"Ask Lilly"** — built-in AI writing assistant (Google Gemini)

---

## 🏗️ Architecture

```
MasterBlogiphilia/
├── client/                  # React 19 SPA (Create React App)
│   ├── src/
│   │   ├── components/      # Home page sections, Dash-Editor (TipTap), modals...
│   │   │   └── ThreeD/      # Reusable 3D tilt-card components
│   │   ├── pages/           # Routes: Home, Auth, Dashboard, Profile, Editor...
│   │   ├── contexts/        # AuthContext + ThemeContext
│   │   └── assets/
│   └── public/_redirects    # Netlify SPA routing
│
└── server/                  # Express REST API (ESM)
    ├── controllers/         # blogs, users, auth, media, stats, assistant
    ├── models/              # Mongoose schemas (User, Blog, Feedback)
    ├── routes/              # /api/auth, /api/blogs, /api/users, ...
    ├── middleware/          # protect / optionalAuth (JWT)
    └── config/              # DB + env loading
```

```
┌─────────────┐   HTTPS/JSON    ┌──────────────┐   Mongoose   ┌─────────────┐
│   React SPA  │ ◄────────────► │  Express API  │ ◄──────────► │    MongoDB   │
│  (Netlify)   │                │   (Render)    │              │    Atlas     │
└─────────────┘                 └──────┬───────┘              └─────────────┘
                                       │
                              ┌────────┴────────┐
                              │  Cloudinary · Gemini │
                              └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| MongoDB | Atlas cluster or local instance |

### 1️⃣ Clone & Install

```bash
git clone https://github.com/ESAditya1729/MasterBlogiphilia.git
cd MasterBlogiphilia

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2️⃣ Configure Environment

<details>
<summary><b>🔧 server/.env</b></summary>

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-long-random-secret>
PORT=1000

# Image uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AI assistant ("Ask Lilly") — full Gemini generateContent URL incl. key
Lilly_API_URL=

# Comma-separated allowed origins (falls back to sane defaults)
CORS_ORIGINS=http://localhost:3000
```
*(see `server/.env.example`)*
</details>

<details>
<summary><b>🔧 client/.env</b></summary>

```env
REACT_APP_API_BASE_URL=http://localhost:1000
```
*(no trailing `/api` — endpoints append their own paths)*
</details>

### 3️⃣ Run

```bash
# Terminal 1 — API on :1000
cd server && npm start

# Terminal 2 — SPA on :3000
cd client && npm start
```

Open **http://localhost:3000** 🎉

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` · `/login` | Create account / sign in |
| `GET` | `/api/blogs/trending` · `/trending-genres` | Discovery feeds |
| `GET` | `/api/blogs/:id` | Single post (+ auto view count, like/bookmark state) |
| `POST` | `/api/blogs` | Create or upsert post |
| `PUT` | `/api/blogs/:id` | Update *(author/admin only)* |
| `DELETE` | `/api/blogs/:id` | Delete *(author/admin only)* |
| `PUT` | `/api/blogs/:id/like` · `/:id/bookmark` | Toggle reactions |
| `GET` | `/api/blogs/bookmarks` | Your saved posts |
| `GET` | `/api/blogs/status/:status` | Your drafts/published/archived |
| `POST` | `/api/users/follow/:userId` | Toggle follow |
| `POST` | `/api/media/upload` | Image upload → Cloudinary |
| `POST` | `/api/assistant/generate` | AI content generation |

> All write routes are ownership-guarded and input-sanitized (`sanitize-html`).

---

## ☁️ Deployment

| Layer | Provider | Notes |
|-------|----------|-------|
| Frontend | **Netlify** — [blogiphilia.netlify.app](https://blogiphilia.netlify.app) | CRA build; `public/_redirects` handles SPA deep links |
| Backend | **Render** — [masterblogiphilia.onrender.com](https://masterblogiphilia.onrender.com) | Blueprint in `server/render.yml`; free tier sleeps (~30–60s cold start) |
| Database | **MongoDB Atlas** | Connection string in `MONGO_URI` |

**Checklist for production:**
- [ ] Client: `REACT_APP_API_BASE_URL=https://masterblogiphilia.onrender.com`
- [ ] Server: `CORS_ORIGINS` includes your frontend origin(s)
- [ ] Server: strong `JWT_SECRET`, Cloudinary & Gemini keys set

---

## 🗺️ Roadmap

- [ ] Real analytics dashboard tab (`/api/blogs/stats` is already live)
- [ ] Comments on posts
- [ ] Newsletter/email digest
- [ ] Draft sharing & collaboration

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Fork → create a branch → commit → open a PR
git checkout -b feature/amazing-feature
```

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">

**Made with 💜 by [Aditya Mukherjee](https://github.com/ESAditya1729)**

*CEO & Founder, Blogiphilia*

⭐ Star this repo if Blogiphilia helped you share your thoughts!

</div>
