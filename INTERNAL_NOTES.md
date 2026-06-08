# 🔧 Pocket VAR — Internal Dev Notes

> This file is git-ignored. It documents known bugs, architectural flaws,
> and performance/overheating guidance for active development.

---

## 🐛 Known Bugs

### 🔴 Critical (App-Breaking)

**1. expo-video API is used incorrectly throughout**
- `VideoView` in expo-video v2+ (which ships with Expo SDK 56) does NOT accept a `source={{ uri }}` prop.
  You must create a player via the `useVideoPlayer(source)` hook and pass `player={player}` to `<VideoView>`.
- Affected files: `ClipsScreen.js:114`, `ReviewScreen.js:181`

**2. `onStatusUpdate` prop does not exist in expo-video**
- The correct API is event listeners on the player object:
  `player.addListener('statusChange', handler)`
- Affected: `ReviewScreen.js:185`
- As a result, `status.isPlaying`, `status.currentTime`, and `status.duration` are always their initial values (0 / false).

**3. Playback control methods use expo-av naming (wrong package)**
- `playerRef.current?.seekTo()` → should be `player.seekBy()` or `player.currentTime = x`
- `playerRef.current?.play()` → `player.play()`
- `playerRef.current?.pause()` → `player.pause()`
- `playerRef` is a `useRef(null)` on `<VideoView>`, which does NOT expose these methods.
  The player object from `useVideoPlayer()` does.
- Affected: `ReviewScreen.js:117, 200, 264, 274, 276, 284`

**4. SAVE CLIP button does nothing**
- Both `handleMarkFoul` and the `💾 SAVE CLIP` button just call `navigation.goBack()`.
  There is a TODO comment left in place. The clip export, thumbnail generation, and DB write are not implemented.
- Affected: `ReviewScreen.js:143, 307-309`
- Fix: Use `expo-video-thumbnails` (already installed) for the thumbnail.
  Use `expo-file-system` to copy the video segment. Call `createClip()` from `database.js`. Then call `addClipToList()` on the store.

---

### 🟠 Logic Flaws

**5. `stopRecording` is called twice on success**
- In `handleRecord`, when recording succeeds:
  - Line 183: `stopRecording(null)` is called inside the `if (isRecording)` branch immediately
  - Line 202: `stopRecording(destPath)` is called after the file move
- The store state (isRecording, currentVideoPath) gets reset twice. Between the two calls, `currentVideoPath` is briefly `null`.
- Fix: Remove line 183. Only call `stopRecording` once, after the file move is confirmed.

**6. `loadFromDatabase` only loads bookmarks for the most recent match**
- In `useAppStore.js:51`, bookmarks are only fetched for `matches[0].id`.
  If the user navigates to an older match's review, no bookmarks will be shown.
- Fix: Load bookmarks lazily per match when the Review screen mounts, or load all bookmarks at startup.

**7. Settings are not persisted**
- `updateSettings()` only writes to Zustand memory. After an app restart, video quality, max review window etc. all reset to defaults.
- Fix: Store settings in SQLite (add a `settings` table) or use `@react-native-async-storage/async-storage`.

**8. `currentMatchId` never clears between sessions**
- After stopping a recording, `currentMatchId` remains in state. Starting a brand new match later without restarting the app can create ambiguity in which match bookmarks and the review video belong to.
- Fix: Reset `currentMatchId` and `currentVideoPath` in `startRecording` before setting the new matchId.

---

### 🟡 UX Bugs

**9. Waveform bars re-randomize on every render**
- `ReviewScreen.js:223`: `Math.random()` is called inside the `Array.from().map()` inside the render function.
  Every time the component re-renders (e.g., every status tick), the bar heights change — causing constant visual flickering.
- Fix: Generate the array once with `useMemo(() => Array.from({ length: 60 }).map(() => 16 + Math.random() * 32), [])`.

**10. Flash ON and OFF show the same icon**
- `CameraScreen.js:350`: Both `'off'` and `'on'` states display `☀`. Only `'torch'` shows `🔦`.
  The user cannot tell whether flash is active.
- Fix: Use distinct icons, e.g. `☀` (OFF, dimmed opacity), `⚡` (ON), `🔦` (TORCH).

**11. Zoom control is a binary toggle, not a slider**
- The UI shows a track and thumb that imply smooth zoom control, but tapping just toggles between zoom=0 (1×) and zoom=0.5 (2.5×).
  There is no drag gesture on the zoom track.
- Fix: Attach a `PanResponder` to the vertical zoom track so dragging it continuously updates the zoom value between 0 and 1.

**12. Elapsed timer ticks 5× per second unnecessarily**
- `CameraScreen.js:155`: `setInterval(() => tickElapsed(), 200)` — fires every 200ms.
  Since `ElapsedTimer` only displays MM:SS, re-rendering 5× per second is wasteful.
- Fix: Change to `setInterval(() => tickElapsed(), 1000)`.

**13. `ErrorBoundary` missing on ClipsScreen and SettingsScreen**
- `AppNavigator.js:62,66`: Only Camera and Review are wrapped in `<ErrorBoundary>`. Clips and Settings are bare `component=` props.
- Fix: Wrap all four screens.

---

