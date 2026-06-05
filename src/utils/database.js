/**
 * Pocket VAR — Database Service
 *
 * Uses expo-sqlite to persist matches, bookmarks, and clips locally.
 * Everything stays on-device — no data ever leaves the phone.
 *
 * Schema:
 *   matches   — each recording session
 *   bookmarks — timestamped moments (GOAL, FOUL, etc.)
 *   clips     — exported video segments
 */

import * as SQLite from 'expo-sqlite';

let db = null;

// ─── Init: Open DB + Create Tables ────────────────────────
export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('pocket_var.db');

  // Enable WAL mode for better write performance during recording
  await db.execAsync('PRAGMA journal_mode = WAL');

  // Create tables if they don't exist
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      title TEXT,
      date TEXT NOT NULL,
      duration_seconds REAL DEFAULT 0,
      video_path TEXT,
      total_bookmarks INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      match_id TEXT NOT NULL,
      timestamp_seconds REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('goal','foul','offside','yellow_card','red_card')),
      notes TEXT,
      review_decision TEXT DEFAULT 'pending'
        CHECK(review_decision IN ('pending','confirmed','overturned')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS clips (
      id TEXT PRIMARY KEY,
      bookmark_id TEXT,
      match_id TEXT NOT NULL,
      start_time REAL NOT NULL,
      end_time REAL NOT NULL,
      type TEXT NOT NULL,
      file_path TEXT,
      thumbnail_path TEXT,
      duration_seconds REAL,
      file_size_bytes INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_bookmarks_match ON bookmarks(match_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_type ON bookmarks(type);
    CREATE INDEX IF NOT EXISTS idx_clips_match ON clips(match_id);
  `);

  console.log('[DB] Database initialized');
  return db;
}

// ─── Get DB (must call initDatabase first) ─────────────────
function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

// ═══════════════════════════════════════════════════════════
// MATCHES
// ═══════════════════════════════════════════════════════════

export async function createMatch(id, title, date) {
  const d = getDb();
  await d.runAsync(
    'INSERT INTO matches (id, title, date) VALUES (?, ?, ?)',
    id,
    title || `Match ${new Date(date).toLocaleDateString()}`,
    date
  );
  console.log('[DB] Match created:', id);
}

export async function updateMatchDuration(id, durationSeconds) {
  const d = getDb();
  await d.runAsync(
    'UPDATE matches SET duration_seconds = ? WHERE id = ?',
    durationSeconds,
    id
  );
}

export async function updateMatchVideoPath(id, videoPath) {
  const d = getDb();
  await d.runAsync(
    'UPDATE matches SET video_path = ? WHERE id = ?',
    videoPath,
    id
  );
}

export async function getMatch(id) {
  const d = getDb();
  return d.getFirstAsync('SELECT * FROM matches WHERE id = ?', id);
}

export async function getAllMatches() {
  const d = getDb();
  return d.getAllAsync('SELECT * FROM matches ORDER BY created_at DESC');
}

export async function deleteMatch(id) {
  const d = getDb();
  // CASCADE deletes bookmarks and clips too
  await d.runAsync('DELETE FROM matches WHERE id = ?', id);
}

// ═══════════════════════════════════════════════════════════
// BOOKMARKS
// ═══════════════════════════════════════════════════════════

export async function createBookmark(id, matchId, timestampSeconds, type) {
  const d = getDb();
  await d.runAsync(
    'INSERT INTO bookmarks (id, match_id, timestamp_seconds, type) VALUES (?, ?, ?, ?)',
    id,
    matchId,
    timestampSeconds,
    type
  );
  // Update match bookmark count
  await d.runAsync(
    'UPDATE matches SET total_bookmarks = total_bookmarks + 1 WHERE id = ?',
    matchId
  );
  console.log('[DB] Bookmark saved:', type, '@', timestampSeconds + 's');
}

export async function getBookmarksForMatch(matchId) {
  const d = getDb();
  return d.getAllAsync(
    'SELECT * FROM bookmarks WHERE match_id = ? ORDER BY timestamp_seconds ASC',
    matchId
  );
}

export async function updateBookmarkDecision(id, decision) {
  const d = getDb();
  await d.runAsync(
    'UPDATE bookmarks SET review_decision = ? WHERE id = ?',
    decision,
    id
  );
}

export async function deleteBookmark(id) {
  const d = getDb();
  await d.runAsync('DELETE FROM bookmarks WHERE id = ?', id);
}

// ═══════════════════════════════════════════════════════════
// CLIPS
// ═══════════════════════════════════════════════════════════

export async function createClip(id, matchId, bookmarkId, startTime, endTime, type, filePath) {
  const d = getDb();
  const duration = endTime - startTime;
  await d.runAsync(
    `INSERT INTO clips (id, match_id, bookmark_id, start_time, end_time, type, file_path, duration_seconds)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    matchId,
    bookmarkId || null,
    startTime,
    endTime,
    type,
    filePath,
    duration
  );
  console.log('[DB] Clip saved:', id);
  return { id, duration };
}

export async function getClipsForMatch(matchId) {
  const d = getDb();
  return d.getAllAsync(
    'SELECT * FROM clips WHERE match_id = ? ORDER BY created_at DESC',
    matchId
  );
}

export async function getAllClips() {
  const d = getDb();
  return d.getAllAsync('SELECT * FROM clips ORDER BY created_at DESC');
}

export async function deleteClip(id) {
  const d = getDb();
  await d.runAsync('DELETE FROM clips WHERE id = ?', id);
}

// ═══════════════════════════════════════════════════════════
// BATCH OPERATIONS (for recording performance)
// ═══════════════════════════════════════════════════════════

let bookmarkBatch = [];
let batchTimer = null;

/**
 * Queue a bookmark write. Flushes to SQLite every 2 seconds
 * so we don't hammer the DB during recording.
 */
export function queueBookmark(id, matchId, timestampSeconds, type) {
  bookmarkBatch.push({ id, matchId, timestampSeconds, type });
  if (!batchTimer) {
    batchTimer = setTimeout(flushBookmarkBatch, 2000);
  }
}

async function flushBookmarkBatch() {
  batchTimer = null;
  if (bookmarkBatch.length === 0) return;

  const batch = bookmarkBatch.splice(0, bookmarkBatch.length);
  console.log(`[DB] Flushing ${batch.length} bookmarks...`);

  try {
    const d = getDb();
    // Use a transaction for the batch write
    await d.withTransactionAsync(async () => {
      for (const bm of batch) {
        await d.runAsync(
          'INSERT INTO bookmarks (id, match_id, timestamp_seconds, type) VALUES (?, ?, ?, ?)',
          bm.id, bm.matchId, bm.timestampSeconds, bm.type
        );
      }
      // Update match count once
      if (batch.length > 0) {
        await d.runAsync(
          'UPDATE matches SET total_bookmarks = total_bookmarks + ? WHERE id = ?',
          batch.length,
          batch[0].matchId
        );
      }
    });
  } catch (e) {
    console.error('[DB] Batch flush error:', e);
  }
}

/**
 * Force-flush remaining bookmarks (call when recording stops).
 */
export async function flushBookmarks() {
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
  await flushBookmarkBatch();
}
