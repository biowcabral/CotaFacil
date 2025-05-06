import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAKPIufxUNS2kHSErxCLANWev4w06-RfwY",
    authDomain: "cotafacil-b0489.firebaseapp.com",
    projectId: "cotafacil-b0489",
    storageBucket: "cotafacil-b0489.firebasestorage.app",
    messagingSenderId: "201488478427",
    appId: "1:201488478427:web:a334256656ec8fa53d5cfe",
    measurementId: "G-9BDP1YLJLE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };