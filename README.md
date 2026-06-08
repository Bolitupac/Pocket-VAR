# ⚽ Pocket VAR

> **A single-phone VAR system for football matches.**  
> Record. Bookmark. Review. Save clips. All offline, all on-device.

**Developer:** Nanbol Dassak ([@bolitupac](https://github.com/Bolitupac))

---

## What It Is

Pocket VAR is a mobile VAR (Video Assistant Referee) system built in **React Native (Expo SDK 56)**. It turns a single Android phone into a pitchside officiating tool.

You record a football match, tap buttons to timestamp key events — **GOAL**, **FOUL**, **OFFSIDE**, **YELLOW CARD**, **RED CARD** — then instantly jump into a review screen to scrub through the last 60 seconds of footage frame-by-frame and save clips as evidence. Everything is **offline-first** and stored locally via SQLite. No internet. No accounts. No data ever leaves the device.

This isn't a dashcam or a highlights app. It's a **decision-making tool** — built for referees, coaches, and analysts who need to make the right call in real time, on the pitch, with one hand.

---

## How It Works

**1. Record**  
Open the app and tap ▶ to start recording. The camera runs in the background while you ref the match. A live elapsed timer tells you how long you've been rolling.

**2. Bookmark**  
When something happens — a foul, a goal, a close offside — tap the relevant button. That moment is timestamped to the millisecond. You get a coloured screen flash and a haptic pulse so you know it registered without taking your eyes off the pitch.

**3. Review**  
Tap **REVIEW** from the camera screen. You land on a video player showing the last 60 seconds of footage. A waveform timeline shows where your bookmarks sit. Scrub to any moment, step frame-by-frame (33ms per step), and watch it as many times as you need.

**4. Save**  
Save the key moment as a clip. It gets stored in your library with a type badge, thumbnail, and timestamp. You can share it instantly or delete it to free space.

---

## Screens

### 📷 Camera
Full-screen live preview with a bookmark button bar across the top. Flash toggle (OFF / ON / TORCH). Zoom control. Live REC timer. Bookmark taps trigger a coloured flash overlay matched to the event type — green for goal, orange for foul, red for red card. A storage warning fires automatically if your device is running low.

### 🎞 Review
The VAR room in your pocket. The last 60 seconds of your recording, with a draggable waveform timeline underneath. Coloured dots mark each bookmarked event. Step through the footage one frame at a time with the ⏪ / ⏩ controls. MARK FOUL, NO FOUL, and SAVE CLIP buttons let you log your decision and export the moment.

### 🎬 Clips
A 2-column grid of every saved clip. Each card shows the event type badge, duration, and date. Tap any card to open a fullscreen video player. Share via the system share sheet or delete the clip with file and database cleanup. Pull-to-refresh. Auto-refreshes every time you navigate here.

### ⚙️ Settings
Video quality, max review window. A real-time storage bar showing how much of your device's disk is used, colour-coded by severity (green → yellow → red). A breakdown of how much Pocket VAR data specifically is taking up. One-tap **Delete All Recordings** to nuke raw recordings and free space while keeping all your saved clips.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native (Expo SDK 56) |
| Camera | `expo-camera` + recorder |
| Playback | `expo-video` |
| Database | `expo-sqlite` (WAL mode — 3 tables) |
| Storage | `expo-file-system` |
| State | Zustand |
| Navigation | React Navigation (Native Stack) |
| Sharing | `expo-sharing` |
| Thumbnails | `expo-video-thumbnails` |
| Icons | `react-native-svg` (custom shield SVG logo) |

---

## Architecture

```
pocket-var-app/
├── app.json                        # Expo config (permissions, plugins, dark theme)
├── tsconfig.json                   # Strict TS with @/* path alias
├── assets/
│   └── images/                     # Icons, splash, logo-var.png
└── src/
    ├── app/                        # Expo Router (file-based routing)
    │   ├── _layout.tsx             # Root Stack navigator
    │   ├── index.tsx               # → /       Camera screen
    │   ├── review.tsx              # → /review  Review screen
    │   ├── clips.tsx               # → /clips   Clips screen
    │   └── settings.tsx            # → /settings Settings screen
    ├── components/
    │   ├── LogoText.tsx            # Text-based logo (no PNG needed)
    │   └── ErrorBoundary.tsx       # Crash recovery with retry (WIP)
    ├── theme/
    │   └── index.ts                # Colors, spacing, typography, shadows
    ├── store/
    │   └── useAppStore.ts          # Zustand store + SQLite sync (WIP)
    └── utils/
        ├── database.ts             # SQLite CRUD + batch bookmark writer (WIP)
        └── storage.ts              # Free space monitor, usage tracker (WIP)
```

---

## Key Design Decisions

**Batch bookmark writes** — During recording, bookmark taps queue in memory and flush to SQLite in a single transaction every 2 seconds. This prevents DB writes from interfering with the camera encoder or causing dropped frames.

**WAL mode** — SQLite is opened in Write-Ahead Logging mode so reads and writes don't block each other. Bookmarks flush without locking the database during active recording.

**Offline-first** — Everything lives in `expo-sqlite` and `expo-file-system`. No network calls anywhere in the codebase. Works in a stadium with no signal.

**Storage awareness** — The app checks free disk space on launch and warns when below 500MB (yellow) or 100MB (red). Full recordings can be bulk-deleted from Settings while keeping all clips safe.

**Error boundaries** — Camera and Review screens are wrapped in an `ErrorBoundary`. If either crashes, the user sees a friendly message with a retry button instead of a blank screen.

---

## Colour Palette

```
Background:    #0D0D0D   (near-black, easy on eyes outdoors)
Surface:       #1A1A1E   (glassmorphism frosted panels)
Primary:       #FF6600   (tiger orange — CTAs, key metrics, accent)
Text:          #FFFFFF
Text Dim:      #666670
Goal:          #00FF88   (green — universal goal signal)
Foul:          #FF6600   (orange — also primary accent)
Offside:       #FFD700   (gold — AR flag colour)
Yellow Card:   #FFD700
Red Card:      #FF3355
Recording:     #FF3355   (REC dot and timer)
```

---

## Development Checkpoints

| # | Checkpoint | Status |
|---|-----------|--------|
| 1 | Dependencies + app.json — expo-camera, expo-video, expo-sqlite, Zustand, permissions | ✅ |
| 2 | Theme system + navigation shell — colors (#FF6600 primary), typography, LogoText, 4 route stubs | ✅ |
| 3 | SQLite database — 3 tables, full CRUD, batch bookmark writer, auto-init on launch | ⬜ |
| 4 | Camera screen — live preview, recording, bookmark buttons, flash, zoom, timer | ⬜ |
| 5 | Review screen — 60s video playback, waveform timeline, frame stepping, SAVE CLIP | ⬜ |
| 6 | Clips screen — 2-column grid, fullscreen modal, share, delete with file cleanup | ⬜ |
| 7 | Settings screen — quality picker, storage bar, delete recordings, about | ⬜ |
| 8 | Polish — ErrorBoundary, storage warnings, haptic feedback, AppState handling | ⬜ |

### Build Log

| Step | Date | What |
|------|------|------|
| 1 | 2026-06-08 | Installed 8 packages (expo-camera, expo-video, expo-sqlite, expo-file-system, expo-sharing, expo-video-thumbnails, react-native-svg, zustand). Configured app.json with dark theme, permissions, plugins. |
| 2 | 2026-06-08 | Created theme system (colors, spacing, typography, shadows). LogoText component (text-based, no PNG needed). Navigation shell with 4 screen stubs (Camera, Review, Clips, Settings). Zero type errors. |

---

## Future Roadmap

- **AI Referee Analysis** — on-device foul/offside detection (TensorFlow Lite)
- **LAN Multi-Phone** — WebSocket sync across multiple devices for multi-angle VAR
- **Cloud Sync** — optional match/clip upload to personal storage
- **Match Timeline Export** — auto-compiled highlight reel from all bookmarks
- **Web Dashboard** — desktop review with tactical drawing overlay tools
- **Premium Tier** — subscription for AI features and extended cloud (RevenueCat + Stripe)

---

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your Android device.

For an emulator, install an x86_64 system image via Android Studio SDK Manager, then:

```bash
~/Android/Sdk/emulator/emulator -avd PocketVAR_Test
npx expo start --android
```

---

> **Pocket VAR** — your pocket-sized video assistant referee. ⚽  
> Built by **Nanbol Dassak** ([@bolitupac](https://github.com/Bolitupac))
