# 📲 PWA Setup Guide — Kharcha Tracker

**ProWorkWay · kharcha.proworkway.com**

---

## PWA kya hai?

Progressive Web App — website ko phone pe native app ki tarah install kar sakte ho.

- ✅ Home screen pe icon
- ✅ Offline kaam karta hai (cached data)
- ✅ Full screen — no browser bar
- ✅ Play Store ki zaroorat nahi
- ✅ Automatic updates

---

## File Structure

```
kharcha/
├── index.html          ← PWA meta tags + manifest link added
├── manifest.json       ← App name, icons, colors, shortcuts
├── sw.js               ← Service Worker (offline + caching)
├── app.js              ← SW registration + install prompt
├── styles.css
└── icons/              ← Yeh folder banao (step 1)
    ├── generate-icons.html ← Icons banane ka tool
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    └── icon-512.png
```

---

## Step 1 — Icons Banao

1. `icons/generate-icons.html` browser mein kholo
2. **"⬇ Download All Icons"** click karo
3. Saare icons download ho jayenge
4. Project mein `icons/` folder banao
5. Saare downloaded icons us folder mein daalo

---

## Step 2 — Files Deploy Karo

Apne hosting pe yeh sab files upload karo:

```
index.html
manifest.json
sw.js
app.js
styles.css
icons/ (folder with all PNGs)
```

> **Zaroori:** `sw.js` root pe hona chahiye — `/sw.js` — subfolder mein nahi

---

## Step 3 — HTTPS Zaroori Hai

PWA sirf **HTTPS** pe kaam karta hai.

- ✅ `https://kharcha.proworkway.com` — works
- ❌ `http://` — Service Worker register nahi hoga

SSL certificate free milta hai — **Cloudflare** ya **Let's Encrypt** se.

---

## Step 4 — Server Config (Nginx)

Agar Nginx use kar rahe ho — yeh config add karo:

```nginx
server {
    listen 443 ssl;
    server_name kharcha.proworkway.com;

    root /var/www/kharcha;
    index index.html;

    # PWA — Service Worker ko root scope milna chahiye
    location /sw.js {
        add_header Cache-Control "no-cache";
        add_header Service-Worker-Allowed "/";
    }

    # manifest.json — no cache
    location /manifest.json {
        add_header Cache-Control "no-cache";
    }

    # Icons — long cache
    location /icons/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # App files — short cache
    location ~* \.(html|css|js)$ {
        expires 1h;
        add_header Cache-Control "public";
    }
}
```

---

## Step 5 — Phone Pe Install Karo

### Android (Chrome)

1. `https://kharcha.proworkway.com` kholo
2. Address bar ke neeche **"Add to Home screen"** popup aayega
3. Ya: Chrome menu (⋮) → **"Add to Home screen"**
4. **"Install"** tap karo
5. Home screen pe `💸 Kharcha` icon aa jaayega

### iOS (Safari)

1. Safari mein `https://kharcha.proworkway.com` kholo
2. Neeche **Share button** (□↑) tap karo
3. **"Add to Home Screen"** select karo
4. **"Add"** tap karo

> ⚠️ iOS pe Chrome se PWA install nahi hota — sirf Safari se

---

## Install Button (Automatic)

App mein automatic **"📲 Install App"** button topbar mein aata hai jab browser detect karta hai ki PWA install ho sakta hai. User click kare → native install prompt aata hai.

---

## Offline Kaise Kaam Karta Hai

```
Pehli baar open karo (online)
        ↓
Service Worker install hota hai
        ↓
index.html, styles.css, app.js, icons — sab cache ho jaate hain
        ↓
Doosri baar internet band ho
        ↓
App phir bhi kaam karta hai (cached version)
        ↓
Data localStorage mein saved rehta hai
```

> Google Drive backup/restore ke liye internet zaroori hai

---

## Shortcuts (Home Screen Long Press)

`manifest.json` mein 2 shortcuts defined hain:

| Shortcut | URL |
|----------|-----|
| 🛒 Shopping List | `/?page=shopping` |
| 💡 Bills & EMI | `/?page=bills` |

Android pe icon long-press karo → shortcuts dikhenge.

---

## Update Kaise Hoga

Jab aap server pe naya code push karo:

- Service Worker background mein detect karta hai
- App mein **"Update Available! Page reload karo"** toast aata hai
- User reload kare → naya version mil jaata hai

---

## Test Karo — Lighthouse

1. Chrome DevTools kholo (F12)
2. **"Lighthouse"** tab click karo
3. **"Progressive Web App"** check karo
4. **"Analyze page load"** click karo
5. PWA score 90+ aana chahiye ✅

---

## Commit Message

```
feat: add PWA support (manifest, service worker, install prompt)

- manifest.json: app name, icons (72–512px), theme colors,
  display standalone, shortcuts for shopping & bills pages
- sw.js: service worker with cache-first strategy for static
  assets, network-first bypass for Google OAuth/Drive APIs,
  stale-while-revalidate for Google Fonts, offline fallback
  to cached index.html
- app.js: SW registration with update detection toast,
  beforeinstallprompt capture + "Install App" button in topbar,
  appinstalled event handler, shortcut URL (?page=) handler
- index.html: manifest link, apple-mobile-web-app meta tags,
  theme-color, apple-touch-icon, description meta
- icons/generate-icons.html: canvas-based icon generator tool
  for all 8 PWA icon sizes (72 to 512px), one-click download

Enables: Add to Home Screen on Android/iOS, offline usage,
         full-screen standalone mode, automatic update detection
```

---

*ProWorkWay · Kharcha Tracker PWA*
