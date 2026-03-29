# Vectira Design Studio (Vectora repo)

This workspace contains the static front-end (`vectora.html`) and a small Node.js backend (`server.js`) to support image uploads and a simple content API.

What I changed
- Brand text updated to "Vectira" across the UI.
- Added WhatsApp CTA in the hero and contact areas (uses phone from settings).
- Admin panel now supports uploading a logo and uploading portfolio images. Uploads try the local server first and fallback to storing images as data URLs in localStorage.
- Added `content.json` for server-backed content and `server.js` to accept uploads and save content.

Run locally
1. Install dependencies:

```powershell
cd "c:\Users\HNSA\Desktop\VECTORA"
npm install
```

2. Start server:

```powershell
npm start
```

3. Open http://localhost:3000/vectora.html in your browser.

Admin panel
- Click the "Admin" button in the footer.
- Username: `admin` Password: `vectora2024` (you can change these inside `vectora.html` if desired).
- Use the Settings tab to upload a logo or set a logo URL. Use Portfolio -> Add Work to upload new images.

Deploy to your GitHub repo
1. Commit all files in this folder.
2. Push to your GitHub repository (replace remote URL with your repo):

```powershell
git init
git add .
git commit -m "Update site with admin upload and WhatsApp CTA"
git remote add origin https://github.com/iteducationcenter77-pixel/Vectora.git
git push -u origin main
```

Note: I cannot push to your GitHub repository from here. After you run the `git push` command above from your machine, GitHub Pages or your chosen host will be able to serve the updated site. If you want me to prepare a branch or create a PR, grant access or provide repo credentials.
