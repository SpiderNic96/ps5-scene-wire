# PS5 Scene Wire

PS5 jailbreak and homebrew headlines. Written scene stories, a firmware status chart, and live app releases pulled from GitHub.

No build step: a static `index.html`, two JSON files, and one Vercel function.

```
index.html            the whole front end
data/stories.json     written stories (newest first is fine, the page sorts by date)
data/firmware.json    the firmware chart: coverage bars, 14.xx marks, latest version
api/releases.js       GET /api/releases, pulls GitHub releases, cached 1 hour on Vercel
api/discover.js       GET /api/discover, searches GitHub for new PS5 homebrew repos, cached 1 hour
                      (/api/discover?q=<search> runs one custom search)
api/_sources.js       the tracked app repos, grouped by category
```

## Put it online

1. Create an empty GitHub repo, then from this folder:
   ```sh
   git init && git add . && git commit -m "PS5 Scene Wire"
   git branch -M main
   git remote add origin https://github.com/SpiderNic96/<repo-name>.git
   git push -u origin main
   ```
2. On vercel.com: Add New, Project, import the repo, Deploy. No settings to change.

Every push to `main` redeploys.

### Optional: stop GitHub rate limits

Without a token, the feed reads each repo's public release feed instead of the API (GitHub only allows 60 API calls an hour without one). That works, but pre-release flags are guessed from the tag name. With a token it uses the API for all 55 apps:

1. GitHub, Settings, Developer settings, Fine-grained tokens, Generate new token. Public repositories, read-only. No extra permissions.
2. Vercel project, Settings, Environment Variables: add `GITHUB_TOKEN` with that value, then redeploy.

## Add a story

Add an object to `data/stories.json`:

```json
{
  "id": "short-url-slug",
  "date": "2026-10-20",
  "tag": "Exploit",
  "title": "Headline in sentence case",
  "summary": "One or two lines shown on the front page.",
  "body": ["Paragraph one.", "Paragraph two."],
  "sources": [{ "name": "Site name", "url": "https://..." }]
}
```

Tags: `Exploit`, `Firmware`, `Tool`, `Store`, `Emulator`, `PC & Linux`, `Port`, `Scene`. Each tag except `Scene` maps to a topic filter. Each story gets a permalink at `/#<id>`.

## Track another app

Add a line to `api/_sources.js` with a category (`J`, `T`, `S`, `E`, `P`, `R`) and the GitHub `owner/repo`. Repos that don't exist are hidden; repos with no releases show "No releases yet".

## Update the firmware chart

Edit `data/firmware.json`. `coverage` entries with `from`/`to` draw a bar, entries with `versions` draw dots. `marks` are the vertical lines for 14.xx. Change `latest` when Sony ships a new firmware.
