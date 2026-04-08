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
# Project Structure

```text
stuGame/
├── gameBackEnd/   #entry of the Express js Server
│   ├── src/
│   │   ├── generalMiddleware/   #contain middleware functions that apply to most of the endpoints
│   │   ├── routes/             #contain routers for each games in the game collection website
│   │   ├── schemas/            #contain the schmas for the setting sheet of each game as well as player profile
│   │   ├── settingSheetFunctions/     #contain specific getter functions exports for all files to reference to the game setting sheet
│   │   ├── strategies/                #strategies collection for oauth2.0 (currently only google)
│   │   │   └── googleStrategies.mjs
│   │   ├── utils/                 #contain helper functions (currently only the hash function)
│   │   └── index.mjs          #the entry point of all the routes 
│   ├── .env                   #contain secret for sessions and oauth, and environment dependent url
│   ├── package-lock.json      
│   ├── package.json
│   └── vercel.json             #vercel specific setting
└── gameFrontEnd/
    └── stu-game-frontend/
        ├── public/             #public folder containing general image and model
        │   ├── wasm/           #the hand landmarker model interpreter
        │   ├── gmail.png       #image used in landing page
        │   ├── hand_landmarker.task     #the hand landmarker model inference
        │   ├── instagram.png      #image used in landing page
        │   ├── linkdin.png      #image used in landing page
        │   └── stuGameFav.png   #website fav
        ├── src/
        │   ├── assets/         #react fav (pretty much useless, kept for showing this project is a react project)
        │   ├── ballClutchGamePage/   #game page
        │   ├── fonts/         #fonts use in UI
        │   ├── images/        #img collection, for all games and mainpage Ui
        │   ├── landingPage/    #The website's landing page componenet   (using the newest tailwind and framer motion)
        │   ├── loginPage/      #the website's login page component (for all page componenet, it is usually a jsx file and a module.css)
        │   │   ├── loginPage.jsx
        │   │   └── loginPage.module.css
        │   ├── mainPage/      #website's lobby or mainpage   
        │   │   ├── gameShops/   #specific game shop componenet (created to make mainPage clean)
        │   │   ├── gameData.js   #contain paragraphs for game tutorial
        │   │   ├── mainPage.jsx   #the mainPage componenet (all shop componenets are imported here)
        │   │   └── mainPage.module.css   #stylesheet (shared with all componenet across the folder)
        │   ├── pizzaSlicerGamePage/   #game page 
        │   ├── towerDefenceGamePage/   #game page
        │   ├── App.jsx              #the entry point (contain react router defined for all pages)
        │   ├── App.module.css
        │   ├── index.css
        │   └── main.jsx
        ├── .env             #contain environment specific URL
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        └── package.json









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

#oauth2.0 variable
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

#you will need to go to google api to set trusted url to the url of the callback endpoint

#vectorDB (pinecone) and AI agent variable
#for AI embedding database api key and google AI embedding api key
PINECONE_API_KEY=your_api_key_on_pinecone
PINECONE_HOST=your_pinecone_index_host_url
GOOGLE_AI_API_KEY=your_googleAiStudio_api_key

#for easy switch of model in deployment, this is the most recent
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
GEMINI_LLM_MODEL=gemini-3.1-flash-lite-preview

# CORS / Frontend Origin
REACT_URL=http://localhost:5174

#BACKEND REFERENCE
BACKEND_URL=usually_localhost


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
