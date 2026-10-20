# ICEMAN CODE LEARN

A responsive, dark navy and neon-blue coding academy inspired by the supplied dashboard screenshot.

## Files
- `index.html` — **complete standalone website** with inline CSS and JavaScript. Open this file directly in a browser for the frontend experience.
- `public/index.html` — same website shell using separate CSS and JS files for deployment.
- `public/styles.css` — responsive theme and layout.
- `public/app.js` — navigation, editor, practice labs, local progress, projects/snippets, developer tools, and AI chat frontend.
- `server.js` — Express static server and Gemini AI endpoint.
- `.env.example` — environment variable template.

## Run on a computer or Node.js hosting
1. Install Node.js 18 or later.
2. Run `npm install`
3. Copy `.env.example` to `.env` and add your Gemini API key to `GEMINI_API_KEY`.
4. Run `npm start`
5. Open `http://localhost:3000`.

## GitHub / hosting
Upload the project files to a repository. Configure `GEMINI_API_KEY` in the hosting provider's environment variables (never commit `.env`). Build command: `npm install`. Start command: `npm start`.

## Functionality and limits
Navigation, search, theme switching, lessons, local profile/progress, project creation, snippets, browser-side tools, HTML preview, JavaScript examples, and practice labs work in the browser. Gemini chat works when the backend is running and `GEMINI_API_KEY` is configured. Python is intentionally example-only; it is not executed on a server. Accounts, persistent multi-user database, admin authorization, and APK upload are not implemented in this starter. Do not expose owner controls publicly until proper backend authentication and authorization are added.

For production, add a persistent database, secure authentication/session storage, CSRF protection as appropriate, and a stronger Content Security Policy.
