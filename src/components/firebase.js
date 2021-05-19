import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA1xG1TLYXLr8BFmsuWKREyqAqmT-XuSJ8",
    authDomain: "compete-stock-net.firebaseapp.com",
    databaseURL: "https://compete-stock-net-default-rtdb.firebaseio.com",
    projectId: "compete-stock-net",
    storageBucket: "compete-stock-net.appspot.com",
    messagingSenderId: "282397760423",
    appId: "1:282397760423:web:a44b089dd0b5f7dbd57482",
    measurementId: "G-6H5LC1FBP5"
  };

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();