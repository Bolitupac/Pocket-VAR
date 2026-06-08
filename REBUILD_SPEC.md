# ⚽ Pocket VAR — Full Rebuild Specification

> **Author:** Nanbol Dassak (@Bolitupac)
> **Platform:** Android (primary), Web (dev preview)
> **Framework:** React Native (Expo SDK 56)
> **Target:** Drop this doc + source into any AI coding agent to reproduce the app exactly.

---

## 1. Product Overview

Pocket VAR is a **single-phone Video Assistant Referee** for football matches. A referee, coach, or analyst opens the app, hits record, and taps event buttons (GOAL, FOUL, OFFSIDE, YELLOW CARD, RED CARD) as things happen. Each tap timestamps the moment. After the match they review the last 60 seconds of footage with frame-by-frame precision, save decision clips, and share them.

**Key constraint:** Everything is offline-first. No network calls. All data in SQLite on-device.

---

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native (Expo SDK 56) |
| Camera | `expo-camera` (recorder API) |
| Video Playback | `expo-video` |
| Database | `expo-sqlite` (WAL mode) |
| File System | `expo-file-system` |
| State Management | Zustand |
| Navigation | React Navigation (Native Stack + Bottom Tabs) |
| Sharing | `expo-sharing` |
| Video Thumbnails | `expo-video-thumbnails` |
| Icons/SVG | `react-native-svg` + custom shield SVG |
| Gestures | `react-native-gesture-handler` |
| Animations | `react-native-reanimated` |
| Splash Screen | `expo-splash-screen` |

---

## 3. Project Structure

```
pocket-var/
├── App.js                       # Root init: DB → splash → navigator
├── app.json                     # Expo config (permissions, splash, dark theme)
├── index.js                     # Entry point (registerRootComponent)
├── assets/
│   ├── icon.png
│   ├── splash.png
│   ├── favicon.png
│   ├── android-icon-foreground.png
│   ├── android-icon-background.png
│   └── android-icon-monochrome.png
├── src/
│   ├── components/
│   │   └── ErrorBoundary.js     # Catches crashes, shows retry UI
│   ├── navigation/
│   │   └── AppNavigator.js      # Stack: Camera → Review → Clips → Settings
│   ├── screens/
│   │   ├── CameraScreen.js      # Live preview, recording, bookmarking
│   │   ├── ReviewScreen.js      # 60s playback with timeline scrub
│   │   ├── ClipsScreen.js       # Saved clips grid
│   │   └── SettingsScreen.js    # Quality, storage info, cleanup
│   ├── store/
│   │   └── useAppStore.js       # Zustand store + SQLite sync
│   ├── theme/
│   │   └── index.js             # Colours, spacing, typography
│   └── utils/
│       ├── database.js          # SQLite CRUD + batch bookmark writer
│       └── storage.js           # Disk space monitor & cleanup
```

---

## 4. Screens

### 4.1 Camera Screen

The main screen. Full-screen camera preview with:

**UI Elements (top to bottom):**
- **Flash toggle** — icon button cycles: OFF → ON → TORCH
- **Bookmark buttons** — horizontal row: GOAL (green bg) | FOUL (orange bg) | OFFSIDE (gold bg) | YELLOW CARD (gold bg) | RED CARD (red bg)
- **Recording indicator** — pulsing red dot + elapsed time (MM:SS) on a dark pill
- **Zoom control** — slider or pinch gesture adjusts zoom level (0.5x–5x)
- **REC / STOP button** — big red circle at bottom center
- **REVIEW button** — right side, navigates to Review screen
- **CLIPS button** — left side, navigates to Clips screen

**Behaviour:**
- On mount: request camera + microphone permissions via `expo-camera`
- Tap REC → starts recording via `expo-camera` recorder API
- During recording, bookmark buttons are live. Each tap:
  1. Records current elapsed time as timestamp
  2. Flashes screen with event colour overlay (0.3s fade)
  3. Triggers haptic feedback
  4. Queues bookmark in Zustand (batch-flushed to SQLite every 2s)
