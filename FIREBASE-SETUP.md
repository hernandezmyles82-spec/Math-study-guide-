# Turning on student accounts (Firebase)

With accounts on, students create a free account on the website (name, email, password).
Everything they add (notes, study cards, quiz progress, test dates) is saved to their account,
so it is there on any phone or computer where they log in. Each student sees only their own work.

It takes about 10 minutes. Firebase's free plan is enough for a class or a school.

The website has the same guide built in, with copy buttons and a settings checker: open the site and go to **Profile → Set up student accounts** (or add `#setup` to the address).

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com and sign in with a Google account.
2. Click **Create a project** (or **Add project**), name it (for example `universal-study-guide`),
   and click through. You can turn Google Analytics off.

## 2. Turn on email and password sign-in

1. In the left menu: **Build → Authentication → Get started**.
2. Under **Sign-in method**, click **Email/Password**, switch it **on**, and **Save**.

## 3. Create the database

1. In the left menu: **Build → Firestore Database → Create database**.
2. Pick a location near you, then choose **Start in production mode** and **Create**.
3. Open the **Rules** tab, replace everything with the contents of
   [`firestore.rules`](firestore.rules) from this project, and click **Publish**.
   These rules let each student read and change only their own data.

## 4. Connect the website

1. Click the gear icon → **Project settings**. Under **Your apps**, click the web icon `</>`.
2. Give it a nickname (for example `website`) and click **Register app**. You don't need Firebase Hosting.
3. Firebase shows a block like `const firebaseConfig = { apiKey: "...", ... }`.
4. Open [`js/firebase-config.js`](js/firebase-config.js) and replace `null` on the line
   `window.MSG_FIREBASE_CONFIG = null;` with those settings, so it looks like:

   ```js
   window.MSG_FIREBASE_CONFIG = {
     apiKey: "AIza...",
     authDomain: "universal-study-guide.firebaseapp.com",
     projectId: "universal-study-guide",
     storageBucket: "universal-study-guide.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123"
   };
   ```

   These values are safe to put on GitHub: every Firebase website includes them. The rules from step 3 are what protect students' data.

   You can also just paste the settings into a chat with Claude and ask for them to be added.

## 5. Allow your website's address

1. In **Authentication → Settings → Authorized domains**, click **Add domain**.
2. Add `hernandezmyles82-spec.github.io` (your GitHub Pages address).
   `localhost` is already there for testing on your own computer.

## 6. Publish the website

In the GitHub repository: **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
After a minute or two the site is at https://hernandezmyles82-spec.github.io/Math-study-guide-/
and visitors see **Log in / Create account**.

## Good to know

- **Forgot password:** the "Forgot your password?" link emails a reset link from Firebase.
  (It can land in spam the first time.)
- **Seeing your users:** Firebase console → Authentication → Users lists every account.
  You can disable or delete accounts there. Students' notes are in Firestore → `users`.
- **Turning accounts off:** set the line back to `window.MSG_FIREBASE_CONFIG = null;`.
- **The claude.ai version** of the site does not use Firebase (claude.ai blocks connections to
  outside services). It keeps saving to each person's claude.ai account instead.
