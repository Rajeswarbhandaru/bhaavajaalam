/**
 * bhava-bridge.js — Compatibility layer for Bhāva Tech
 *
 * Detects runtime environment and provides a unified API:
 *   - Electron  → delegates to window.bhava (IPC via preload)
 *   - Android / Browser → uses localStorage + cloud REST API
 *
 * Include this BEFORE bhava-session.js in every game HTML file.
 * In Electron, preload.js sets window.bhava before this runs — so
 * the Electron path is a no-op (window.bhava already exists).
 */

(function () {
  'use strict';

  // ── Already injected by Electron preload — nothing to do ──────────────────
  if (window.bhava && typeof window.bhava.login === 'function') return;

  // ── Cloud base URL ─────────────────────────────────────────────────────────
  var CLOUD = 'https://bhava-cloud.onrender.com';
  var SYNC_KEY = '0042bfd36ef4a5a219e0bbb206e58ec7b84c7d9334b75c7e';

  // ── LocalStorage helpers ───────────────────────────────────────────────────
  var LS = {
    get: function (k) {
      try { return JSON.parse(localStorage.getItem('bhava_' + k)); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { localStorage.setItem('bhava_' + k, JSON.stringify(v)); } catch (e) {}
    },
    del: function (k) {
      try { localStorage.removeItem('bhava_' + k); } catch (e) {}
    }
  };

  // ── Simple UUID generator (no crypto needed) ───────────────────────────────
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // ── Config (school context, role etc.) ────────────────────────────────────
  // On Android, config is stored in localStorage.
  // schoolId is set when the student logs in (comes from student record).
  function getConfig() {
    var cfg = LS.get('config') || {};
    return Promise.resolve({
      role:     cfg.role     || 'user',
      context:  cfg.context  || 'public',
      schoolId: cfg.schoolId || null,
      pinHash:  cfg.pinHash  || null
    });
  }

  // ── Login — looks up student from cloud by roll + class ───────────────────
  async function login(rollNo, cls) {
    try {
      var res = await fetch(
        CLOUD + '/sync/student-lookup?roll=' +
        encodeURIComponent(rollNo) + '&class=' + encodeURIComponent(cls),
        { headers: { 'x-sync-key': SYNC_KEY } }
      );
      if (!res.ok) return null;
      var data = await res.json();
      if (!data || !data.id) return null;
      // Cache student locally for offline resilience
      LS.set('student_' + rollNo + '_' + cls, data);
      return data;
    } catch (e) {
      // Fallback to cached student if offline
      var cached = LS.get('student_' + rollNo + '_' + cls);
      if (cached) return cached;
      console.warn('[bhava-bridge] login failed, offline and no cache:', e.message);
      return null;
    }
  }

  // ── Session management ─────────────────────────────────────────────────────
  // Sessions are created locally and queued for sync when online.
  function startSession(studentId, schoolId, gameName) {
    var sid = uuid();
    var session = {
      id:         sid,
      student_id: studentId,
      school_id:  schoolId,
      game_name:  gameName,
      started_at: new Date().toISOString(),
      synced:     false
    };
    LS.set('session_' + sid, session);
    // Add to pending sync queue
    var queue = LS.get('sync_queue') || [];
    queue.push(sid);
    LS.set('sync_queue', queue);
    return Promise.resolve(sid);
  }

  function endSession(sessionId, rawScore) {
    var session = LS.get('session_' + sessionId);
    if (!session) return Promise.resolve({ scaled: rawScore });
    session.raw_score  = rawScore;
    session.ended_at   = new Date().toISOString();
    session.synced     = false;
    LS.set('session_' + sessionId, session);
    // Attempt background sync
    _syncPendingSessions();
    // Return a minimal result (scaled score = raw for mobile, server will recalculate)
    return Promise.resolve({ scaled: rawScore, ok: true });
  }

  // ── Background sync ────────────────────────────────────────────────────────
  async function _syncPendingSessions() {
    var queue = LS.get('sync_queue') || [];
    if (queue.length === 0) return;
    var remaining = [];
    for (var i = 0; i < queue.length; i++) {
      var sid     = queue[i];
      var session = LS.get('session_' + sid);
      if (!session || session.raw_score == null) { remaining.push(sid); continue; }
      try {
        var res = await fetch(CLOUD + '/sync/session', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'x-sync-key': SYNC_KEY },
          body:    JSON.stringify({
            id:         session.id,
            student_id: session.student_id,
            school_id:  session.school_id,
            game_name:  session.game_name,
            raw_score:  session.raw_score,
            started_at: session.started_at,
            ended_at:   session.ended_at,
            source:     'android'
          })
        });
        if (res.ok) {
          session.synced = true;
          LS.set('session_' + sid, session);
          // Don't add back to remaining — it's synced
        } else {
          remaining.push(sid);
        }
      } catch (e) {
        // Offline — keep in queue for next time
        remaining.push(sid);
      }
    }
    LS.set('sync_queue', remaining);
  }

  // ── Score getters — return empty on mobile (not needed for game play) ──────
  function getIQScores(sid)      { return Promise.resolve({}); }
  function getEQScores(sid)      { return Promise.resolve({}); }
  function getSQScores(sid)      { return Promise.resolve({}); }
  function getGameSessions(sid)  { return Promise.resolve([]); }

  // ── Expose as window.bhava ─────────────────────────────────────────────────
  window.bhava = {
    // Core
    getConfig:        getConfig,
    login:            login,
    startSession:     startSession,
    endSession:       endSession,

    // Scores (stubs for mobile — report not shown on mobile)
    getIQScores:      getIQScores,
    getEQScores:      getEQScores,
    getSQScores:      getSQScores,
    getGameSessions:  getGameSessions,

    // Sync trigger (can be called manually)
    syncNow:          _syncPendingSessions,

    // Stubs for setup/admin (not used on mobile)
    setRole:          function () { return Promise.resolve({ ok: true }); },
    setPin:           function () { return Promise.resolve({ ok: true }); },
    setContext:       function () { return Promise.resolve({ ok: true }); },
    setSchoolId:      function () { return Promise.resolve({ ok: true }); },
    verifyPin:        function () { return Promise.resolve({ ok: true }); },
    resetConfig:      function () { return Promise.resolve({ ok: true }); },
    getCapacityScores: function () { return Promise.resolve([]); }
  };

  console.log('[bhava-bridge] Android/browser mode active');

  // Sync any pending sessions on page load
  _syncPendingSessions();

})();
