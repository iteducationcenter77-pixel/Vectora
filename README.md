# Vectira Design Studio (Vectora repo)

This workspace contains the static front-end (`vectora.html`) and a small Node.js backend (`server.js`) to support image uploads and a simple content API.

What I changed
- Brand text updated to "Vectira" across the UI.
- Added WhatsApp CTA in the hero and contact areas (uses phone from settings).
- Admin panel now supports uploading a logo and uploading portfolio images. Uploads try the local server first and fallback to storing images as data URLs in localStorage.
- Added `content.json` for server-backed content and `server.js` to accept uploads and save content.

Supabase integration for Vercel deployment
- This repo now contains serverless API routes under `/api/` that can be deployed on Vercel. They expect Supabase environment variables to be set in your Vercel project:
	- `SUPABASE_URL` — your Supabase project URL
	- `SUPABASE_ANON_KEY` — Supabase anon key (used for reading content)
	- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (used by serverless functions to upload files and save content). Keep this secret.

API endpoints (serverless)
- `GET /api/content` — reads `content.json` from the Supabase Storage bucket `content` (public read). Falls back to local `content.json` only when running locally with the Express server.
- `POST /api/save` — accepts site JSON and writes `content.json` into the `content` bucket (requires `SUPABASE_SERVICE_ROLE_KEY`).
- `POST /api/upload` — accepts JSON { filename, data } where `data` is a data-URL (base64). Stores the image in the `uploads` bucket and returns a public URL.
- `GET /api/ping` — simple health check.

Required Supabase setup
1. Create a Supabase project.
2. In the Supabase Dashboard → Storage, create two buckets: `uploads` and `content`. Set them to public (or configure policies accordingly).
3. Add the project keys to your Vercel project environment variables as above. `SUPABASE_SERVICE_ROLE_KEY` must be kept secret.

Deploying to Vercel
1. Push this repository to GitHub (already done).
2. In Vercel, import the repository and set the environment variables.
3. Deploy — the serverless APIs will use Supabase for persistence.

Local development
- If you prefer to run a local server with filesystem persistence, you can still run `server.js` locally. That server persists files to `assets/uploads` and `content.json` in the repo. When deploying to Vercel, the serverless APIs and Supabase should be used instead.

Environment variables (local)
1. Copy `.env.example` to `.env` in the project root.
2. Fill the `SUPABASE_*` values (or leave blank for local-only testing).
3. Install dependencies and run locally:

```powershell
npm install
npm run dev
```

Notes
- The repo now uses `dotenv` for local development so `.env` is loaded when running `server.js` locally. Do NOT commit your `.env` or service role key — keep those secret. Use Vercel Project Settings to add production environment variables.
 
Security note — rotate exposed keys
If you previously committed real Supabase keys into the repository (for example inside `.env.example`), those values may be present in the commit history. Service role keys are powerful — you should rotate/replace them immediately in the Supabase Dashboard and update the Vercel environment variables. If you want, I can help remove secrets from the repo history using the BFG or git filter-repo and then create replacement keys.


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

SQL: Create database tables
---------------------------------
If you want the site to store contact messages, clients and works in your Supabase Postgres DB, run the SQL migration included in `migrations/create_tables.sql`.

1. Get your Supabase database connection string:
	- In the Supabase Dashboard go to Settings → Database → Connection Pooling/Connection string and copy the `DATABASE_URL` (the direct Postgres connection string).

2. Create a `.env` file in the project root (do NOT commit it) with the following content:

```
DATABASE_URL="postgresql://user:password@db.host:5432/postgres"
```

3. Run the migration script (requires Node and `npm install` to have been run):

```powershell
npm install
npm run migrate
```

The migration will create three tables: `clients`, `works`, and `contacts` and add indexes on `created_at` for common queries.

You can inspect the SQL in [migrations/create_tables.sql](migrations/create_tables.sql).
