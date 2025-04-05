// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCZ2flFczaw9dt0kSXHXeeVlBf9N2nyvWg",
    authDomain: "suvirsvp.firebaseapp.com",
    projectId: "suvirsvp",
    storageBucket: "suvirsvp.firebasestorage.app",
    messagingSenderId: "786577227817",
    appId: "1:786577227817:web:e8762e1a8be2a38ab21c38",
    measurementId: "G-249DYCW1MD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

// Optional: Initialize Analytics (Remove this line if you're not using it)
// const analytics = getAnalytics(app); // This is unused, hence the warning

export { db };
