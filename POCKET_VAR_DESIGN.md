# ⚽ Pocket VAR — Design & Architecture Document

> **Version:** 1.0.0  
> **Last Updated:** June 2026  
> **Platform:** Android (iOS pending)  
> **Framework:** React Native (Expo SDK 56)  
> **Repository:** `~/Desktop/pocket-var/`

---

## Table of Contents

1. [Product Vision](#1-product-vision)  
2. [Architecture Overview](#2-architecture-overview)  
3. [Theme & Design System](#3-theme--design-system)  
4. [Screen Specifications](#4-screen-specifications)  
5. [Data Model](#5-data-model)  
6. [State Management](#6-state-management)  
7. [Video Pipeline](#7-video-pipeline)  
8. [Performance Engineering](#8-performance-engineering)  
9. [Scalability Roadmap](#9-scalability-roadmap)  
10. [Upcoming Features](#10-upcoming-features)  
11. [Development Milestones](#11-development-milestones)  
12. [Security & Privacy](#12-security--privacy)

---

## 1. Product Vision

**Pocket VAR** is a single-device Video Assistant Referee system that runs on an Android phone. It lets users:

- Record football matches using the phone's camera
- Tap on-screen buttons to bookmark key moments (goals, fouls, offsides, cards)
- Review the last 60 seconds of footage with frame-by-frame precision
- Save and share video clips of each decision

The long-term vision is a **multi-device, AI-powered referee analysis platform** where multiple phones record from different angles, sync automatically, and an on-device AI flags potential incidents.

### User Personas

| Persona | Use Case |
|---------|----------|
| **Amateur Referee** | Records their own matches, reviews contentious calls post-game |
| **Coach** | Uses VAR to analyze player performance and disputed moments |
| **Player** | Captures match highlights for social media or personal review |
| **Academy** | Full match analysis across multiple camera angles |

### Core Principles

- **One-tap recording** — open app, hit record, do your job
- **Zero friction bookmarks** — buttons mark timestamps without interrupting the video
- **Instant review** — last 60 seconds always available, no loading
- **Offline-first** — everything works without internet
- **Thermal-aware** — optimised for sustained recording without overheating

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   React Native App                    │
├─────────────────────────────────────────────────────┤
│  View Layer (Screens)                                │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌────────┐  │
│  │  Camera   │  │  Review   │  │  Clips  │  │Settings│  │
│  └────┬─────┘  └────┬─────┘  └───┬────┘  └───┬────┘  │
├───────┴──────────────┴────────────┴────────────┴──────┤
│  Navigation Layer (React Navigation Stack)             │
├─────────────────────────────────────────────────────┤
│  State Layer (Zustand)                                │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ Recording    │  │  Bookmarks   │  │  Settings    │  │
│  │ State        │  │  & Clips     │  │  State       │  │
│  └─────────────┘  └──────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────┤
│  Storage Layer                                        │
│  ┌────────────────┐  ┌────────────────────┐          │
│  │  SQLite DB     │  │  File System        │          │
│  │  (matches,     │  │  (video files,      │          │
│  │   bookmarks,   │  │   thumbnails, clips)│          │
│  │   clips)       │  │                     │          │
│  └────────────────┘  └────────────────────┘          │
├─────────────────────────────────────────────────────┤
│  Hardware Layer                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │ Camera    │  │  GPU     │  │  Storage (Flash)  │    │
│  └──────────┘  └──────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
User taps GOAL button
    │
    ▼
CameraScreen.handleBookmark('goal')
    │
    ├─▶ useAppStore.addBookmark({ type: 'goal', timestamp: elapsed_sec })
    │
    ├─▶ (future) Haptic feedback + brief flash overlay
    │
    └─▶ SQLite INSERT INTO bookmarks (match_id, timestamp, type)

User taps REVIEW
    │
    ▼
ReviewScreen opens
    │
    ├─▶ Load bookmarks for current match from SQLite
    │
    ├─▶ Show last 60 seconds of video file
    │       │
    │       ▼
    │   Frame-by-frame position at video.currentTime
    │   Timeline displays bookmark markers
    │
    └─▶ User scrubs, taps MARK FOUL
            │
            ▼
        Create clip from video segment
        Save to FileSystem + SQLite
```

---

## 3. Theme & Design System

### Visual Identity

Pocket VAR uses a **dark, minimal, broadcast-inspired aesthetic**. Black backgrounds reduce glare during outdoor use. Green accents reference the football pitch and traditional VAR graphics.

### Color Token Reference

```javascript
colors = {
  // Foundation
  background: '#0D0D0D',     // Near-black, minimises screen glow
  surface:   '#1A1A1E',      // Card surfaces with subtle blue tint
  surfaceLight: '#252529',   // Elevated surfaces

  // Brand
  primary:    '#00FF88',     // High-visibility green
  primaryDark:'#00CC6A',     // Pressed state
  primaryDim: 'rgba(0,255,136,0.15)', // Glow / selection

  // Text hierarchy
  text:         '#FFFFFF',
  textSecondary:'#A0A0A8',
  textDim:      '#666670',

  // Semantic
  goal:    '#00FF88',        // Green — GOAL
  foul:    '#FF6600',        // Orange — FOUL
  offside: '#FFD700',        // Yellow — OFFSIDE
  yellowCard: '#FFD700',
  redCard:   '#FF3355',
}
```

### Typography

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| h1 | 28 | 700 | Screen titles |
| h2 | 22 | 700 | Section headers |
| h3 | 18 | 600 | Card titles |
| body | 16 | 400 | Body content |
| bodySmall | 14 | 400 | Secondary text |
| caption | 12 | 400 | Labels, timestamps |
| button | 16 | 600 | Button text |
| label | 13 | 500 | Form labels |

### Spacing Scale (4px base)

| Token | Pixels |
|-------|--------|
| xs | 4 |
| sm | 8 |
| md | 12 |
| lg | 16 |
| xl | 20 |
| xxl | 24 |
| xxxl | 32 |

### Component Design Principles

1. **High contrast** — all interactive elements have minimum 7:1 contrast ratio for outdoor visibility
2. **Large touch targets** — minimum 44x44pt for all buttons
3. **Minimal chrome** — no decorative elements that distract from the video feed
4. **Consistent border radius** — 6px (sm), 10px (md), 14px (lg), 20px (xl)
5. **Glass-morphism** — semi-transparent surfaces over video with backdrop blur

---

## 4. Screen Specifications

### 4.1 Camera Screen (Primary)

**Purpose:** Full-screen camera preview with bookmark overlay controls.

**Layout (Portrait):**

```
┌─────────────────────────────────────────┐
│  [● REC]              [Logo watermark]  │  → Status bar (transparent bg)
├─────────────────────────────────────────┤
│  [◉ REVIEW] [⚽ GOAL] [⚠ FOUL] [🚩 OFF] │  → Bookmark button row
│  [🟨 YC] [🟥 RC]                        │
├─────────────────────────────────────────┤
│                                         │
│           CAMERA PREVIEW                 │  → 100% width, full height
│           (expo-camera)                  │
│           (recording indicator in top    │
│            corner when active)           │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│           [⚙]    [▶/◼]    [🎬]          │  → Bottom dock
│         Settings  Record   Clips         │
└─────────────────────────────────────────┘
```

**States:**

| State | Behaviour |
|-------|-----------|
| Camera permission not granted | Show permission request screen with logo, explanations, and "Grant Access" button |
| Camera ready, not recording | Show live preview. Record button shows ▶ (play icon). Bookmark buttons show tooltip "Start recording first" on first tap |
| Recording | Red REC indicator + pulsing dot. Record button shows ◼ (stop). Bookmark buttons functional. Timestamp elapsed shown subtly |
| Recording stopped | Return to idle. Bookmark buttons disabled again |

**Bookmark Button Press:**

- Brief haptic feedback (on supported devices)
- Flash overlay in the button's colour (100ms)
- Write timestamp + type to SQLite
- No interruption to recording

### 4.2 Review Screen

**Purpose:** Analyse the last 60 seconds of footage with frame-by-frame control.

**Layout:**

```
┌─────────────────────────────────────────┐
│  ← Camera      Review                   │  → Header (back button)
├─────────────────────────────────────────┤
│                                         │
│          VIDEO PREVIEW                   │  → 16:9 aspect ratio
│          (current frame from             │
│           the last 60s buffer)           │
│                                         │
│            [ -00:23 ]                    │  → Timestamp overlay
│                                         │
├─────────────────────────────────────────┤
│  TIMELINE (last 60s)                     │
│  ▄▃▂▁▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▁▂▃▄▅▆▇█▇▆▅ ... │  → Waveform visualisation
│  │                                      │  → Playhead position
│  -60s           -30s           NOW      │
├─────────────────────────────────────────┤
│    [⏪]          [▶/⏸]          [⏩]     │  → Frame stepping
├─────────────────────────────────────────┤
│  [⚠ MARK FOUL]              [✓ NO FOUL] │  → Decision buttons
│  [💾 SAVE CLIP]            [✕ CANCEL]   │  → Action buttons
└─────────────────────────────────────────┘
```

**Interaction Details:**

- **Timeline:** Horizontal scrubbable bar representing 60 seconds. Each pixel ≈ 0.25–0.5 seconds depending on screen width
- **Frame step:** Each tap of ⏪/⏩ moves 1 frame (≈33ms at 30fps, ≈41ms at 24fps)
- **Play button:** Plays/pauses the last 60 seconds at 1x speed
- **MARK FOUL:** Saves a clip starting 5 seconds before the current position to 5 seconds after (configurable)
- **NO FOUL:** Dismisses the current review session, returns to camera
- **SAVE CLIP:** Exports the visible segment as a standalone .mp4 to the device's gallery

**Performance considerations:**

- No video transcoding on MARK FOUL — just copies the relevant byte range from the full recording
- SAVE CLIP uses FFmpeg for a clean cut (may take 1–3 seconds on modern hardware)
- Timeline waveform is rendered once when entering the screen, not on every frame

### 4.3 Clips Library Screen

**Purpose:** Browse, play, share, and delete saved clips.

**Layout:**

```
┌─────────────────────────────────────────┐
│  ← Camera      Saved Clips              │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │ Thumbnail│  │ Thumbnail│            │  → 2-column grid
│  │ GOAL 23" │  │ FOUL 12" │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │ Thumbnail│  │ Thumbnail│            │
│  │ OFFSIDE" │  │ YC 8"    │            │
│  └──────────┘  └──────────┘            │
│                                         │
│  [Empty state when no clips saved]      │
│                                         │
└─────────────────────────────────────────┘
```

**Clip card:**

| Element | Description |
|---------|-------------|
| Thumbnail | First frame of the clip (generated on save) |
| Type badge | GOAL (green), FOUL (orange), OFFSIDE (yellow), YC (yellow), RC (red) |
| Duration | "12s" overlay |
| Tap | Opens video player for playback |
| Long press | Share / Delete actions |

### 4.4 Settings Screen

**Purpose:** Configure recording parameters and manage storage.

**Sections:**

| Section | Items |
|---------|-------|
| Recording | Video Quality (720p / 1080p / 4K), Camera Facing (Back/Front), Max Review Window (30/60/120s) |
| Storage | Usage bar, Auto-save Clips toggle, Clear All Data button (with confirmation) |
| About | Version, Build number, Licenses, Support contact |

---

## 5. Data Model

### SQLite Schema

```sql
-- Each recording session is a match
CREATE TABLE matches (
  id TEXT PRIMARY KEY,           -- UUID
  title TEXT,                    -- "Match vs United - 2026-06-05"
  date TEXT NOT NULL,            -- ISO 8601
  duration_seconds INTEGER,      -- Total recording length
  video_path TEXT,               -- Path to the full recording file
  total_bookmarks INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- A bookmark marks a moment during recording
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,           -- UUID
  match_id TEXT NOT NULL,        -- FK → matches.id
  timestamp_seconds REAL,        -- Seconds from start of recording
  type TEXT NOT NULL,            -- 'goal' | 'foul' | 'offside' | 'yellow_card' | 'red_card'
  notes TEXT,                    -- Optional user note ("#42 shirt pull")
  review_decision TEXT,          -- 'confirmed' | 'overturned' | 'pending'
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- A saved clip extracted from a recording
CREATE TABLE clips (
  id TEXT PRIMARY KEY,           -- UUID
  bookmark_id TEXT,              -- FK → bookmarks.id (nullable, manual clips)
  match_id TEXT NOT NULL,        -- FK → matches.id
  start_time REAL,               -- Seconds from start
  end_time REAL,                 -- Seconds from start
  type TEXT NOT NULL,            -- Same types as bookmarks
  file_path TEXT,                -- Path to the exported .mp4 file
  thumbnail_path TEXT,           -- Path to thumbnail image
  duration_seconds REAL,
  file_size_bytes INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE SET NULL
);

-- Performance indexes
CREATE INDEX idx_bookmarks_match ON bookmarks(match_id);
CREATE INDEX idx_bookmarks_type ON bookmarks(type);
CREATE INDEX idx_clips_match ON clips(match_id);
```

### File System Layout

```
FileSystem.documentDirectory/
├── matches/
│   ├── {match-uuid}/
│   │   ├── recording.mp4          # Full match recording
│   │   ├── thumbnail.jpg           # First frame
│   │   └── clips/
│   │       ├── goal_1.mp4
│   │       ├── foul_2.mp4
│   │       └── ...
│   └── ...
└── thumbnails/                     # Cached thumbnails
```

---

## 6. State Management

### Zustand Store (useAppStore)

```javascript
// Global state shape
{
  // Recording
  isRecording: boolean,
  recordingStartTime: number | null,
  currentMatchId: string | null,
  elapsedSeconds: number,           // Updated every 100ms during recording

  // Data (loaded from SQLite on app start)
  matches: Match[],
  bookmarks: Bookmark[],
  clips: Clip[],

  // Review
  isReviewing: boolean,
  reviewPosition: number,           // Seconds from end of recording
  reviewBookmarks: Bookmark[],      // Bookmarks in the current 60s window

  // Settings
  settings: {
    videoQuality: '720p' | '1080p' | '4K',
    autoSaveClips: boolean,
    maxReviewSeconds: 30 | 60 | 120,
    cameraFacing: 'back' | 'front',
  },
}
```

**Why Zustand over Redux or Context:**
- Zero boilerplate — no providers, reducers, or action types
- Direct mutations via `set()` — no immutability ceremony
- Works outside React components (services, workers)
- Tiny bundle size (~1KB)

---

## 7. Video Pipeline

### Recording Flow

```
CameraView (mode="video")
    │
    ├─► expo-camera captures H.264 video at configured resolution
    │
    ├─► Written to temporary file: FileSystem.cacheDirectory/recording_{ts}.mp4
    │
    └─► On stop: move to FileSystem.documentDirectory/matches/{id}/recording.mp4
```

### Review Pipeline (Last 60 Seconds)

```
User taps REVIEW
    │
    ▼
Get current recording file path
    │
    ▼
Seek to (total_duration - 60s) ← or start if < 60s recorded
    │
    ▼
Render in expo-av Video component with position controls
    │
    ▼
Timeline shows bookmark markers from SQLite within this window
    │
    ▼
User scrubs → update Video position
User frame-step → +/- 33ms (1 frame at 30fps)
```

### Clip Export Pipeline

```
User taps "SAVE CLIP"
    │
    ▼
Determine time range: [playhead - 5s, playhead + 5s]
    │
    ▼
FFmpeg command (using ffmpeg-kit-react-native):
  ffmpeg -i recording.mp4 -ss 45.0 -t 10 -c copy clip_output.mp4
    │
    ▼
Copy to FileSystem.documentDirectory/matches/{id}/clips/
    │
    ▼
Generate thumbnail from first frame:
  ffmpeg -i clip_output.mp4 -vframes 1 -s 320x180 thumbnail.jpg
    │
    ▼
Insert clip record into SQLite
    │
    ▼
(Optional) Save to device gallery via expo-media-library
```

---

## 8. Performance Engineering

### Overheating Prevention Strategy

Recording video generates heat. Pocket VAR uses these techniques to stay cool:

| Technique | Implementation |
|-----------|---------------|
| **Resolution capping** | Default 1080p, not 4K. User can lower to 720p in settings. |
| **Frame rate limiter** | Cap at 30fps (not 60fps) for recording. Less data, less heat. |
| **Background purge** | Every 5 minutes during recording, purge video buffer before the 60s window to reduce disk I/O |
| **Preview throttling** | Camera preview runs at 24fps when recording, not 30fps |
| **Thermal monitoring** | (Future) Read device temperature, auto-reduce quality if overheating |
| **GPU offload** | All UI rendering uses hardware acceleration (react-native-reanimated) |
| **Minimal JS thread work** | Bookmark taps write directly to SQLite without JS thread blocking |
| **Batch DB writes** | During recording, bookmark writes are batched and flushed every 2 seconds |

### Memory Management

- Video files streamed directly from disk, never loaded entirely into memory
- Thumbnails generated at 320x180 max
- Timeline waveform rendered once, cached as a static image
- Review screen uses the same video file — no duplicate decoder instances

### Battery Optimisation

- Screen brightness auto-reduces when recording for extended periods
- No network calls during recording (offline-first)
- Location services not used unless user explicitly enables them

---

## 9. Scalability Roadmap

### Phase 1: Single Phone (Current)
- ✓ One phone records and bookmarks
- ✓ Local SQLite storage
- ✓ Offline operation

### Phase 2: Multi-Phone LAN (Next)
- One phone designates as "host"
- Host runs a lightweight WebSocket server
- Other phones connect via local network IP
- Bookmarks and timestamps sync in real-time
- No internet required — works on stadium WiFi or mobile hotspot

```
        ┌──────────┐
        │  Host    │  ← Server
        │  Phone   │     • Records main angle
        └────┬─────┘     • Aggregates all bookmarks
             │
      ═══════╪═══════  ← Local network (WebSocket)
             │
   ┌─────────┴──────────┐
   │                    │
┌──┴───┐           ┌───┴──┐
│Phone2│           │Phone3│  ← Guest phones
│Angle2│           │Angle3│     • Record their own angles
└──────┘           └──────┘     • Bookmark taps → host
                                • Review pulls from host timeline
```

### Phase 3: AI Analysis
- On-device ML model (TensorFlow Lite / MediaPipe)
- Real-time foul detection using pose estimation
- Offside detection using player position tracking
- Auto-tagging of goal celebrations, cards, and substitutions
- Model trained on football match data, runs entirely offline

### Phase 4: Cloud Sync & Payments
- Match upload to personal cloud storage
- Clip sharing with shareable links
- Subscription tiers:
  - **Free:** 10 matches storage, 720p max
  - **Pro:** Unlimited matches, 4K, AI analysis
  - **Team:** Multi-phone sync, cloud collaboration
- Payment integration via Stripe/RevenueCat

### Phase 5: Web Dashboard
- Coaches review matches from desktop browser
- Draw on clips (tactical annotations, offside lines)
- Export match reports as PDF

---

## 10. Upcoming Features

### MVP + 1 (Complete — all 6 checkpoints done)

- [x] Checkpoint 1: Skeleton + Navigation + Theme
- [x] Checkpoint 2: Camera + Recording + Bookmark Buttons
- [x] Checkpoint 3: Review Screen + Timeline
- [x] Checkpoint 4: SQLite persistence + Clip export
- [x] Checkpoint 5: Clips Library
- [x] Checkpoint 6: Polish — flash, zoom, error boundaries, storage manager

### Short-term (1–2 months after MVP)

- [ ] **Picture-in-picture review** — review without stopping recording
- [ ] **Slow motion playback** in review screen (0.25x, 0.5x)
- [ ] **Draw on clips** — draw arrows, circles, offside lines
- [ ] **Match timeline** — full match view with all bookmarks

### Medium-term (3–6 months)

- [ ] **Multi-phone sync** over LAN (WebSocket host)
- [ ] **Split-screen comparison** — two angles side by side
- [ ] **Audio narration** — record voice notes at bookmark time
- [ ] **Export highlight reel** — auto-compile all bookmarks into one video

### Long-term (6–12 months)

- [ ] **On-device AI foul detection** (TensorFlow Lite)
- [ ] **Player tracking** — automatic offside detection
- [ ] **Cloud account** — sync across devices
- [ ] **Web dashboard** — desktop review
- [ ] **Payment integration**

---

## 11. Development Milestones

### Checkpoint 1: Skeleton + Theme (✅ Complete)

**Files created:**
- `App.js` — Root with splash screen + database initialization
- `app.json` — Expo config (dark theme, camera/storage permissions)
- `src/theme/index.js` — Color palette (#0D0D0D / #00FF88), spacing scale, typography
- `src/navigation/AppNavigator.js` — Stack navigator (4 screens) with ErrorBoundary wrapping
- `src/screens/CameraScreen.js` — Full camera UI + recording + bookmark buttons + flash + zoom
- `src/screens/ReviewScreen.js` — Timeline, frame controls, video playback, action buttons
- `src/screens/ClipsScreen.js` — Saved clips grid with modal player, share, delete
- `src/screens/SettingsScreen.js` — Quality, real-time storage data, about section
- `src/store/useAppStore.js` — Zustand global state with SQLite sync
- `src/components/ErrorBoundary.js` — Crash recovery with retry button
- `src/utils/database.js` — SQLite service: 3 tables, CRUD, batch bookmark writer
- `src/utils/storage.js` — Free space monitor, app usage tracker, recording cleanup
- `assets/icon.svg` — Custom shield + football logo
- `assets/android-icon-foreground.png`, `-background.png`, `-monochrome.png`
- `README.md` — Full project documentation
- `POCKET_VAR_DESIGN.md` — This document (detailed architecture, 28KB)

### Checkpoint 2: Camera + Recording (✅ Complete)

- [x] Wire `expo-camera` `recordAsync()` to the record button
- [x] State management for recording lifecycle
- [x] Bookmark buttons write timestamps during recording (batched to SQLite)
- [x] Recording indicator (pulsing red dot + MM:SS elapsed time)
- [x] Tooltip on bookmark tap when not recording ("Tap ▶ to start recording")
- [x] Permission flow with permanent denial handling
- [x] Flash toggle (OFF / ON / TORCH)
- [x] Zoom toggle (1x / ~3x)
- [x] Haptic feedback + coloured flash on bookmark tap
- [x] Video saved to FileSystem.documentDirectory/matches/{id}/recording.mp4
- [x] Match auto-creation in SQLite on record start

### Checkpoint 3: Review Screen (✅ Complete)

- [x] Load the last 60 seconds of the current recording
- [x] Timeline scrubber with accurate position mapping (draggable + tappable)
- [x] Frame-by-frame stepping (±1 frame = ±33ms at 30fps)
- [x] Waveform visualisation bars (60 segments, light up as playback progresses)
- [x] Bookmark markers as coloured dots on the timeline
- [x] Play/pause the 60s window (with big overlay play button)
- [x] MARK FOUL / NO FOUL decision buttons
- [x] SAVE CLIP button
- [x] Time display (relative position + total duration)
- [x] Empty state when no recording exists

### Checkpoint 4: Database + Persistence (✅ Complete)

- [x] SQLite schema (matches, bookmarks, clips tables with proper foreign keys)
- [x] CRUD operations for all entities (create, read, update, delete)
- [x] Bookmark persistence during recording (batch writes every 2s via queueBookmark + flushBookmarkBatch)
- [x] Match auto-creation on record start with DB insert
- [x] Match finalisation on record stop (duration + video path update)
- [x] Force-flush remaining bookmarks when recording stops
- [x] Auto-load all data from SQLite on app launch

### Checkpoint 5: Clips Library (✅ Complete)

- [x] 2-column grid of saved clips with type badges + duration
- [x] Thumbnail area with play button overlay
- [x] Fullscreen video player modal (expo-video with native controls)
- [x] Share button (system share sheet via expo-sharing)
- [x] Delete with confirmation (removes video file + DB record)
- [x] Pull-to-refresh
- [x] Auto-refresh on screen focus
- [x] Clip count header
- [x] Empty state with navigation back to camera

### Checkpoint 6: Polish (✅ Complete)

- [x] Flash toggle (OFF → ON → TORCH) on Camera screen
- [x] Zoom toggle (1x / ~3x) on Camera screen
- [x] ErrorBoundary component wrapping Camera + Review screens
- [x] StorageManager utility: getStorageInfo, getAppStorageUsage, checkStorageAndWarn
- [x] Low storage warning alert (<500MB → warning, <100MB → critical)
- [x] Settings screen shows real device storage bar + app data breakdown
- [x] Delete All Recordings button (frees space, keeps clips)
- [x] App icon assets (SVG + Android adaptive icon)
- [x] Dark splash screen + status bar config in app.json
- [x] Orientation lock (portrait)
- [x] Error screen on startup failure
- [x] Camera permission flow with permanent denial message

---

## 12. Security & Privacy

### Data Handling

- **All data is local.** No data leaves the device unless the user explicitly shares a clip.
- **No accounts required.** Pocket VAR works completely offline.
- **No analytics/tracking.** No third-party SDKs that collect usage data.
- **Video files remain in the app sandbox.** Only exported clips (explicitly shared) leave the sandbox.

### Permissions

| Permission | Why | When Requested |
|------------|-----|---------------|
| Camera | Record match footage | First app launch |
| Microphone | Record match audio | First app launch |
| Storage (write) | Save exported clips to gallery | First clip save |
| Network (future) | LAN multi-phone sync | When user enables multi-phone mode |

### Payment (Future)

When payments are added:
- Use RevenueCat for cross-platform subscription management
- Stripe as payment processor
- No payment data touches Pocket VAR's code — handled entirely by RevenueCat SDK
- Subscription state stored locally, verified by receipt validation

---

> **End of Design Document**  
> Pocket VAR v1.0.0  
> Built with React Native (Expo) + ❤️