- Tap STOP → finalizes recording file, saves match record to DB
- Storage warning: at <500MB free show yellow banner, at <100MB free show red banner

### 4.2 Review Screen

The VAR review room. Loads the last 60s of the most recent recording.

**UI Elements:**
- **Video player** — full-width, plays last 60s of recording via `expo-video`
- **Play/Pause** — center play button overlay
- **Timeline waveform** — draggable slider showing full 60s duration
- **Bookmark dots** — coloured markers on the waveform at each bookmark timestamp
- **Frame step controls** — ⏪ (back 1 frame ≈ 33ms) | ⏩ (forward 1 frame)
- **Decision buttons** — MARK FOUL | NO FOUL | SAVE CLIP

**Behaviour:**
- On entry: computes the 60s window end → start from the recording
- Dragging the timeline scrubs video position
- Frame step advances/rewinds by ~33ms (1 frame at 30fps)
- SAVE CLIP → creates a trimmed video file in clips directory, creates clip record in SQLite
- All bookmarks from the recording session are shown on the timeline

### 4.3 Clips Screen

Saved clips library.

**UI Elements:**
- **2-column grid** — each card shows:
  - Thumbnail (from `expo-video-thumbnails`)
  - Event type badge (coloured pill: GOAL/FOUL/OFFSIDE/YC/RC)
  - Duration label
  - Date label
- **Tap card** → opens full-screen video player modal
- **Share button** → system share sheet via `expo-sharing`
- **Delete button** → removes clip file + DB record
- **Pull-to-refresh** grid

**Behaviour:**
- Loads clips from SQLite on mount
- Auto-refreshes on navigation focus
- Deletion cleans up both the file and the database record

### 4.4 Settings Screen

**UI Elements:**
- **Video Quality picker** — dropdown: 720p / 1080p / 4K
- **Review Window slider** — max reviewable seconds (30–120, default 60)
- **Storage bar** — real-time device storage usage bar with colour zones:
  - Green: >50% free
  - Yellow: 20–50% free
  - Red: <20% free
- **Pocket VAR data breakdown** — how much space recordings + clips + thumbnails use
- **Delete All Recordings** — red button, confirmation dialog, removes raw recording files but KEEPS all saved clips
- **About section** — app version, developer credit (Nanbol Dassak)

---

## 5. Data Model (SQLite)

### Table: `matches`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoincrement |
| filename | TEXT | Full path to video file |
| duration_sec | REAL | Total recording duration |
| recorded_at | TEXT | ISO 8601 timestamp |
| is_reviewed | INTEGER | 0/1 boolean |

### Table: `bookmarks`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoincrement |
| match_id | INTEGER | FK → matches.id |
| type | TEXT | goal/foul/offside/yellow_card/red_card |
| timestamp_sec | REAL | Seconds from start of recording |
| created_at | TEXT | ISO 8601 |

### Table: `clips`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoincrement |
| match_id | INTEGER | FK → matches.id |
| filename | TEXT | Path to saved clip video file |
| thumbnail_path | TEXT | Path to generated thumbnail |
| event_type | TEXT | The bookmark type that was saved |
| duration_sec | REAL | Clip duration |
| start_time_sec | REAL | When clip starts in original recording |
| end_time_sec | REAL | When clip ends |
| created_at | TEXT | ISO 8601 |

**SQLite Settings:** WAL mode enabled on open. Batch bookmark inserts use a single transaction every 2 seconds during recording.

---

## 6. State Management (Zustand)

### Store shape:
```js
{
  // Recording state
  isRecording: bool,
  elapsedMs: number,
  recordingFilename: string | null,
  currentMatchId: number | null,

  // Bookmarks (in-memory queue during recording)
  pendingBookmarks: [{ type, timestamp_sec }],

  // Review state
  reviewMatchId: number | null,
  reviewPositionSec: number,

  // Settings
  videoQuality: '720p' | '1080p' | '4K',
  reviewWindowSec: 60,

  // Actions
  startRecording,
  stopRecording,
  addBookmark(type),
  flushBookmarks,
  setReviewMatch,
  updateSettings,
  deleteAllRecordings,
}
```

