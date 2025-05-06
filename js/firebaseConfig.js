import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_YXnid23lFBvvMftPOA8A9iqCMi6Uejs",
    authDomain: "gescon-684aa.firebaseapp.com",
    projectId: "gescon-684aa",
    storageBucket: "gescon-684aa.appspot.com",
    messagingSenderId: "854894210731",
    appId: "1:854894210731:web:8fb476fbcb76bd7ec291ee",
    measurementId: "G-RZKSQ0HPGL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };