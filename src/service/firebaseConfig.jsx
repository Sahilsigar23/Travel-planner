// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAe76RBNRYkFs-iSMIz-wPuH0U7NAHoKGk",
  authDomain: "travel-planner-13f0c.firebaseapp.com",
  projectId: "travel-planner-13f0c",
  storageBucket: "travel-planner-13f0c.firebasestorage.app",
  messagingSenderId: "538839749266",
  appId: "1:538839749266:web:9ca852a7fefa3a55b88c4b",
  measurementId: "G-MXFWSR2CFP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
// const analytics = getAnalytics(app);