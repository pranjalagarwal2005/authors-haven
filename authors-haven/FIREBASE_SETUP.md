# Firebase Setup Guide

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** (or "Create a project").
3. Name it `authors-haven` and follow the setup steps (you can disable Google Analytics).

## 2. Enable Authentication
1. Valid your new project, go to **Build > Authentication** in the left sidebar.
2. Click **"Get Started"**.
3. In the **Sign-in method** tab:
   - **Email/Password**: Click it, **Enable** it, and click **Save**.
   - **Google**: Click it, **Enable** it.
     - Select your **Project support email**.
     - Click **Save**.

## 3. Get Project Configuration
1. Click the **Gear icon** (Settings) next to "Project Overview" in the top-left.
2. Select **"Project settings"**.
3. Scroll down to the **"Your apps"** section.
4. Click the **Web icon** (`</>`).
5. Register the app (name it `authors-haven-web`).
6. You will see a `const firebaseConfig = { ... }` object. **Keep this open.**

## 4. Add Config to `.env`
1. Open `c:\Projects\authors-haven\.env`.
2. Replace everything with your Firebase keys from the config object:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 5. Restart server
Run `npm run dev` again.
