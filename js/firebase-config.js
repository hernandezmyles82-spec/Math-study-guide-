/* Website accounts (sign up / log in) with Firebase.

   Leave this as null to run without accounts: notes are then saved only in each browser.

   To turn accounts on, paste your Firebase web app settings here. Find them in the Firebase console:
   Project settings → General → Your apps → Web app → "SDK setup and configuration" → Config.
   These values are not secret (every Firebase website ships them); your data is protected by the
   security rules in firestore.rules. See FIREBASE-SETUP.md for every step. */
window.MSG_FIREBASE_CONFIG = null;

/* Example of what it looks like when filled in:
window.MSG_FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
*/
