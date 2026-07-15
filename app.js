import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUxyJ1SP5BojDMBkRBgKXFtkE8zSxHcJY",
  authDomain: "together-313cc.firebaseapp.com",
  projectId: "together-313cc",
  appId: "1:547247117130:web:acb59e4e760a71bf4167b3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentNickname = "";

// Старт
document.getElementById('startBtn').addEventListener('click', () => {
    const nickname = document.getElementById('nickname').value.trim();
    
    if (!nickname) {
        alert("Введи никнейм");
        return;
    }

    currentNickname = nickname;

    signInAnonymously(auth)
        .then(() => {
            document.getElementById('registerScreen').classList.add('hidden');
            document.getElementById('mainScreen').classList.remove('hidden');
            
            document.getElementById('greeting').textContent = `Привет, ${nickname}!`;
            document.getElementById('userNick').innerHTML = `
                <div class="text-sm text-gray-400">Твой ник</div>
                <div class="font-bold">${nickname}</div>
            `;
        })
        .catch((error) => {
            console.error(error);
            alert("Что-то пошло не так");
        });
});
