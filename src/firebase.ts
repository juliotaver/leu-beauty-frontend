import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD5rP749e-_FUctfRvHtCEgLInQdJQ5-0Q",
    authDomain: "leu-beauty-loyalty.firebaseapp.com",
    projectId: "leu-beauty-loyalty",
    storageBucket: "leu-beauty-loyalty.firebasestorage.app",
    messagingSenderId: "670805211817",
    appId: "1:670805211817:web:eeaca1a089d7c35282c7b8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);