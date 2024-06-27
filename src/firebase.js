import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app= firebase.initializeApp({
  apiKey: "AIzaSyC3a-2ZNR_bGh8D6jKZlfs95gVbv-t3RIM",
  authDomain: "skill-2040.firebaseapp.com",
  projectId: "skill-2040",
  storageBucket: "skill-2040.appspot.com",
  messagingSenderId: "613789960195",
  appId: "1:613789960195:web:b1b417578d902fcfb8a636"
})

export const auth= app.auth()
export default app