## 🚀 Performance, Overheating & Lag Fixes

Running a camera, video encoder, SQLite, and React Native's JS bridge simultaneously is heavy. Here's how to keep it cool and smooth:

---

### 1. Stop the JS timer tick during recording

**Problem:** `setInterval` at 200ms fires the JS bridge 300 times per minute just to update a clock display.

**Fix:**
```js
// Change 200 → 1000 in CameraScreen.js
const interval = setInterval(() => tickElapsed(), 1000);
```
This alone cuts JS-side re-renders for the timer by 80%.

---

### 2. Move waveform generation out of the render path

**Problem:** `Math.random()` inside render causes React to diff and repaint 60 bars on every status update.

**Fix:**
```js
const waveBars = useMemo(
  () => Array.from({ length: 60 }).map(() => 16 + Math.random() * 32),
  [] // generated once, never changes
);
```

---

### 3. Drop video quality when device is hot

**Problem:** Recording at 1080p continuously is one of the biggest heat sources. On mid-range Android devices this will cause thermal throttling within 20–30 minutes.

**Fix options:**
- Add a `720p` option to Settings and default to it for matches > 30 min.
- Detect thermal state (Android API via a native module) and auto-drop to 720p when warm.
- The `videoQuality` setting already exists in the store — wire it to `<CameraView videoQuality={settings.videoQuality} />`.

---

### 4. Use `React.memo` on ClipCard and BookmarkDot

**Problem:** When the clips list or timeline refreshes, every card and every dot re-renders even if its data didn't change.

**Fix:**
```js
const ClipCard = React.memo(function ClipCard({ clip, onPlay, onShare, onDelete }) {
  // ...
});

const BookmarkDot = React.memo(function BookmarkDot({ color, left }) {
  // ...
});
```

---

### 5. Use `useCallback` on all handlers passed as props

**Problem:** `handlePlay`, `handleShare`, `handleDelete` in ClipsScreen are recreated on every render, breaking `React.memo` on child components.

**Fix:** Wrap all three in `useCallback` (they already have the pattern in other places in the codebase).

---

### 6. Keep the Review screen's VideoView unmounted when not visible

**Problem:** `expo-video` keeps a hardware decoder session open as long as `<VideoView>` is mounted. In ClipsScreen, the `VideoPlayerModal` is mounted in the tree even when `visible=false` because `if (!clip) return null` is inside the modal, not outside it.

**Fix:**
```js
{selectedClip && (
  <VideoPlayerModal
    visible={!!selectedClip}
    clip={selectedClip}
    onClose={() => setSelectedClip(null)}
  />
)}
```
This ensures the video decoder is torn down when the modal closes, freeing GPU memory and reducing heat.

---

### 7. Reduce SQLite writes during recording

**Problem:** The batch bookmark system is already good (2s flush). But `createMatch` is called fire-and-forget with `.catch(console.error)` — if the DB is busy from a concurrent write, this silently fails.

**Fix:** Await `createMatch` inside a try/catch before calling `startRecording` on the store. This prevents ghost matches with no DB record.

---

### 8. Avoid `FileSystem.getInfoAsync` inside the recording flow

**Problem:** In `ReviewScreen.js`, `FileSystem.getInfoAsync` is called every time `currentMatchId` or `currentVideoPath` changes. If the file system is under load (e.g., still writing the recording), this can block.

**Fix:** Cache the resolved path in a ref once it's found rather than checking on every effect run.

---

### 9. Disable the camera when backgrounded

**Problem:** On Android, if the app is backgrounded mid-recording, the camera hardware stays active drawing power. This is a major heat source.

**Fix:** Listen to `AppState` changes (already imported in ReviewScreen but unused there) in CameraScreen:
```js
useEffect(() => {
  const sub = AppState.addEventListener('change', (state) => {
    if (state !== 'active' && isRecording) {
      // Auto-stop or at minimum warn the user
    }
  });
  return () => sub.remove();
}, [isRecording]);
```

---

### 10. Use `InteractionManager` before heavy DB reads

**Problem:** Navigating to ClipsScreen triggers `refreshClips()` immediately on focus. If the navigation animation is still running, the SQLite read competes with the animation thread causing jank.

**Fix:**
```js
useFocusEffect(
  useCallback(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      refreshClips();
    });
    return () => task.cancel();
  }, [])
);
```

---

## 📋 Priority Fix Order

| Priority | Fix |
|----------|-----|
| 🔴 1 | Fix `expo-video` API (`useVideoPlayer` hook, correct method names) |
| 🔴 2 | Implement SAVE CLIP (thumbnail + file copy + DB write) |
| 🟠 3 | Fix double `stopRecording` call |
| 🟠 4 | Persist settings to SQLite or AsyncStorage |
| 🟡 5 | Fix waveform flicker (`useMemo`) |
| 🟡 6 | Fix elapsed timer interval (200ms → 1000ms) |
| 🟡 7 | Fix flash icons (ON vs OFF) |
| 🟡 8 | Implement real zoom slider with PanResponder |
| 🟡 9 | Unmount VideoView when modal is closed |
| 🟡 10 | Wire `videoQuality` setting to CameraView |
| 🟡 11 | Add AppState background detection to stop/warn recording |
