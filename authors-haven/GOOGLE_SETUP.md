# Google Sign-In Setup Instructions

## IMPORTANT: Google Client ID Required
The error `Error 401: invalid_client` occurs because you haven't provided a valid **Google Client ID**. The code is currently using the placeholder `YOUR_GOOGLE_CLIENT_ID_HERE`.

I cannot generate this ID for you; it must come from your Google Cloud account.

## Steps to Fix

1.  **Get your Client ID**: Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
    - Create credentials for a **Web Application**.
    - Add `http://localhost:5173` to **Authorized JavaScript origins**.
    - Add `http://localhost:5173` and `http://localhost:5173/auth` to **Authorized redirect URIs**.
    - Copy the **Client ID**.

2.  **Update `.env`**:
    - Open `c:\Projects\authors-haven\.env`
    - Replace the placeholder with your actual Client ID:
      ```bash
      VITE_GOOGLE_CLIENT_ID=your-actual-client-id-from-google
      ```

3.  **Update `server/.env`**:
    - Open `c:\Projects\authors-haven\server\.env`
    - Add/Update the `GOOGLE_CLIENT_ID` variable there as well:
      ```bash
      GOOGLE_CLIENT_ID=your-actual-client-id-from-google
      ```

4.  **Restart Servers**:
    - You **MUST** stop and restart both the frontend (`npm run dev`) and backend (`node server/index.js`) for the changes to load.

**Once you have pasted the ID and restarted the servers, try signing in again.** The "Hello [Name]" feature is already implemented and will appear once you successfully log in.
