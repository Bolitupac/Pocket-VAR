import { create } from 'zustand';

/**
 * Pocket VAR — Global State
 */

let bookmarkCounter = 0;

const useAppStore = create((set, get) => ({
  // Recording state
  isRecording: false,
  recordingStartTime: null,
  elapsedSeconds: 0,
  currentMatchId: null,
  currentVideoPath: null,

  // Data
  matches: [],
  bookmarks: [],
  clips: [],

  // UI
  isReviewing: false,
  reviewBookmark: null,

  // Settings
  settings: {
    videoQuality: '1080p',
    autoSaveClips: true,
    maxReviewSeconds: 60,
    cameraFacing: 'back',
  },

  // ── Recording ────────────────────────────────────────
  startRecording: (matchId) =>
    set({
      isRecording: true,
      recordingStartTime: Date.now(),
      elapsedSeconds: 0,
      currentMatchId: matchId,
    }),

  stopRecording: (videoPath) =>
    set({
      isRecording: false,
      recordingStartTime: null,
      currentVideoPath: videoPath,
    }),

  tickElapsed: () =>
    set((state) => ({
      elapsedSeconds: state.isRecording
        ? Math.floor((Date.now() - state.recordingStartTime) / 1000)
        : state.elapsedSeconds,
    })),

  // ── Matches ──────────────────────────────────────────
  addMatch: (match) =>
    set((state) => ({ matches: [...state.matches, match] })),

  // ── Bookmarks ────────────────────────────────────────
  addBookmark: (type) => {
    const state = get();
    if (!state.isRecording || !state.currentMatchId) return null;

    const elapsed = Math.floor((Date.now() - state.recordingStartTime) / 1000);
    const bookmark = {
      id: `bm_${Date.now()}_${++bookmarkCounter}`,
      matchId: state.currentMatchId,
      type,
      timestampSeconds: elapsed,
      createdAt: new Date().toISOString(),
    };

    set((s) => ({ bookmarks: [...s.bookmarks, bookmark] }));
    return bookmark;
  },

  // ── Review ───────────────────────────────────────────
  setReviewing: (isReviewing, bookmark = null) =>
    set({ isReviewing, reviewBookmark: bookmark }),

  // ── Settings ─────────────────────────────────────────
  updateSettings: (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings } })),
}));

export default useAppStore;
