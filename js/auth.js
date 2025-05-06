import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyAKPIufxUNS2kHSErxCLANWev4w06-RfwY",
    authDomain: "cotafacil-b0489.firebaseapp.com",
    projectId: "cotafacil-b0489",
    storageBucket: "cotafacil-b0489.firebasestorage.app",
    messagingSenderId: "201488478427",
    appId: "1:201488478427:web:a334256656ec8fa53d5cfe",
    measurementId: "G-9BDP1YLJLE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function initializeAuth() {
    return auth;
}