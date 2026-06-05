# ⚽ Pocket VAR

> **Single-phone VAR system for football matches.** Record, bookmark key moments, and review the last 60 seconds frame-by-frame — all from one Android device.

![Logo](assets/icon.svg)

**Developer:** Nanbol Dassak ([@bolitupac](https://github.com/Bolitupac))

---

## Overview

Pocket VAR turns your phone into a pitchside VAR station. While recording a match, tap buttons to mark **GOAL**, **FOUL**, **OFFSIDE**, **YELLOW CARD**, or **RED CARD** events. After the action, hit **REVIEW** to scrub through the last 60 seconds of footage frame-by-frame, analyze calls, and save clips as evidence.

All 6 development checkpoints complete. App is fully functional and ready for testing on Android.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native (Expo SDK 56) |
| Camera | `expo-camera` + recorder |
| Playback | `expo-video` |
| Database | `expo-sqlite` (3 tables: matches, bookmarks, clips) |
| Storage | `expo-file-system` |
| State | Zustand |
| Navigation | React Navigation (Native Stack) |
| Sharing | `expo-sharing` |
| Icons | `react-native-svg` (custom shield + football) |

## Project Structure

```
pocket-var/
├── App.js                          # Root — DB init → splash → navigator
├── app.json                        # Expo config (permissions, splash, theme)
├── assets/                         # Icons, logo SVG, android assets
├── src/
│   ├── components/
│   │   └── ErrorBoundary.js        # Catches crashes, shows retry screen
│   ├── navigation/
│   │   └── AppNavigator.js         # Stack: Camera → Review → Clips → Settings
│   ├── screens/
│   │   ├── CameraScreen.js         # Live preview, recording, bookmarks, flash, zoom
│   │   ├── ReviewScreen.js         # Last 60s player, timeline scrub, frame step
│   │   ├── ClipsScreen.js          # Saved clips grid, play modal, share, delete
│   │   └── SettingsScreen.js       # Quality, storage, about, delete recordings
│   ├── store/
│   │   └── useAppStore.js          # Zustand + SQLite sync
│   ├── theme/
│   │   └── index.js                # Colors (#0D0D0D / #00FF88), spacing, type
│   └── utils/
│       ├── database.js             # SQLite CRUD + batch bookmark writer
│       └── storage.js              # Free space monitor, usage tracker, cleanup
```

## Screens

| Screen | Description |
|--------|-------------|
| **Camera** | Full-screen camera preview. Top bar has bookmark buttons (GOAL, FOUL, OFFSIDE, YC, RC, REVIEW). Flash toggle (OFF/ON/TORCH). Zoom toggle (1x–5x). Recording shows MM:SS elapsed timer with pulsing REC dot. Bottom bar has record, clips, settings. Coloured flash + haptic on bookmark tap. Storage warning on launch. |
| **Review** | Video player with the last 60s of the current recording. Draggable timeline with waveform bars and coloured bookmark dots. Frame-by-frame stepping (⏪/⏩ at 33ms per frame). Play/pause with overlay. MARK FOUL / NO FOUL / SAVE CLIP buttons. Position timestamp display. |
| **Clips** | 2-column grid of saved clips with type badges and duration. Tap to open fullscreen video player modal. Share via system share sheet. Delete with confirmation (removes file + DB record). Pull-to-refresh. Auto-refresh on focus. |
| **Settings** | Video quality, max review window. Real-time storage bar showing device usage. App data breakdown (match count, clip count). Delete All Recordings button (frees space, keeps clips). About section with developer credit. |

## Development Checkpoints

| # | Checkpoint | What was built | Status |
|---|-----------|---------------|--------|
| 1 | Project skeleton | Expo project, theme system, navigation, custom SVG logo, 4 screen shells | ✅ |
| 2 | Camera + recording | expo-camera recording, elapsed timer, bookmark timestamps, haptic + flash feedback, video saved to filesystem | ✅ |
| 3 | Review screen | expo-video playback, last 60s window, draggable timeline, frame-by-frame stepping (33ms), bookmark markers on timeline | ✅ |
| 4 | SQLite database | 3 tables (matches, bookmarks, clips), full CRUD, batch bookmark writer (flushes every 2s), auto-init on app start | ✅ |
| 5 | Clips library | 2-column grid, fullscreen video player modal, share (expo-sharing), delete with file cleanup, pull-to-refresh | ✅ |
| 6 | Polish | Flash toggle, zoom slider, ErrorBoundary component, StorageManager (free space alerts, usage tracking, bulk cleanup), real storage data in settings | ✅ |

## Key Features

- **Batch bookmark writes** — During recording, bookmarks queue in memory and flush to SQLite every 2 seconds. Zero impact on recording performance.
- **Storage management** — Automatic low-space warnings (<500MB) and critical alerts (<100MB). One-tap "Delete All Recordings" to free space while keeping clips.
- **Error boundaries** — If Camera or Review crashes, the app shows a friendly error with a retry button instead of going blank.
- **Dark theme** — #0D0D0D background with #00FF88 green accents, designed for outdoor readability.
- **Offline-first** — Everything runs locally. No internet connection required. No data leaves the device.

## Future Roadmap

- **AI Referee Analysis** — on-device foul/offside detection (TensorFlow Lite)
- **LAN Multi-Phone** — WebSocket sync across multiple phones for multi-angle VAR
- **Cloud Sync** — match/clip upload to personal storage
- **Payment / Premium** — subscription for AI features and extended cloud storage (RevenueCat + Stripe)
- **Match Timeline Export** — auto-compiled highlight reel with all bookmarks
- **Web Dashboard** — desktop review with tactical drawing tools

## Getting Started

```bash
npm install
npx expo start
```

Then scan the QR code with **Expo Go** on your Android phone.

For Android emulator: install an x86_64 system image via SDK Manager, then:
```bash
~/Android/Sdk/emulator/emulator -avd PocketVAR_Test
npx expo start
```

## Color Palette

```
Background:    #0D0D0D
Surface:       #1A1A1E
Primary Green: #00FF88
Text:          #FFFFFF
Text Dim:      #666670
Danger:        #FF3355  (red card)
Warning:       #FFD700  (yellow card, offside)
Foul:          #FF6600  (orange)
```

---

> **Pocket VAR** — your pocket-sized video assistant referee. ⚽  
> Developed by **Nanbol Dassak** ([@bolitupac](https://github.com/Bolitupac))
