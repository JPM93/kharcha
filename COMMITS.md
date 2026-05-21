# Git Commit Messages — Kharcha Tracker

---

## Latest Commits (newest first)

---

### fix: resolve infinite call stack on Drive modal open

```
fix: resolve infinite call stack on Drive modal open

- Removed openModal() self-referencing patch via _origOpenModal
  which caused Maximum call stack size exceeded error
- Removed duplicate openModal('drive-modal') call from inside
  openDriveModal() function
- Added drive-modal handler directly inside original openModal()
  as a simple if-check — clean, no recursion

Fixes: RangeError: Maximum call stack size exceeded (app.js:1117)
```

---

### feat: add Google Drive backup & restore integration

```
feat: add Google Drive backup & restore integration

- Google OAuth 2.0 (Token-based, no backend required) via
  Google Identity Services (GSI) library
- Scope: drive.file — app only accesses files it creates,
  not user's full Drive
- Auto-creates "Kharcha Tracker" folder in user's Drive
- Backup: uploads kharcha_backup_YYYY-MM.json to Drive folder;
  updates existing file if same month backup already exists
- Restore: lists all backup files in Drive folder with
  timestamps; shows file picker if multiple backups found
- Shows connected user's name + email after login
- Sign out revokes token via google.accounts.oauth2.revoke()
- Client ID + app name persisted in localStorage
- Added GOOGLE_DRIVE_SETUP.md with full setup guide

Files changed:
  index.html — added Drive modal HTML + Google GSI script tags
  app.js     — added Drive functions (init, backup, restore,
               picker, sign-out, status helpers)
```

---

### feat: add thermal receipt invoice PDF print (3.5 inch)

```
feat: add thermal receipt invoice PDF print (3.5 inch)

- "🖨 Invoice PDF" button added to Shopping page toolbar
- Generates receipt based on currently active filter
  (All / Pending / Bought / Cancelled)
- Page size: 88.9mm wide (3.5 inch thermal roll), auto height
- Receipt includes:
    · Header: app name, user name, month, date/time, filter badge
    · Items grouped by category with status icons (✓/✗/○)
    · MRP vs actual price + savings per item
    · Platform + bought date per item
    · Category sub-totals + category budget if set
    · Bills summary with due date + paid status
    · EMI summary with bank + remaining count
    · Savings summary with transfer status
    · Grand total (shopping + bills + EMI + savings)
    · Barcode-style footer
- Uses @media print CSS — no external library needed
- Print dialog opens automatically; "Save as PDF" works
- Cancelled items shown with strikethrough styling
- print area auto-clears after print dialog closes

Files changed:
  index.html — added #invoice-print-area div
  app.js     — added printInvoice() function
  styles.css — added @media print thermal receipt styles
               (@page size: 88.9mm auto, all receipt classes)
```

---

### feat: add 12-theme system with live switcher

```
feat: add 12-theme system with live switcher

Themes added: peacock (default), dark, light, dracula,
              sky, forest, desert, snow, sunset, neon, rose, ocean

- CSS custom properties (--accent, --bg, --surface, etc.)
  switched via data-theme attribute on <html>
- Theme dropdown in topbar with color dot preview per theme
- Selected theme persisted in localStorage (kharcha_theme_v1)
- Theme applied instantly on page load, no flash
- All theme tokens replaced hardcoded teal/peacock colors
  throughout CSS (buttons, badges, progress bars, borders, etc.)
- Light themes (light, snow) use dark text with adjusted
  rgba overlays for readability

Files changed:
  styles.css — 12 theme variable blocks + theme dropdown CSS
  app.js     — THEMES array, applyTheme(), renderThemeDropdown(),
               toggleThemeDD(), DOMContentLoaded init
  index.html — theme button + dropdown div in topbar
```

---

### refactor: split single HTML file into 3 separate files

```
refactor: split single HTML file into 3 separate files

- index.html — markup only, links to styles.css and app.js
- styles.css — all CSS extracted from inline <style> block
- app.js     — all JavaScript extracted from inline <script> block

Benefits:
  · Better code organization and maintainability
  · Easier version control diffs per concern
  · Browser caches CSS/JS separately from HTML
  · Editor syntax highlighting works correctly per file

No functional changes — behavior identical to original.
```

---

## Conventional Commit Format Reference

```
<type>(<scope>): <short description>

<body — what and why>

<footer — fixes, breaking changes>
```

**Types used:**

| Type | Meaning |
|------|---------|
| `feat` | Naya feature add kiya |
| `fix` | Bug fix |
| `refactor` | Code restructure, no feature change |
| `style` | CSS / UI changes only |
| `docs` | Documentation only |
| `chore` | Build, config, dependencies |

---

*ProWorkWay · Kharcha Tracker*
