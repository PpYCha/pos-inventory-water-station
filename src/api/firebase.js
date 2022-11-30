import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBeC34sxS7NwqOKLS8_NBwXnN0A_w72VSk",
  authDomain: "water-pos-60b3d.firebaseapp.com",
  projectId: "water-pos-60b3d",
  storageBucket: "water-pos-60b3d.appspot.com",
  messagingSenderId: "571664418101",
  appId: "1:571664418101:web:e55de2c4150d7920e7b87c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db_firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
