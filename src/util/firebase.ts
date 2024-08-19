// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "asas",
  authDomain: "asas",
  projectId: "sakjsa",
  storageBucket: "adsdsd",
  messagingSenderId: "sadjasjd",
  appId: "process",
  measurementId: "dskjdksd",
};

// Initialize Firebase
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}
export const firestore = getFirestore();
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();

