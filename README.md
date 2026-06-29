# Quick Tab Launcher (Better Omni)

A lightweight Chrome extension (Manifest V3) to instantly search, switch, and manage your open tabs and bookmarks via a keyboard shortcut.

Built with **React 19 + TypeScript + Vite + Ant Design**.

## Features

- ⚡ Open a centered popup via `Cmd+Shift+K` (macOS) / `Ctrl+Shift+K` (Windows/Linux)
- 🔍 Fuzzy search across all open tabs and bookmarks (title + URL, scored ranking)
- 🔄 One-click switch to a tab (auto-focuses its window) or open a bookmark
- ❌ Close individual tabs from the result list
- 🧹 Detect duplicate tabs by URL and close them in one click
- 🎯 Match highlighting in results
- 🧪 Built-in mock data fallback so the UI runs under plain `vite dev` outside Chrome

## Keyboard Shortcuts

| Action | Key |
| --- | --- |
| Open launcher | `Cmd/Ctrl+Shift+K` |
| Navigate results | `↓` / `↑` |
| Select / switch / open | `Enter` |
| Close popup | `Esc` |

You can customize the shortcut in Chrome → Settings → Extensions → Keyboard shortcuts.

## Project Structure

```
public/
  manifest.json       # MV3 manifest
  background.js       # service worker: opens centered popup
  icon*.png           # extension icons
src/
  App.tsx             # entry component
  main.tsx
  components/
    SearchInterface.tsx   # orchestrates search state + keyboard nav
    SearchInput.tsx       # input + refresh
    SearchResults.tsx     # result list, duplicate detection, highlight
    WelcomeGuide.tsx      # first-run guide
    LandingPage.tsx       # legacy landing (router-based, currently unused)
  services/
    chromeService.ts      # chrome.tabs / chrome.bookmarks wrappers + mock fallback
  utils/
    search.ts             # scoring-based search engine
  types/
    index.ts              # TabInfo / BookmarkInfo / SearchResult
  assets/
    index.ts              # base64 fallback favicon
```

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm / pnpm

### Install

```bash
npm install
# or
pnpm install
```

### Develop (in browser)

```bash
npm run dev
```

Opens Vite dev server. Because `chromeService` falls back to mock data when `chrome.*` APIs are unavailable, you can iterate on the UI without loading it as an extension.

### Build

```bash
npm run build
```

Outputs to `dist/`.

### Load as an unpacked extension

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the `dist/` directory.
5. Press `Cmd/Ctrl+Shift+K` to launch.

### Lint

```bash
npm run lint
```

## Tech Notes

- Path alias `@` → `/src` (see `vite.config.ts`).
- The popup is a real Chrome window (`chrome.windows.create` with `type: 'popup'`, 700×650, centered over the current window) rather than the default action popup, so it stays open while you interact with underlying tabs.
- `chromeService` automatically falls back to mock tabs/bookmarks when `chrome.*` is missing, making the UI fully runnable under `vite dev`.

## Releasing

Version info lives in two places that should be kept in sync:

- `package.json` → `version`
- `public/manifest.json` → `version`

Before publishing a new version:

1. Bump both version numbers to the same value.
2. Run `npm run build` and verify the `dist/` works as an unpacked extension.
3. Commit with a message like `chore: release v1.0.5`.
4. Tag the commit: `git tag v1.0.5 && git push origin v1.0.5`.
5. (Optional) Zip `dist/` for the Chrome Web Store upload.

## License

MIT © 2025 yuanjiankang. See [LICENSE](./LICENSE).
