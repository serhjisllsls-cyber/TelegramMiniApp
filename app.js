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

// Ждём загрузки страницы
document.addEventListener('DOMContentLoaded', () => {

    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    // Регистрация
    registerBtn.addEventListener('click', () => {
        const nickname = document.getElementById('nickname').value.trim();
        const password = document.getElementById('password').value;

        if (!nickname || password.length < 6) {
            alert("Никнейм обязателен, пароль минимум 6 символов");
            return;
        }

        const email = `${nickname.toLowerCase().replace(/\s+/g, '')}@temp.user`;

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                currentNickname = nickname;
                showMainScreen();
            })
            .catch((error) => alert("Ошибка регистрации: " + error.message));
    });

    // Вход
    loginBtn.addEventListener('click', () => {
        const nickname = document.getElementById('nickname').value.trim();
        const password = document.getElementById('password').value;

        if (!nickname || !password) {
            alert("Заполни никнейм и пароль");
            return;
        }

        const email = `${nickname.toLowerCase().replace(/\s+/g, '')}@temp.user`;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                currentNickname = nickname;
                showMainScreen();
            })
            .catch((error) => alert("Неверный никнейм или пароль"));
    });
});

function showMainScreen() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');
    
    document.getElementById('greeting').textContent = `Привет, ${currentNickname}!`;
    document.getElementById('userNick').innerHTML = `
        <div class="text-sm text-gray-400">Ник</div>
        <div class="font-semibold">${currentNickname}</div>
    `;
}
