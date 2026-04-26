import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL:
    "https://vendy-4687d-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig)
const db = getDatabase(app);

export async function getInfo(email, rute) {
    const safeEmail = email.replaceAll('.', "_");
    const ruteCompleted = `users/${safeEmail}/${rute}`;
    const a = await get(ref(db, ruteCompleted));
    if (a.exists) {
        return a.val();
    }
}

export async function getItemInfo(email) {
    const safeEmail = email.replaceAll('.', '_');
    const rute = `users/${safeEmail}/data`;
    const a = await get(ref(db, rute))
    if (a.exists()) {
        return a.val();
    }
}