// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNQZo4q4ABiG7XLXW6c_sRVyDXsxYL3xA",
  authDomain: "snippets-sharer-fea54.firebaseapp.com",
  projectId: "snippets-sharer-fea54",
  storageBucket: "snippets-sharer-fea54.appspot.com",
  messagingSenderId: "324524553936",
  appId: "1:324524553936:web:cb7beed5a18a95e04150d5",
  measurementId: "G-7HHNMCMRV4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
