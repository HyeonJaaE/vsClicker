import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBLMBjqGFr2wW-8oxzUHJGEbiEiSg-Ga6Q",
    authDomain: "vsclicker.firebaseapp.com",
    databaseURL: "https://vsclicker.firebaseio.com",
    projectId: "vsclicker",
    storageBucket: "vsclicker.appspot.com",
    messagingSenderId: "764010867991",
    appId: "1:764010867991:web:fbd16093ce6d21616b9b52",
    measurementId: "G-SNXYNM32TJ",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
