// ====== Firebase config (REPLACE these with your own Firebase project values) ======
const firebaseConfig = {
  apiKey: "<1AIzaSyBqcFZdP284oYPscP6HX1Cg-UWGbQ3vhQs>",
  authDomain: "<daydream-design>.firebaseapp.com",
  projectId: "<daydream-design>",
  storageBucket: "<daydream-design>.appspot.com",
  messagingSenderId: "<670534738318>",
  appId: "<1:670534738318:web:5b4ec59b826e13b3a684df>"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Google Sign-in
const loginBtn = document.getElementById("google-login");
loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(()=> {
    window.location.href = "dashboard.html";
  }).catch(err => alert("Login failed: "+err.message));
};
