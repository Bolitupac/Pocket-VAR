/**
 * Pocket VAR — Storage Manager
 *
 * Monitors free disk space and manages recording cleanup
 * to prevent the app from filling up the device.
 */

import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

const LOW_STORAGE_THRESHOLD = 500 * 1024 * 1024; // 500MB
const CRITICAL_STORAGE_THRESHOLD = 100 * 1024 * 1024; // 100MB
const WARNED_KEY = 'storage_warned';

/**
 * Check free storage space. Returns { free, total, percentUsed, isLow, isCritical }.
 */
export async function getStorageInfo() {
  try {
    const info = await FileSystem.getFreeDiskStorageAsync();
    const total = await FileSystem.getTotalDiskCapacityAsync();
    const free = info; // bytes
    const used = total - free;
    const percentUsed = total > 0 ? (used / total) * 100 : 0;

    return {
      free,
      total,
      used,
      percentUsed,
      isLow: free < LOW_STORAGE_THRESHOLD,
      isCritical: free < CRITICAL_STORAGE_THRESHOLD,
      freeFormatted: formatBytes(free),
      usedFormatted: formatBytes(used),
      totalFormatted: formatBytes(total),
    };
  } catch (e) {
    console.error('[Storage] Error checking space:', e);
    return { free: Infinity, total: Infinity, isLow: false, isCritical: false };
  }
}

/**
 * Format bytes to human-readable string.
 */
function formatBytes(bytes) {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

/**
 * Calculate storage used by Pocket VAR data.
 */
export async function getAppStorageUsage() {
  try {
    const matchDir = `${FileSystem.documentDirectory}matches`;
    const dirInfo = await FileSystem.getInfoAsync(matchDir);
    if (!dirInfo.exists) return { totalSize: 0, matchCount: 0, clipsCount: 0 };

    const contents = await FileSystem.readDirectoryAsync(matchDir);
    let totalSize = 0;
    let clipCount = 0;

    for (const matchId of contents) {
      const matchPath = `${matchDir}/${matchId}`;
      const matchInfo = await FileSystem.getInfoAsync(matchPath);
      if (matchInfo.exists) totalSize += matchInfo.size || 0;

      // Count clips
      const clipsPath = `${matchPath}/clips`;
      try {
        const clips = await FileSystem.readDirectoryAsync(clipsPath);
        clipCount += clips.length;
      } catch {}
    }

    return {
      totalSize,
      totalFormatted: formatBytes(totalSize),
      matchCount: contents.length,
      clipsCount: clipCount,
    };
  } catch (e) {
    console.error('[Storage] Usage check error:', e);
    return { totalSize: 0, matchCount: 0, clipsCount: 0 };
  }
}

/**
 * Delete a match's full recording to free space.
 * Call this after all clips have been extracted from it.
 */
export async function deleteMatchRecording(matchId) {
  try {
    const matchDir = `${FileSystem.documentDirectory}matches/${matchId}`;
    const filePath = `${matchDir}/recording.mp4`;
    await FileSystem.deleteAsync(filePath, { idempotent: true });
    console.log('[Storage] Deleted recording for match:', matchId);
    return true;
  } catch (e) {
    console.error('[Storage] Delete error:', e);
    return false;
  }
}

/**
 * Delete ALL match recordings but keep clips.
 * Useful for freeing space before a tournament.
 */
export async function deleteAllRecordings() {
  try {
    const matchDir = `${FileSystem.documentDirectory}matches`;
    const matches = await FileSystem.readDirectoryAsync(matchDir);
    let deleted = 0;

    for (const matchId of matches) {
      const recordingPath = `${matchDir}/${matchId}/recording.mp4`;
      try {
        await FileSystem.deleteAsync(recordingPath, { idempotent: true });
        deleted++;
      } catch {}
    }

    console.log(`[Storage] Deleted ${deleted} recordings`);
    return deleted;
  } catch (e) {
    console.error('[Storage] Delete all error:', e);
    return 0;
  }
}

/**
 * Show a warning alert if storage is low.
 * Only shows once per session.
 */
let warned = false;
export async function checkStorageAndWarn() {
  if (warned) return;
  const info = await getStorageInfo();
  if (info.isCritical) {
    warned = true;
    Alert.alert(
      'Storage Critical',
      `Only ${info.freeFormatted} remaining. Recordings may fail. Delete old matches or clips to free space.`
    );
  } else if (info.isLow) {
    warned = true;
    Alert.alert(
      'Storage Low',
      `${info.freeFormatted} remaining. Consider deleting old recordings.`
    );
  }
  return info;
}