---

## 7. Colour Palette

```css
Background:    #0D0D0D  (near-black)
Surface:       #1A1A1E
Primary:       #00FF88  (goal green)
Text:          #FFFFFF
Text Dim:      #666670
Goal:          #00FF88
Foul:          #FF6600  (orange)
Offside:       #FFD700  (gold)
Yellow Card:   #FFD700
Red Card:      #FF3355
Recording:     #FF3355  (red dot & timer)
```

---

## 8. Permissions

**Android (AndroidManifest via app.json plugins):**
- CAMERA
- RECORD_AUDIO
- WRITE_EXTERNAL_STORAGE
- READ_EXTERNAL_STORAGE

**iOS (via app.json infoPlist):**
- NSCameraUsageDescription: "Pocket VAR needs camera access to record football matches."
- NSMicrophoneUsageDescription: "Pocket VAR needs microphone access to record match audio."
- NSPhotoLibraryAddUsageDescription: "Pocket VAR needs photo library access to save recorded clips."

---

## 9. Key Engineering Decisions

1. **Batch bookmark writes** — Bookmark taps queue in memory and flush to SQLite in a single transaction every 2 seconds. Prevents DB writes from interfering with camera encoder or causing dropped frames.

2. **WAL mode** — SQLite opened in Write-Ahead Logging mode so reads and writes don't block each other.

3. **Offline-first** — Everything in expo-sqlite + expo-file-system. Zero network calls anywhere in the codebase.

4. **Storage awareness** — Checks free disk space on launch. Warning at <500MB (yellow), critical at <100MB (red). Full recordings bulk-deletable from Settings while clips stay safe.

5. **Error boundaries** — Camera and Review screens wrapped in ErrorBoundary. If either crashes user sees a friendly message with retry button instead of blank screen.

6. **60s review window** — Always buffers last 60 seconds of footage. Frame-step precision at 33ms (30fps). Adjustable in Settings (30–120s).

7. **Single phone, single recording** — One active recording at a time. No multi-camera sync in v1.

---

## 10. app.json Configuration

```json
{
  "expo": {
    "name": "Pocket VAR",
    "slug": "pocket-var",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "backgroundColor": "#0D0D0D",
    "splash": {
      "backgroundColor": "#0D0D0D",
      "resizeMode": "contain"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.pocketvar.app",
      "infoPlist": {
        "NSCameraUsageDescription": "Pocket VAR needs camera access to record football matches.",
        "NSMicrophoneUsageDescription": "Pocket VAR needs microphone access to record match audio.",
        "NSPhotoLibraryAddUsageDescription": "Pocket VAR needs photo library access to save recorded clips."
      }
    },
    "android": {
      "package": "com.pocketvar.app",
      "adaptiveIcon": {
        "backgroundColor": "#0D0D0D",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "permissions": ["CAMERA", "RECORD_AUDIO", "WRITE_EXTERNAL_STORAGE", "READ_EXTERNAL_STORAGE"]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-dev-client",
      "expo-sqlite",
      "expo-splash-screen",
      "expo-status-bar",
      ["expo-camera", { "cameraPermission": "Pocket VAR needs camera access to record football matches." }],
      "expo-video",
      "expo-sharing"
    ]
  }
}
```

---

## 11. Scripts (package.json)

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

---

## 12. Future Roadmap (not implemented yet)

- **AI Referee Analysis** — on-device foul/offside detection with TensorFlow Lite
- **LAN Multi-Phone** — WebSocket sync across multiple devices for multi-angle VAR
- **Cloud Sync** — optional match/clip upload to personal storage
- **Match Timeline Export** — auto-compiled highlight reel from all bookmarks
- **Web Dashboard** — desktop review with tactical drawing overlay tools
- **Premium Tier** — subscription for AI features and extended cloud (RevenueCat + Stripe)

---

> Built by **Nanbol Dassak** (@bolitupac) — 2026
