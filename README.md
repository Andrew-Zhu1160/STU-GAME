# STU-GAME 🎮
### A Mini Game Collection Website

> Sometimes you just need some chill little games to calm down.

---

## 🎈 Overview

**STU-GAME** is a full-stack mini game collection web application featuring games that provide stress relief and are easy to play. Sign up and log in with your account to start playing 🎮, watch your speed coins skyrocket in minutes 🪙, and spend them in the shop 🏪.

---

## 👥 Team

This is currently a solo project by a Computer Engineering undergrad at the University of Waterloo.

---

## 🔄 Recent Updates

- 🍕 Introduced **Pizza Slicer** — the third game in the STU-GAME collection, and the first featuring dual control mode (hand control via AI model or manual mouse control)
- Added a loading screen
- Optimized UI

---

## 🖥️ Tech Stack

| Component  | Technology             |
|------------|------------------------|
| Frontend   | React (Vite)           |
| Backend    | Express.js / Node.js   |
| Database   | MongoDB Atlas (AWS)    |
| Server     | Vercel (serverless function) |

---

## 📂 File Structure

```
stuGame/
├── gameFrontEnd/
│   └── stu-game-frontend/
│       └── src/
│           ├── ballClutchGamePage/       # Physics-based arcade game
│           │   └── ballClutchGamePage.jsx
│           ├── loginPage/                # User authentication UI
│           │   └── loginPage.jsx
│           ├── mainPage/                 # Game selection dashboard
│           │   └── mainPage.jsx
│           ├── pizzaSlicerGamePage/      # AI hand-tracking pizza game
│           │   └── pizzaSlicerGamePage.jsx
│           ├── towerDefenceGamePage/     # Strategic defense game
│           │   └── towerDefenceGamePage.jsx
│           ├── assets/                   # Shared global assets
│           ├── fonts/                    # Custom typography
│           ├── images/                   # UI textures and sprites
│           ├── App.jsx                   # Root component & routing
│           └── main.jsx                  # React entry point
└── gameBackEnd/
    └── src/
        ├── index.mjs                     # Main Express server & API entry
        ├── passwordSecure.mjs            # Auth & encryption utility
        ├── playerSchema.mjs              # user  data
        ├── ballGameSchema.mjs            # ball game settings sheet (only one document)
        ├── pizzaGameSchema.mjs           # pizza game setting sheet (only one document)
        └── towerGameSchema.mjs           # tower game setting sheet (only one document)
```

---

## ⚙️ Requirements

| Component          | Technology             | Version      |
|--------------------|------------------------|--------------|
| Frontend Framework | React                  | ^19.2.0      |
| Build Tool         | Vite                   | ^7.2.4       |
| AI Vision          | MediaPipe Tasks        | ^0.10.32     |
| Physics Engine     | Matter.js              | ^0.20.0      |
| Canvas Rendering   | React-Konva            | ^19.2.1      |
| Backend API        | Express                | ^5.2.1       |
| Database ODM       | Mongoose               | ^9.1.2       |

Before cloning the repo, make sure you have:

- A code editor (VSCode, Cursor, etc.)
- **Node.js** v20.x or higher — [Download here](https://nodejs.org/en/download)
- **npm** v10.x or higher
- **MongoDB** Community Server (local) or an Atlas Cloud account — [Download here](https://www.mongodb.com/try/download/community)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
```

### 2. Install frontend dependencies

```bash
cd gameFrontEnd/stu-game-frontend
npm install
```

### 3. Install backend dependencies

```bash
cd gameBackEnd
npm install
```

### 4. Configure frontend environment

Inside `stu-game-frontend/`, create a `.env` file:

```env
VITE_PORT=5174
VITE_API_URL=http://localhost:3000/api
VITE_MODE=DEV
```

### 5. Configure backend environment

Inside `gameBackEnd/`, create a `.env` file:

```env
# Server Config
PORT=3000
NODE_ENV=development

# Database Config
# Example: mongodb://localhost:27017/stu-game
MONGODB_URL=mongodb://localhost:27017/stu-game

# Security
# Used for encrypting session cookies
SESSION_SECRET=choose_a_long_random_string

# CORS / Frontend Origin
REACT_URL=http://localhost:5174
```

### 6. Run the app

Start the frontend (inside `stu-game-frontend/`):

```bash
npm run dev
```

Start the backend (inside `gameBackEnd/`):

```bash
npm run start:dev
```

The app will be available at: **http://localhost:5174**

> 💡 It is highly recommended to download [MongoDB Compass](https://www.mongodb.com/products/compass) and optionally MongoDB Shell for easier data monitoring and querying.

---

## 💪 Core Features

- Full user account system with sign-up, log-in, and session-based authentication
- 3 canvas-based games built with React-Konva
- A clean main page for browsing games and purchasing in-game items with coins

---

## 💗 Contributions & Suggestions

This project is a work in progress, and I am actively looking for collaborators within the **University of Waterloo** community.

I am serching help with:

- 🎨 **UI/UX Design** — Improving the player interface, game menus, and mobile responsiveness
- 🏗 **System Restructuring** — Optimizing the MERN stack architecture and improving Matter.js physics performance
- 🎮 **New Mini-Games** — Have an idea for a new canvas-based game? Let's build it!

### How to Contribute

1. Fork the repository
2. Create a new feature branch
   ```bash
   git checkout -b featureBranch
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin featureBranch
   ```
5. Open a Pull Request 
