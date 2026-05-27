# little memories ♡

A gentle, self-hosted photo album for collecting memories from every guest at your event. Designed for a baby's first birthday, but works for any intimate gathering.

Free · No signup for guests · Mobile-first · Deploys to GitHub Pages or Vercel

---

#### Option B · GitHub Pages (free, but URL is longer)

1. Update `.env.local` to set the base path:

   ```ini
   VITE_BASE_PATH=/little-memories/
   ```

2. Push to GitHub
3. On GitHub: **Settings → Pages → Source: GitHub Actions** (or "Deploy from branch" if you prefer)
4. For a manual deploy:

   ```bash
   npm run deploy
   ```

   This builds and pushes `dist/` to the `gh-pages` branch.

Your site goes live at `https://YOUR-USERNAME.github.io/little-memories/`.

> ⚠️ **GH Pages SPA gotcha:** the included `public/404.html` redirect makes direct links work (e.g. someone scanning the QR while you're refreshing the dashboard). It's a standard trick — don't delete it.

---

## 📁 Architecture

```
src/
├── app/                    # Top-level providers + router
│   ├── App.tsx
│   └── router.tsx
├── config/                 # Env validation (Zod)
│   └── env.ts
├── features/               # Feature-folder organization
│   ├── auth/               # PIN-based dashboard protection
│   │   ├── components/     # UnlockScreen, HostRoute (route guard)
│   │   ├── hooks/          # useAuth
│   │   └── services/       # pinHashing, authSession
│   ├── events/             # Event creation, management, sharing
│   │   ├── components/     # QRCodeCanvas
│   │   ├── hooks/          # useEvents, useEventMedia
│   │   ├── services/       # eventRepository, guestLink
│   │   └── types/
│   ├── upload/             # Guest upload flow
│   │   ├── components/     # EventBanner, GuestNameCard, DropZone, UploadQueueList, SuccessBadge
│   │   └── hooks/          # useGuestName, useUploadQueue
│   ├── gallery/            # Photo browsing
│   │   └── components/     # GalleryGrid, Lightbox
│   └── slideshow/          # Auto-advancing slideshow
│       └── hooks/          # useSlideshow
├── pages/                  # Page-level components (one per route)
│   ├── HomePage.tsx
│   ├── HostPage.tsx
│   ├── UploadPage.tsx
│   ├── GalleryPage.tsx
│   └── SlideshowPage.tsx
├── services/               # External I/O abstraction
│   ├── cloudinary/         # Upload + media repository (Zod-validated)
│   └── storage/            # Typed localStorage wrapper
├── shared/                 # Cross-feature primitives
│   ├── components/         # AppHeader, Button, Logo, ToastProvider
│   ├── hooks/              # useToast
│   ├── styles/             # globals.css with CSS variables
│   └── utils/              # format helpers (slugify, fmtBytes, etc.)
└── types/
    └── domain.ts           # Event, MediaItem, GuestIdentity
```

### Design patterns at play

| Pattern | Where | Why |
|---|---|---|
| **Repository** | `services/cloudinary/mediaRepository.ts` | Domain methods (`uploadMedia`, `getEventMedia`) hide the API client. Swappable. |
| **Boundary validation** | Zod schemas in `services/cloudinary/types.ts` | External responses validated at the seam — UI can trust its types. |
| **Custom hooks** | `useEvents`, `useEventMedia`, `useUploadQueue`, `useSlideshow` | Stateful logic isolated from presentation. Testable, reusable. |
| **Feature folders** | `features/*` | Co-locates everything one feature owns. Easier to delete or extract. |
| **Path aliases** | `@features/...`, `@services/...` | No `../../../../` import chains. |
| **CSS Modules** | `*.module.css` per component | Scoped styles, no global leaks. |
| **AbortController** | All async ops | Cancels in-flight requests on unmount or eventId change. No stale state. |

---

## 🛠 Available scripts

```bash
npm run dev         # Vite dev server with HMR
npm run build       # TypeScript check + production build
npm run preview     # Serve the production build locally
npm run lint        # ESLint
npm run typecheck   # Just the TS check, no build
npm run format      # Prettier
npm run deploy      # Build + push to gh-pages branch
```

---

## 🎂 Using it at your event

1. Open your deployed URL on any browser
2. Type the event name (e.g. *"Lua's First Birthday"*)
3. The dashboard shows a **QR code + shareable link**
4. **Print the QR** (or display on a tablet at the entrance) — guests scan with their phone camera
5. They land on the upload page, type their name once, and start sending photos
6. Open **Gallery** to browse, or **Slideshow** on a laptop hooked up to the TV

### Slideshow keyboard shortcuts

- `Space` / `→` next photo
- `←` previous
- `P` pause/play
- `F` fullscreen

---

## 🔒 Privacy & security

### What's protected

- **Photos go straight to your Cloudinary account** — you own them
- **The dashboard requires a host PIN** — you set it when creating the event. Guests who scan the QR code only land on the upload page; they cannot reach `/host`, `/gallery`, or `/slideshow` without knowing the PIN.
- The PIN is hashed (SHA-256) before storage — never stored plaintext
- Each device must prove the PIN once; that authorization persists across refreshes via localStorage
- A **"lock this device"** button at the bottom of the dashboard revokes the local authorization (useful if you hand your phone to someone)

### What's NOT protected (be aware)

This is a static site with no backend, so some limits are unavoidable:

- The **guest upload link contains the event ID** (it has to — that's how uploads are tagged). Someone with this link and Cloudinary API knowledge could query the gallery directly via Cloudinary's REST API, bypassing this app's UI. For a baby party among family this is fine; for sensitive use cases you'd need a real backend with signed URLs.
- Anyone with the deploy URL can read the JavaScript source — including the PIN-hashing logic. The PIN protects against casual snooping (cousin pokes around at `/host`), not a motivated attacker.
- Your event list lives in **your browser's localStorage** — clear browser data → lose access to your own dashboard. The photos remain in Cloudinary, accessible via the original event ID.
- The Cloudinary upload preset is **unsigned**: anyone with your cloud name + preset name *could* upload to your account. For a one-off event this is fine. For ongoing use, set Max file size and Allowed formats on the preset in Cloudinary settings.

---

## 🛠 Troubleshooting

**Gallery shows empty after uploads succeed** → You haven't unchecked `resource list` under Cloudinary Settings → Security (Step 2c above).

**Uploads fail with "Upload preset must be in unsigned mode"** → Your `VITE_CLOUDINARY_UPLOAD_PRESET` is wrong, or the preset's Signing Mode isn't set to Unsigned.

**QR code shows `localhost:5173`** → You're testing locally. Deploy first; the QR uses whatever URL the browser is at.

**`npm install` fails on Node 16 or older** → Update to Node 18+.

**SPA routes 404 on GitHub Pages refresh** → Make sure `public/404.html` is in the deployed `dist/` folder (it is by default).

---

## 📜 License

MIT.
