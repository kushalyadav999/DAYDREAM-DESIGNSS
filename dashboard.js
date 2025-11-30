// Note: app.js already initialized firebase and auth
const photoInput = document.getElementById("photo-input");
const uploadBtn = document.getElementById("upload-btn");
const logoutBtn = document.getElementById("logout");
const canvas = document.getElementById("preview-canvas");
const ctx = canvas.getContext("2d");
const productsCard = document.getElementById("products-card");
const productList = document.getElementById("product-list");

// QR popup elements
const qrPopup = document.getElementById("qr-popup");
const closeQr = document.getElementById("close-qr");
const copyUpiBtn = document.getElementById("copy-upi");
const screenshotInput = document.getElementById("payment-screenshot");
const confirmPaidBtn = document.getElementById("confirm-paid");
const cancelPayBtn = document.getElementById("cancel-pay");

const UPI_ID = "9818408424@fam"; // your UPI id (already set)
const STORAGE_PREFIX = "daydream_"; // key prefix

let uploadedImage = null;
let freeCount = 0;
let paidUnlimited = false;
let pendingPaymentType = null; // "single" or "unlimited"

// storage keys depend on user-id if logged in
function storageKey(key) {
  const user = (firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : "anon";
  return `${STORAGE_PREFIX}${user}_${key}`;
}

// load usage
if(localStorage.getItem(storageKey("freeCount"))) freeCount = parseInt(localStorage.getItem(storageKey("freeCount")));
if(localStorage.getItem(storageKey("paidUnlimited"))) paidUnlimited = localStorage.getItem(storageKey("paidUnlimited")) === "true";

auth.onAuthStateChanged(user => {
  if(!user) window.location.href = "index.html";
  else {
    // reload per-user stored values (in case user signed in)
    if(localStorage.getItem(storageKey("freeCount"))) freeCount = parseInt(localStorage.getItem(storageKey("freeCount")));
    if(localStorage.getItem(storageKey("paidUnlimited"))) paidUnlimited = localStorage.getItem(storageKey("paidUnlimited")) === "true";
  }
});

// logout
logoutBtn.onclick = () => auth.signOut();

// image input handling
photoInput.onchange = (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      uploadedImage = img;
      // resize canvas for consistent width
      canvas.width = 900;
      const scale = canvas.width / img.width;
      canvas.height = img.height * scale;
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      uploadBtn.disabled = false;
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
};

// generate button click
uploadBtn.onclick = () => {
  if(canGenerateImage()) {
    generateImageWrapper();
  } else {
    // show payment choice
    const takeUnlimited = confirm("You used your free image. OK = Unlimited ₹49, Cancel = Single image ₹5");
    if(takeUnlimited) openPaymentPopup("unlimited");
    else openPaymentPopup("single");
  }
};

function canGenerateImage() {
  return paidUnlimited || (freeCount < 1);
}

function afterGenerate() {
  if(!paidUnlimited) {
    freeCount++;
    localStorage.setItem(storageKey("freeCount"), freeCount);
  }
}

// Payment popup flow
function openPaymentPopup(type) {
  pendingPaymentType = type; // 'single' or 'unlimited'
  qrPopup.style.display = "flex";
  screenshotInput.value = "";
}
closeQr.onclick = () => { qrPopup.style.display = "none"; pendingPaymentType = null; };
cancelPayBtn.onclick = () => { qrPopup.style.display = "none"; pendingPaymentType = null; };

// copy upi
copyUpiBtn.onclick = () => {
  navigator.clipboard?.writeText(UPI_ID).then(()=> alert("UPI ID copied"));
};

// verify uploaded screenshot — here we simulate verification by accepting any uploaded image.
// In real world you might verify transaction id / amount.
confirmPaidBtn.onclick = () => {
  const files = screenshotInput.files;
  if(!files || files.length === 0) return alert("Please upload the payment screenshot from your phone.");
  const file = files[0];
  const reader = new FileReader();
  reader.onload = (ev) => {
    // store screenshot data URL in localStorage for admin review or future reference
    const dataUrl = ev.target.result;
    const historyKey = storageKey("payments");
    let history = [];
    try { history = JSON.parse(localStorage.getItem(historyKey) || "[]"); } catch(e) {}
    history.push({
      time: new Date().toISOString(),
      type: pendingPaymentType,
      screenshot: dataUrl
    });
    localStorage.setItem(historyKey, JSON.stringify(history));

    // mark paid locally
    if(pendingPaymentType === "unlimited") {
      paidUnlimited = true;
      localStorage.setItem(storageKey("paidUnlimited"), "true");
      alert("Unlimited activated. You can now generate unlimited images.");
      qrPopup.style.display = "none";
      pendingPaymentType = null;
    } else {
      // single paid: allow one generation (we increment freeCount and then generate)
      freeCount++;
      localStorage.setItem(storageKey("freeCount"), freeCount);
      alert("Payment recorded. Generating one image now.");
      qrPopup.style.display = "none";
      pendingPaymentType = null;
      generateImageWrapper();
    }
  };
  reader.readAsDataURL(file);
};

// Image generation (simulated AI + animation)
function generateImageWrapper() {
  simulateAI();
  afterGenerate();
}

// simulate overlay + product suggestions
function simulateAI(){
  canvas.style.transition = "all 0.5s ease";
  // start with transparent overlay then fade in
  ctx.fillStyle = "rgba(108,92,231,0.0)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  setTimeout(()=>{
    ctx.fillStyle = "rgba(108,92,231,0.22)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  },120);

  const spots = [
    {title:"Modern Painting", query:"wall painting abstract", x:200,y:100,w:200,h:120},
    {title:"Accent Sofa", query:"accent sofa", x:100,y:350,w:300,h:160}
  ];

  spots.forEach(h=>{
    ctx.strokeStyle="#fff";
    ctx.lineWidth=3;
    ctx.strokeRect(h.x,h.y,h.w,h.h);
  });

  productsCard.style.display = "block";
  productList.innerHTML = "";

  spots.forEach((h,index)=>{
    const div = document.createElement("div");
    div.className = "prod";
    div.style.setProperty('--i', index);
    div.innerHTML = `<strong>${h.title}</strong><br>
      <a href="https://www.amazon.in/s?k=${encodeURIComponent(h.query)}" target="_blank">Amazon</a> |
      <a href="https://www.flipkart.com/search?q=${encodeURIComponent(h.query)}" target="_blank">Flipkart</a>`;
    productList.appendChild(div);
  });
}

