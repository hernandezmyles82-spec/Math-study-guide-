/* Saves everything to the person's online account so their notes follow them to any device.

   MSG.SyncEngine(backend) is shared by two kinds of account:
     - claude.ai (bottom of this file): when the site runs as a claude.ai artifact.
     - website accounts with Firebase (js/accounts.js): on the normal website.
   Without either, the site keeps using browser storage only.

   Storage shape, the same for both: one small manifest {ver, n, updatedAt} and the whole saved JSON
   split into chunks with ids "<ver>-<i>" (databases cap document size). A save writes a NEW set of
   chunk ids before the manifest switches to them, so an interrupted save never corrupts the saved
   copy. The copy with the newer updatedAt wins when the browser and the account disagree.

   backend: { getManifest(), getChunk(id) -> string|null, setChunk(id, s), setManifest(m), deleteChunk(id) } */
(function (root) {
  'use strict';
  const Store = root.MSG.Store;
  const CHUNK = 60000; // characters; far below any document limit even when escaped or multi-byte

  function status(s) { if (root.MSG.onSyncStatus) root.MSG.onSyncStatus(s); }
  function timeout(p, ms) { return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), ms))]); }

  function SyncEngine(backend, opts) {
    opts = opts || {};
    let ready = false, writing = false, pending = false, timer = null, prev = null, stopped = false, current = null;

    function schedule(ms) {
      if (stopped) return;
      if (!ready) { pending = true; return; }
      clearTimeout(timer);
      timer = setTimeout(write, ms);
    }

    async function write() {
      if (stopped) return;
      if (writing) { pending = true; return; }
      writing = true; pending = false;
      status('saving');
      const run = (async () => {
        const data = Store.snapshot();
        const text = JSON.stringify(data);
        const ver = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const n = Math.max(1, Math.ceil(text.length / CHUNK));
        for (let i = 0; i < n; i++) await backend.setChunk(ver + '-' + i, text.slice(i * CHUNK, (i + 1) * CHUNK));
        await backend.setManifest({ ver, n, updatedAt: data.updatedAt || Date.now() });
        const old = prev; prev = { ver, n };
        if (old) for (let i = 0; i < old.n; i++) { try { await backend.deleteChunk(old.ver + '-' + i); } catch (e) { /* leftover is harmless */ } }
      })();
      current = run;
      try {
        await run;
        if (!stopped) status('synced');
      } catch (e) {
        if (opts.isFatal && opts.isFatal(e)) { stop(); status('local'); writing = false; return; }
        if (!stopped) status(e && (e.code === 'quota_exceeded' || e.code === 'resource-exhausted') ? 'full' : 'error');
      }
      writing = false;
      current = null;
      if (pending && !stopped) schedule(2000);
    }

    /* Load the account copy; keeps whichever copy is newer. Resolves true if account data replaced the browser copy. */
    async function load() {
      Store.onChange = () => schedule(1500);
      status('connecting');
      let replaced = false;
      const local = Store.snapshot();
      const m = await timeout(backend.getManifest(), 15000);
      if (m && m.ver && m.n) {
        const parts = await timeout(Promise.all(Array.from({ length: m.n }, (_, i) => backend.getChunk(m.ver + '-' + i))), 20000);
        prev = { ver: m.ver, n: m.n };
        if (parts.every((p) => typeof p === 'string')) {
          const cloud = JSON.parse(parts.join(''));
          if ((cloud.updatedAt || 0) > (local.updatedAt || 0)) replaced = Store.replaceAll(cloud);
          else if ((local.updatedAt || 0) > (cloud.updatedAt || 0)) pending = true;
        } else pending = true;
      } else if (Object.keys(local.profiles || {}).length) pending = true;
      ready = true;
      status('synced');
      if (pending) schedule(0);
      return replaced;
    }

    /* Save anything not yet saved (used before signing out). */
    async function flush() {
      clearTimeout(timer);
      if (current) { try { await current; } catch (e) { /* reported already */ } }
      if (ready && pending && !stopped) { pending = false; await write(); }
    }

    function stop() { stopped = true; clearTimeout(timer); if (Store.onChange) Store.onChange = null; }

    return { load, flush, stop, schedule };
  }

  root.MSG.SyncEngine = SyncEngine;
  root.MSG.syncTimeout = timeout;

  /* ---------- claude.ai account (when the site runs as a claude.ai artifact) ---------- */
  /* Each claude.ai account gets its own browser copy (Store.useAccount('claude-' + id)), so on a shared
     computer one person never sees, or uploads into their account, the notes of whoever used it before.
     Until the account is known nothing is loaded (Sync.loading); visitors without an account fall back
     to the shared browser copy. */
  const Sync = { start: startClaude, loading: false };
  const inClaude = !!(root.claude && typeof root.claude.use === 'function') && !root.MSG_FIREBASE_CONFIG;
  if (inClaude) { Sync.loading = true; Store.useAccount(null); }
  function settle(uid) {
    if (uid) Store.useAccount('claude-' + uid); else Store.useBrowserOnly();
    Sync.loading = false;
    if (root.MSG.onCloudLoad) root.MSG.onCloudLoad();
  }

  async function startClaude() {
    if (!inClaude) return;
    status('connecting');
    let db = null, user = null, uid = null;
    try { [db, user] = await Promise.all([root.claude.use('db'), root.claude.use('user')]); } catch (e) { /* treated as unavailable */ }
    if (db && user) { try { uid = await user.id(); } catch (e) { uid = null; } }
    if (!db || !uid) { settle(null); status('local'); return; }
    settle(uid);
    const base = db.doc('data/users/' + uid + '/state');
    const chunks = base.collection('chunks');
    const engine = SyncEngine({
      async getManifest() { const s = await base.get(); return s.exists ? s.data() : null; },
      async getChunk(id) { const s = await chunks.doc(id).get(); return s.exists ? s.data().s : null; },
      setChunk(id, s) { return chunks.doc(id).set({ s }); },
      setManifest(m) { return base.set(m); },
      deleteChunk(id) { return chunks.doc(id).delete(); }
    }, {
      // This viewer may not save to the account (for example, view-only access): stay browser-only.
      isFatal: (e) => e && (e.code === 'invalid_argument' || e.code === 'not_granted' || e.code === 'revoked')
    });
    try {
      await engine.load();
      if (root.MSG.onCloudLoad) root.MSG.onCloudLoad();
    } catch (e) {
      engine.stop();
      status(e && (e.code === 'not_granted' || e.code === 'invalid_argument') ? 'local' : 'error');
    }
  }

  root.MSG.Sync = Sync;
  startClaude();
})(typeof window !== 'undefined' ? window : globalThis);
