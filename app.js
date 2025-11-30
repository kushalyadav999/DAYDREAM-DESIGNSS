// ====== Firebase config (REPLACE these with your own Firebase project values) ======
const firebaseConfig = {
  apiKey: "<REPLACE_API_KEY>",
  authDomain: "<REPLACE_PROJECT>.firebaseapp.com",
  projectId: "<REPLACE_PROJECT>",
  storageBucket: "<REPLACE_PROJECT>.appspot.com",
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
