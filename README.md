# Open Path

A small, buildless guide to exploring a move to Australia. The site uses vanilla HTML, CSS, and JavaScript. Pathway answers are not saved unless a visitor explicitly creates a move plan. The plan's direction and checklist progress stay in local browser storage on that device. The My Progress page combines saved checklist counts without sending them to a server.

## Preview locally

Run a static server from the project directory:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://127.0.0.1:4173`.

## Deploy to GitHub Pages

The GitHub Actions workflow publishes the buildless static site in `dist/` whenever changes are pushed to `main`. Enable GitHub Pages in the repository settings and select GitHub Actions as the deployment source.

The government and transport sources listed on the source notes page are checked weekly by the `Check official guide source links` workflow. Run it manually from the Actions tab when reviewing sources. A successful link check does not verify that rules or Open Path guidance are current.

## Deploy to Cloudflare Workers

Cloudflare deployment remains independent of GitHub Pages. Wrangler serves the files in `dist/` as static assets. With Wrangler installed and authenticated, run:

```sh
wrangler deploy
```
