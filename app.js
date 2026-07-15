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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let currentRoom = null;
let currentUser = null;
let player = null;

// DOM элементы
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

// Вход
document.getElementById('loginBtn').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            currentUser = result.user;
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            if (userInfo) userInfo.textContent = currentUser.displayName || currentUser.email;
        })
        .catch((error) => {
            console.error(error);
            alert("Ошибка входа: " + error.message);
        });
});

// Выход
document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth).then(() => location.reload()));

// Присоединиться к комнате
joinRoomBtn.addEventListener('click', () => {
    currentRoom = roomInput.value.trim() || 'room-' + Date.now().toString(36).slice(0,8);
    document.getElementById('fileSelector').classList.remove('hidden');
    loadRoom();
});

// Выбор видео (исправлено)
pickFileBtn.addEventListener('click', () => {
    const url = prompt("Вставьте ссылку на видео с Google Drive:\n(Сделайте файл доступным 'Всем в интернете')");
    if (!url) return;

    let directUrl = url;
    const match = url.match(/[-\w]{25,}/);
    if (match) {
        directUrl = `https://drive.google.com/uc?id=${match[0]}&export=download`;
    }

    playerEl.src = directUrl;
    playerEl.load();
    selectedFileEl.textContent = "✅ Видео загружено";

    if (currentRoom) {
        updateDoc(doc(db, 'rooms', currentRoom), { 
            videoUrl: directUrl 
        }).catch(() => {});
    }
});

// Синхронизация плеера
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

    player.addEventListener('play', () => updateDoc(roomRef, { playing: true, currentTime: player.currentTime }).catch(()=>{}));
    player.addEventListener('pause', () => updateDoc(roomRef, { playing: false, currentTime: player.currentTime }).catch(()=>{}));
    player.addEventListener('seeked', () => updateDoc(roomRef, { currentTime: player.currentTime }).catch(()=>{}));
}

// Чат
function setupChat() {
    const messagesRef = collection(db, 'rooms', currentRoom, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    onSnapshot(q, (snapshot) => {
        chatMessages.innerHTML = '';
        snapshot.forEach(docSnap => {
            const m = docSnap.data();
            const div = document.createElement('div');
            div.className = "flex gap-2";
            div.innerHTML = `<span class="text-blue-400">${m.user}:</span> ${m.text}`;
            chatMessages.appendChild(div);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    sendChatBtn.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text) {
            addDoc(messagesRef, {
                user: currentUser ? currentUser.displayName : "Гость",
                text: text,
                timestamp: serverTimestamp()
            });
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendChatBtn.click();
    });
}

function loadRoom() {
    setupPlayerSync();
    setupChat();
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loginScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        if (userInfo) userInfo.textContent = user.displayName || user.email;
    }
});

console.log("🚀 Приложение загружено");
