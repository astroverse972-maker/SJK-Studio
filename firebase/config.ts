// This tells TypeScript that the 'firebase' object exists globally.
declare var firebase: any;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkS_s9z2PirMcU8QmtV0-fWN03tCoJFVk",
    authDomain: "sjkstudio-ab9b8.firebaseapp.com",
    projectId: "sjkstudio-ab9b8",
    storageBucket: "sjkstudio-ab9b8.firebasestorage.app",
    messagingSenderId: "525070912691",
    appId: "1:525070912691:web:24269402d9dafb797634c6"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Export Firebase services using the v8-compatible namespaced API
export const auth = firebase.auth();
export const db = firebase.firestore();
