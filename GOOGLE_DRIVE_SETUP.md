# ☁️ Google Drive Backup — Setup Guide

**Kharcha Tracker · ProWorkWay**

---

## Overview

Kharcha Tracker ka data seedha aapke **Google Drive** mein backup ho sakta hai.  
Ek baar setup karo, phir ek click mein backup aur restore.

- ✅ Backup → Drive mein `Kharcha Tracker` folder mein JSON file save hoti hai
- ✅ Restore → Drive se koi bhi purana backup wapas load kar sako
- ✅ Same month ka backup update hota hai (duplicate nahi banega)
- ✅ Multiple backups mein se choose kar sakte ho restore ke waqt

---

## Step 1 — Google Cloud Project Banao

1. **Google Cloud Console** kholo:  
   👉 <https://console.cloud.google.com>

2. Upar left mein **project dropdown** click karo → **"New Project"**

3. Project naam likho (e.g. `Kharcha Tracker`) → **Create**

---

## Step 2 — Google Drive API Enable Karo

1. Left menu → **APIs & Services** → **Library**

2. Search box mein likho: `Google Drive API`

3. **Google Drive API** click karo → **"Enable"** button dabao

> ⚠️ Yeh step miss karne par `Error 403: Upload failed` aata hai

---

## Step 3 — OAuth Consent Screen Setup Karo

1. Left menu → **APIs & Services** → **OAuth consent screen**

2. **"Get Started"** click karo

3. Fill karo:

   | Field | Value |
   |-------|-------|
   | App name | `Kharcha Tracker` |
   | User support email | Aapka Gmail |
   | Developer contact | Aapka Gmail |

4. **Scopes** mein yeh add karo (Next step mein):
   - `.../auth/drive.file`
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`

5. **Test users** mein apna Gmail add karo:
   - OAuth consent screen → **"Test users"** section
   - **"+ Add Users"** → apna email daalo → Save

> ⚠️ Test users add nahi kiya to `Error 403: access_denied` aata hai

---

## Step 4 — OAuth Client ID Banao

1. Left menu → **APIs & Services** → **Credentials**

2. **"+ Create Credentials"** → **"OAuth client ID"**

3. Application type: **Web application**

4. **Authorized JavaScript origins** mein apna domain add karo:

   ```
   http://localhost
   http://localhost:5500
   https://proworkway.com
   https://www.proworkway.com
   ```

   > Local testing ke liye `http://localhost` zaroori hai

5. **Create** click karo

6. Popup mein **Client ID** copy karo  
   Format: `xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`

---

## Step 5 — App Mein Connect Karo

1. Kharcha Tracker kholo

2. Shopping page pe **☁ Drive** button click karo

3. **Client ID** paste karo

4. **App Name** daalo (Drive folder ka naam, default: `Kharcha Tracker`)

5. **"Save & Connect →"** click karo

6. Google login popup aayega → apna Gmail select karo

7. **"Connected"** screen aane ke baad ready! ✅

---

## Backup Kaise Karo

1. **☁ Drive** button → Connected screen
2. **"↑ Backup to Drive"** click karo
3. `✅ Backup ho gaya! (kharcha_backup_2025-05.json)` message aayega

**File location in Drive:**  
`My Drive → Kharcha Tracker → kharcha_backup_YYYY-MM.json`

---

## Restore Kaise Karo

1. **☁ Drive** button → Connected screen
2. **"↓ Restore from Drive"** click karo
3. Agar multiple backups hain → list mein se choose karo
4. Data reload ho jaayega automatically

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Error 403: access_denied` | Email test users mein nahi hai | Step 3 → Test users mein email add karo |
| `Error 403: Upload failed` | Drive API enable nahi | Step 2 → Drive API enable karo |
| `Login nahi ho saka` | Client ID galat ya domain mismatch | Step 4 → Authorized origins check karo |
| `Koi backup nahi mila` | Pehle backup liya nahi | Pehle Backup karo, phir Restore |
| Popup block ho gaya | Browser ne popup block kiya | Browser settings mein popup allow karo |

---

## Technical Details

| Item | Value |
|------|-------|
| Auth Method | Google OAuth 2.0 (Token-based, no server needed) |
| API Scope | `drive.file` (sirf app ki files, poora Drive nahi) |
| Storage | `localStorage` mein Client ID save hota hai |
| Token | Session mein rehta hai, page reload pe re-login |
| File Format | JSON (readable, portable) |
| Folder | Drive mein `Kharcha Tracker` naam ka folder auto-create |

---

## Privacy Note

- Scope `drive.file` use hota hai — matlab app **sirf wohi files** dekh sakti hai jo usne khud banai hain
- Aapka poora Google Drive app ko **visible nahi** hota
- Client ID aapke browser ke `localStorage` mein save hota hai — server pe nahi jaata

---

*ProWorkWay · Kharcha Tracker*
