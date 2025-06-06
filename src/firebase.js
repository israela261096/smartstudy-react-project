import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEVCu4Ko8KAe9GaRTRkeKQUNIYBsFNtUg",
  authDomain: "smartstudy-app-c8e2e.firebaseapp.com",
  projectId: "smartstudy-app-c8e2e",
  storageBucket: "smartstudy-app-c8e2e.appspot.com", // ← שימי לב: כאן חייבת להיות .appspot.com
  messagingSenderId: "671525399154",
  appId: "1:671525399154:web:6ce7bbaf3824c523eef0eb",
  measurementId: "G-2GRTSNY8Q3"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);