// ====== Firebase config (REPLACE these with your own Firebase project values) ======
const firebaseConfig = {
  apiKey: "<1AIzaSyBqcFZdP284oYPscP6HX1Cg-UWGbQ3vhQs>",
  authDomain: "<daydream-design>.firebaseapp.com",
  projectId: "<daydream-design>",
  storageBucket: "<daydream-design>.appspot.com",
  messagingSenderId: "<REPLACE_SENDER_ID>",
  appId: "<REPLACE_APP_ID>"
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
