import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUxyJ1SP5BojDMBkRBgKXFtkE8zSxHcJY",
  authDomain: "together-313cc.firebaseapp.com",
  projectId: "together-313cc",
  appId: "1:547247117130:web:acb59e4e760a71bf4167b3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSIjNDc1NTY2Ii8+PHRleHQgeD0iMTAwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNzAiIGZpbGw9IiM5Y2EzYWYiPjwvdGV4dD48L3N2Zz4=";

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerBtn').addEventListener('click', registerUser);
    document.getElementById('loginBtn').addEventListener('click', loginUser);
    document.getElementById('searchBtn').addEventListener('click', searchUser);
});

async function registerUser() {
    const nickname = document.getElementById('nickname').value.trim();
    const password = document.getElementById('password').value;
    const file = document.getElementById('avatarInput').files[0];

    if (!nickname || password.length < 6) {
        alert("Никнейм обязателен, пароль минимум 6 символов");
        return;
    }

    const email = `${nickname.toLowerCase().replace(/[^a-z0-9]/g, '')}@temp.user`;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        
        let avatarUrl = DEFAULT_AVATAR;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarUrl = e.target.result;
                saveUser(nickname, password, avatarUrl);
            };
            reader.readAsDataURL(file);
            return;
        }
        saveUser(nickname, password, avatarUrl);
    } catch (err) {
        alert("Ошибка регистрации: " + err.message);
    }
}

async function loginUser() {
    const nickname = document.getElementById('nickname').value.trim();
    const password = document.getElementById('password').value;

    if (!nickname || !password) return alert("Заполни поля");

    const email = `${nickname.toLowerCase().replace(/[^a-z0-9]/g, '')}@temp.user`;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        const savedUser = JSON.parse(localStorage.getItem('user')) || {};
        saveUser(nickname, password, savedUser.avatarUrl || DEFAULT_AVATAR);
    } catch (err) {
        alert("Неверный никнейм или пароль");
    }
}

function saveUser(nickname, password, avatarUrl) {
    currentUser = { nickname, password, avatarUrl };
    localStorage.setItem('user', JSON.stringify(currentUser));
    showMainScreen();
}

function showMainScreen() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');

    document.getElementById('greeting').textContent = `Привет, ${currentUser.nickname}!`;
    document.getElementById('userNick').innerHTML = `<div class="font-bold">${currentUser.nickname}</div>`;
    document.getElementById('userAvatar').src = currentUser.avatarUrl;
}

// Поиск и чат
async function searchUser() {
    const targetNick = document.getElementById('searchUser').value.trim();
    if (!targetNick || !currentUser) return alert("Введите никнейм");

    const chatId = [currentUser.nickname, targetNick].sort().join('_');

    document.getElementById('chatHeader').innerHTML = `
        Чат с <span class="text-indigo-400">${targetNick}</span>
    `;
    document.getElementById('chatScreen').classList.remove('hidden');

    loadChat(chatId, targetNick);
}

function loadChat(chatId, otherUser) {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    onSnapshot(q, (snapshot) => {
        const container = document.getElementById('chatMessages');
        container.innerHTML = '';
        snapshot.forEach((doc) => {
            const m = doc.data();
            const isMe = m.sender === currentUser.nickname;
            const div = document.createElement('div');
            div.className = `flex ${isMe ? 'justify-end' : 'justify-start'}`;
            div.innerHTML = `
                <div class="max-w-[80%]">
                    <span class="text-xs text-gray-500">${m.sender}</span>
                    <div class="px-4 py-3 rounded-2xl ${isMe ? 'bg-blue-600' : 'bg-gray-700'}">
                        ${m.text}
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
        container.scrollTop = container.scrollHeight;
    });

    document.getElementById('sendMsgBtn').onclick = () => {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        if (!text) return;

        addDoc(messagesRef, {
            sender: currentUser.nickname,
            text: text,
            timestamp: serverTimestamp()
        });
        input.value = '';
    };
}
