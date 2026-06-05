import { create } from 'zustand';

/**
 * Pocket VAR — Global State
 * Lightweight Zustand store for cross-screen state
 */

const useAppStore = create((set, get) => ({
  // Recording state
  isRecording: false,
  recordingStartTime: null,
  currentMatchId: null,

  // Match data
  matches: [],
  bookmarks: [],
  clips: [],

  // UI state
  isReviewing: false,
  reviewBookmark: null,

  // Settings
  settings: {
    videoQuality: '1080p',
    autoSaveClips: true,
    maxReviewSeconds: 60,
    storageUsed: 0,
    cameraFacing: 'back',
  },

  // Actions
  setRecording: (recording, startTime) =>
    set({ isRecording: recording, recordingStartTime: startTime }),

  setCurrentMatch: (matchId) => set({ currentMatchId: matchId }),

  addBookmark: (bookmark) =>
    set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),

  addMatch: (match) =>
    set((state) => ({ matches: [...state.matches, match] })),

  setReviewing: (isReviewing, bookmark = null) =>
    set({ isReviewing, reviewBookmark: bookmark }),

  updateSettings: (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings } })),
}));

export default useAppStore;
