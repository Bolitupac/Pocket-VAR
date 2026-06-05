import { create } from 'zustand';
import {
  createMatch as dbCreateMatch,
  updateMatchDuration,
  updateMatchVideoPath,
  getAllMatches,
  getBookmarksForMatch,
  getAllClips,
  createBookmark as dbCreateBookmark,
  queueBookmark,
  flushBookmarks,
} from '../utils/database';

let bookmarkCounter = 0;

const useAppStore = create((set, get) => ({
  // ── Database ready flag ──────────────────────────────
  dbReady: false,

  // ── Recording state ──────────────────────────────────
  isRecording: false,
  recordingStartTime: null,
  elapsedSeconds: 0,
  currentMatchId: null,
  currentVideoPath: null,

  // ── Data (loaded from SQLite) ────────────────────────
  matches: [],
  bookmarks: [],
  clips: [],

  // ── UI ───────────────────────────────────────────────
  isReviewing: false,
  reviewBookmark: null,

  // ── Settings ─────────────────────────────────────────
  settings: {
    videoQuality: '1080p',
    autoSaveClips: true,
    maxReviewSeconds: 60,
    cameraFacing: 'back',
  },

  // ── Load all data from SQLite into memory ────────────
  loadFromDatabase: async () => {
    try {
      const matches = await getAllMatches();
      // Load bookmarks for the most recent match
      let bookmarks = [];
      if (matches.length > 0) {
        bookmarks = await getBookmarksForMatch(matches[0].id);
      }
      const clips = await getAllClips();
      set({ matches, bookmarks, clips, dbReady: true });
      console.log(`[Store] Loaded ${matches.length} matches, ${bookmarks.length} bookmarks, ${clips.length} clips`);
    } catch (e) {
      console.error('[Store] Load error:', e);
      set({ dbReady: true });
    }
  },

  // ── Recording ────────────────────────────────────────
  startRecording: (matchId) => {
    const date = new Date().toISOString();
    // Save match to SQLite immediately
    dbCreateMatch(matchId, null, date).catch(console.error);
    set({
      isRecording: true,
      recordingStartTime: Date.now(),
      elapsedSeconds: 0,
      currentMatchId: matchId,
    });
  },

  stopRecording: async (videoPath) => {
    const state = get();
    const elapsed = Math.floor((Date.now() - state.recordingStartTime) / 1000);

    // Flush any queued bookmarks
    await flushBookmarks();

    // Update match in DB
    if (state.currentMatchId) {
      await updateMatchDuration(state.currentMatchId, elapsed).catch(console.error);
      if (videoPath) {
        await updateMatchVideoPath(state.currentMatchId, videoPath).catch(console.error);
      }
    }

    set({
      isRecording: false,
      recordingStartTime: null,
      currentVideoPath: videoPath,
    });
  },

  tickElapsed: () =>
    set((state) => ({
      elapsedSeconds: state.isRecording
        ? Math.floor((Date.now() - state.recordingStartTime) / 1000)
        : state.elapsedSeconds,
    })),

  // ── Matches ──────────────────────────────────────────
  // In-memory add for snap reactivity. DB write happens in startRecording.
  addMatch: (match) =>
    set((state) => ({ matches: [...state.matches, match] })),

  refreshMatches: async () => {
    const matches = await getAllMatches();
    set({ matches });
  },

  // ── Bookmarks ────────────────────────────────────────
  addBookmark: (type) => {
    const state = get();
    if (!state.isRecording || !state.currentMatchId) return null;

    const elapsed = Math.floor((Date.now() - state.recordingStartTime) / 1000);
    const id = `bm_${Date.now()}_${++bookmarkCounter}`;
    const bookmark = {
      id,
      matchId: state.currentMatchId,
      type,
      timestampSeconds: elapsed,
      createdAt: new Date().toISOString(),
    };

    // Queue for batch SQLite write (flushes every 2s during recording)
    queueBookmark(id, state.currentMatchId, elapsed, type);

    // Update memory immediately for UI reactivity
    set((s) => ({ bookmarks: [...s.bookmarks, bookmark] }));
    return bookmark;
  },

  refreshBookmarks: async (matchId) => {
    const bookmarks = matchId
      ? await getBookmarksForMatch(matchId)
      : [];
    set({ bookmarks });
  },

  // ── Clips ────────────────────────────────────────────
  refreshClips: async () => {
    const clips = await getAllClips();
    set({ clips });
  },

  addClipToList: (clip) =>
    set((state) => ({ clips: [clip, ...state.clips] })),

  removeClip: (clipId) =>
    set((state) => ({
      clips: state.clips.filter((c) => c.id !== clipId),
    })),

  // ── Review ───────────────────────────────────────────
  setReviewing: (isReviewing, bookmark = null) =>
    set({ isReviewing, reviewBookmark: bookmark }),

  // ── Settings ─────────────────────────────────────────
  updateSettings: (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings } })),
}));

export default useAppStore;
