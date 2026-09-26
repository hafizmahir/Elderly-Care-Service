import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

// Your web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyDAOCaDbruVLR9kE2NcxWncvndkL2-u8wQ",
  authDomain: "care-service-d94f7.firebaseapp.com",
  databaseURL: "https://care-service-d94f7-default-rtdb.firebaseio.com",
  projectId: "care-service-d94f7",
  storageBucket: "care-service-d94f7.firebasestorage.app",
  messagingSenderId: "644902200246",
  appId: "1:644902200246:web:c19065a13c8dc5d5565717"
};

// Initialize Firebase safely (avoid double initialization)
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(firebaseApp);

// Configure Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged
};

export type { FirebaseUser };
