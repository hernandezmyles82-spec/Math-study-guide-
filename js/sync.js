/* Saves everything to the viewer's own claude.ai account when the site runs as a claude.ai artifact,
   so notes follow the student to any device. Elsewhere (GitHub Pages, a local file) this does nothing
   and the site keeps using browser storage only.

   Data lives in the viewer's private subtree:  data/users/<id>/state  (manifest: {ver, n, updatedAt})
   and  data/users/<id>/state/chunks/<ver>-<i>  ({s: part of the JSON text}). Documents are capped at
   256 KiB, so the JSON is split into chunks. A new version is written under new chunk ids before the
   manifest switches to it, so an interrupted save never leaves a half-written copy. */
(function (root) {
  'use strict';
  const Store = root.MSG.Store;
  const CHUNK = 60000; // characters; stays far under 256 KiB even when re-escaped or multi-byte
  let base = null, ready = false, writing = false, pending = false, timer = null, prev = null;

  function status(s) { if (root.MSG.onSyncStatus) root.MSG.onSyncStatus(s); }
  function timeout(p, ms) { return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), ms))]); }
  function schedule(ms) {
    if (!ready) { pending = true; return; }
    clearTimeout(timer);
    timer = setTimeout(write, ms);
  }

  async function write() {
    if (writing) { pending = true; return; }
    writing = true; pending = false;
    status('saving');
    try {
      const data = Store.snapshot();
      const text = JSON.stringify(data);
      const ver = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const n = Math.max(1, Math.ceil(text.length / CHUNK));
      const chunks = base.collection('chunks');
      for (let i = 0; i < n; i++) await chunks.doc(ver + '-' + i).set({ s: text.slice(i * CHUNK, (i + 1) * CHUNK) });
      await base.set({ ver, n, updatedAt: data.updatedAt || Date.now() });
      const old = prev; prev = { ver, n };
      if (old) for (let i = 0; i < old.n; i++) { try { await chunks.doc(old.ver + '-' + i).delete(); } catch (e) { /* leftover is harmless */ } }
      status('synced');
    } catch (e) {
      if (e && (e.code === 'invalid_argument' || e.code === 'not_granted' || e.code === 'revoked')) {
        // This viewer may not save to the account (for example, view-only access): stay browser-only.
        ready = false; Store.onChange = null; writing = false; pending = false; status('local'); return;
      }
      status(e && e.code === 'quota_exceeded' ? 'full' : 'error');
    }
    writing = false;
    if (pending) schedule(2000);
  }

  async function start() {
    if (!root.claude || typeof root.claude.use !== 'function') return; // not inside claude.ai
    status('connecting');
    Store.onChange = () => schedule(1500);
    let db = null, user = null, uid = null;
    try { [db, user] = await Promise.all([root.claude.use('db'), root.claude.use('user')]); } catch (e) { /* treated as unavailable */ }
    if (db && user) { try { uid = await user.id(); } catch (e) { uid = null; } }
    if (!db || !uid) { Store.onChange = null; status('local'); return; }
    base = db.doc('data/users/' + uid + '/state');
    try {
      const snap = await timeout(base.get(), 15000);
      const local = Store.snapshot();
      if (snap.exists) {
        const m = snap.data();
        const parts = await timeout(Promise.all(Array.from({ length: m.n }, (_, i) => base.collection('chunks').doc(m.ver + '-' + i).get())), 20000);
        prev = { ver: m.ver, n: m.n };
        if (parts.every((p) => p.exists)) {
          const cloud = JSON.parse(parts.map((p) => p.data().s).join(''));
          if ((cloud.updatedAt || 0) > (local.updatedAt || 0)) {
            if (Store.replaceAll(cloud) && root.MSG.onCloudLoad) root.MSG.onCloudLoad();
          } else if ((local.updatedAt || 0) > (cloud.updatedAt || 0)) pending = true;
        } else pending = true;
      } else if (Object.keys(local.profiles || {}).length) pending = true;
      ready = true;
      status('synced');
      if (pending) schedule(0);
    } catch (e) {
      Store.onChange = null;
      status(e && (e.code === 'not_granted' || e.code === 'invalid_argument') ? 'local' : 'error');
    }
  }

  root.MSG.Sync = { start };
  start();
})(typeof window !== 'undefined' ? window : globalThis);
