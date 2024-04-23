// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
//firebase.google.com/docs/web/setup#available-librariess

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNzhoHXIcHmXmCjyuPYeaCvYrXybIST5M",
  authDomain: "notes-f0697.firebaseapp.com",
  projectId: "notes-f0697",
  storageBucket: "notes-f0697.appspot.com",
  messagingSenderId: "194393210497",
  appId: "1:194393210497:web:baa98faff355ebb7745780",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
