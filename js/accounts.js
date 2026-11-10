/* Website accounts with Firebase: email + password sign up, log in, password reset and sign out.
   Turned on by filling in js/firebase-config.js; with no config this file does nothing.

   Each account's data is stored at  users/<uid>  (manifest) and  users/<uid>/chunks/<ver>-<i>
   through MSG.SyncEngine (js/sync.js). firestore.rules lets only that signed-in user read or write it.
   In the browser, each account gets its own copy (Store.useAccount), so two students sharing a
   computer never see each other's notes. */
(function (root) {
  'use strict';
  const MSG = root.MSG;
  const Store = MSG.Store;
  const config = root.MSG_FIREBASE_CONFIG;
  const A = { enabled: !!config, ready: false, user: null, loaded: false, error: null };
  MSG.Accounts = A;
  if (!config) return;

  // Nobody is signed in until Firebase says otherwise: never show the previous person's data.
  Store.useAccount(null);
  let engine = null, auth = null, fs = null;

  function rerender() { if (MSG.route) MSG.route(); }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('load ' + src));
      document.head.appendChild(s);
    });
  }

  const MESSAGES = {
    'auth/email-already-in-use': 'An account with this email already exists. Log in instead, or reset your password.',
    'auth/invalid-email': 'That email address doesn\'t look right. Check it and try again.',
    'auth/weak-password': 'Choose a password with at least 6 characters.',
    'auth/missing-password': 'Enter your password.',
    'auth/invalid-credential': 'Wrong email or password. Try again, or reset your password.',
    'auth/wrong-password': 'Wrong email or password. Try again, or reset your password.',
    'auth/user-not-found': 'Wrong email or password. Try again, or reset your password.',
    'auth/too-many-requests': 'Too many tries. Wait a few minutes, or reset your password.',
    'auth/network-request-failed': 'Can\'t reach the server. Check your internet connection and try again.',
    'auth/operation-not-allowed': 'Email sign-in is turned off for this site. (Site owner: enable Email/Password in Firebase Authentication.)'
  };
  A.message = (e) => MESSAGES[e && e.code] || (e && e.message) || 'Something went wrong. Try again.';

  function backendFor(uid) {
    const base = fs.collection('users').doc(uid);
    const chunks = base.collection('chunks');
    return {
      async getManifest() { const s = await base.get(); return s.exists ? s.data() : null; },
      async getChunk(id) { const s = await chunks.doc(id).get(); return s.exists ? s.data().s : null; },
      setChunk(id, s) { return chunks.doc(id).set({ s }); },
      setManifest(m) { return base.set(m); },
      deleteChunk(id) { return chunks.doc(id).delete(); }
    };
  }

  async function onUser(user) {
    if (engine) { engine.stop(); engine = null; }
    A.user = user ? { uid: user.uid, email: user.email, name: user.displayName || '' } : null;
    A.ready = true; A.loaded = false;
    if (!user) { Store.useAccount(null); if (MSG.onSyncStatus) MSG.onSyncStatus('signedout'); rerender(); return; }
    Store.useAccount(user.uid);
    rerender(); // show the copy kept in this browser right away
    engine = MSG.SyncEngine(backendFor(user.uid), { isFatal: (e) => e && e.code === 'permission-denied' });
    try { await engine.load(); } catch (e) { if (MSG.onSyncStatus) MSG.onSyncStatus('error'); }
    if (!A.user || A.user.uid !== user.uid) return; // signed out meanwhile
    if (!Store.current()) Store.createProfile(A.user.name || (user.email || 'Student').split('@')[0]);
    A.loaded = true;
    rerender();
  }

  A.signUp = async (name, email, password) => {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    if (name) {
      await cred.user.updateProfile({ displayName: name });
      if (A.user && A.user.uid === cred.user.uid) {
        A.user.name = name;
        const p = Store.current();
        if (p && p.name !== name && !p.notes.length) Store.renameProfile(name);
      }
    }
  };
  A.logIn = (email, password) => auth.signInWithEmailAndPassword(email, password);
  A.resetPassword = (email) => auth.sendPasswordResetEmail(email);
  A.logOut = async () => {
    if (engine) await engine.flush(); // save the last changes first
    await auth.signOut();
  };

  (async () => {
    try {
      if (!root.firebase) {
        await loadScript('vendor/firebase/firebase-app-compat.js');
        await loadScript('vendor/firebase/firebase-auth-compat.js');
        await loadScript('vendor/firebase/firebase-firestore-compat.js');
      }
      const app = root.firebase.apps && root.firebase.apps.length ? root.firebase.app() : root.firebase.initializeApp(config);
      auth = app.auth();
      fs = app.firestore();
      auth.onAuthStateChanged((u) => { onUser(u); });
    } catch (e) {
      A.ready = true; A.error = 'Accounts could not be loaded. Check your internet connection and refresh the page.';
      rerender();
    }
  })();
})(typeof window !== 'undefined' ? window : globalThis);
