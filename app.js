// ==================== FULL APP.JS ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import { 
    getFirestore, 
    doc, 
    onSnapshot, 
    updateDoc, 
    collection, 
    addDoc, 
    orderBy, 
    query, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUxyJ1SP5BojDMBkRBgKXFtkE8zSxHcJY",
  authDomain: "together-313cc.firebaseapp.com",
  databaseURL: "https://together-313cc-default-rtdb.firebaseio.com",
  projectId: "together-313cc",
  storageBucket: "together-313cc.firebasestorage.app",
  messagingSenderId: "547247117130",
  appId: "1:547247117130:web:acb59e4e760a71bf4167b3",
  measurementId: "G-RXJFNZ6Y26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let currentRoom = null;
let currentUser = null;
let player = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const playerEl = document.getElementById('player');
const roomInput = document.getElementById('roomInput');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const userInfo = document.getElementById('userInfo');
const pickFileBtn = document.getElementById('pickFileBtn');
const selectedFileEl = document.getElementById('selectedFile');

// Login
document.getElementById('loginBtn').addEventListener('click', () => {
    console.log("🔑 Попытка входа через Google...");
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("✅ Успешный вход!", result.user.email);
            currentUser = result.user;
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            userInfo.textContent = currentUser.displayName;
        })
        .catch((error) => {
            console.error("❌ Ошибка входа:", error.code, error.message);
            alert("Ошибка входа: " + error.message + "\n\nУбедись, что Google Auth включён в Firebase Console!");
        });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => location.reload());
});

// Join Room
joinRoomBtn.addEventListener('click', () => {
    currentRoom = roomInput.value.trim() || 'room-' + Math.random().toString(36).substr(2, 9);
    document.getElementById('fileSelector').classList.remove('hidden');
    loadRoom();
    console.log("Комната:", currentRoom);
});

// Player Sync
function setupPlayerSync() {
    player = playerEl;
    const roomRef = doc(db, 'rooms', currentRoom);

    onSnapshot(roomRef, (snapshot) => {
        const data = snapshot.data();
        if (!data) return;

        if (data.videoUrl && player.src !== data.videoUrl) {
            player.src = data.videoUrl;
            player.load();
        }

        if (data.playing !== undefined) {
            data.playing ? player.play() : player.pause();
            if (data.currentTime) player.currentTime = data.currentTime;
        }
    });

    // Send actions
    player.addEventListener('play', () => updateDoc(roomRef, { playing: true, currentTime: player.currentTime }));
    player.addEventListener('pause', () => updateDoc(roomRef, { playing: false, currentTime: player.currentTime }));
    player.addEventListener('seeked', () => updateDoc(roomRef, { currentTime: player.currentTime }));
}

// Chat
function setupChat() {
    const messagesRef = collection(db, 'rooms', currentRoom, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    onSnapshot(q, (snapshot) => {
        chatMessages.innerHTML = '';
        snapshot.forEach(doc => {
            const m = doc.data();
            const div = document.createElement('div');
            div.className = "flex gap-2";
            div.innerHTML = `<span class="text-blue-400">${m.user}:</span> ${m.text}`;
            chatMessages.appendChild(div);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    sendChatBtn.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text && currentUser) {
            addDoc(messagesRef, {
                user: currentUser.displayName,
                text: text,
                timestamp: serverTimestamp()
            });
            chatInput.value = '';
        }
    });

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendChatBtn.click();
    });
}

function loadRoom() {
    setupPlayerSync();
    setupChat();
}

// Auto login check
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loginScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        userInfo.textContent = user.displayName;
    }
});

console.log("🚀 Приложение загружено");
