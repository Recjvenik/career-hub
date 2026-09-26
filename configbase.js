// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbdgblttxxeiuGjd4Lk-aAcEF1HCo86_4",
  authDomain: "gotechplace-e91bc.firebaseapp.com",
  projectId: "gotechplace-e91bc",
  storageBucket: "gotechplace-e91bc.firebasestorage.app",
  messagingSenderId: "227037159117",
  appId: "1:227037159117:web:f79dfc3caffd75ce125384",
  measurementId: "G-ET7T167RGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

