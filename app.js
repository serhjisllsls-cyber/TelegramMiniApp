import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUxyJ1SP5BojDMBkRBgKXFtkE8zSxHcJY",
  authDomain: "together-313cc.firebaseapp.com",
  projectId: "together-313cc",
  appId: "1:547247117130:web:acb59e4e760a71bf4167b3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentNickname = "";

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    registerBtn.addEventListener('click', registerUser);
    loginBtn.addEventListener('click', loginUser);
});

function registerUser() {
    const nickname = document.getElementById('nickname').value.trim();
    const password = document.getElementById('password').value;

    if (!nickname || password.length < 6) {
        alert("Никнейм и пароль от 6 символов");
        return;
    }

    const email = `${nickname.toLowerCase().replace(/[^a-z0-9]/g, '')}@temp.user`;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => successLogin(nickname))
        .catch(err => alert("Ошибка: " + err.message));
}

function loginUser() {
    const nickname = document.getElementById('nickname').value.trim();
    const password = document.getElementById('password').value;

    if (!nickname || !password) {
        alert("Заполни поля");
        return;
    }

    const email = `${nickname.toLowerCase().replace(/[^a-z0-9]/g, '')}@temp.user`;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => successLogin(nickname))
        .catch(err => alert("Неверный ник или пароль"));
}

function successLogin(nickname) {
    currentNickname = nickname;
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');
    
    document.getElementById('greeting').textContent = `Привет, ${nickname}!`;
    document.getElementById('userNick').innerHTML = `
        <div class="text-sm text-gray-400">Никнейм</div>
        <div class="font-bold text-lg">${nickname}</div>
    `;
}
