import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAesEza3VlbIwFrysH1CYZ3qfrpPbvSEcc",
  authDomain: "fairways-7e98e.firebaseapp.com",
  projectId: "fairways-7e98e",
  storageBucket: "fairways-7e98e.appspot.com",
  messagingSenderId: "927402148244",
  appId: "1:927402148244:web:8c6f2a992f92f214f24f81"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db_firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
