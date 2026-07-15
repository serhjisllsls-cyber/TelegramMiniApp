import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
    getAuth, 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUxyJ1SP5BojDMBkRBgKXFtkE8zSxHcJY",
  authDomain: "together-313cc.firebaseapp.com",
  projectId: "together-313cc",
  appId: "1:547247117130:web:acb59e4e760a71bf4167b3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let confirmationResult = null;
let currentUserNickname = "";

// Экраны
const registerScreen = document.getElementById('registerScreen');
const codeScreen = document.getElementById('codeScreen');
const mainScreen = document.getElementById('mainScreen');

// Отправка кода
document.getElementById('sendCodeBtn').addEventListener('click', () => {
    const nickname = document.getElementById('nickname').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!nickname || !phone) {
        alert("Введи никнейм и номер телефона");
        return;
    }

    currentUserNickname = nickname;

    // Здесь можно добавить reCAPTCHA (обязательно для Phone Auth)
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sendCodeBtn', {
        'size': 'invisible'
    });

    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
        .then((result) => {
            confirmationResult = result;
            registerScreen.classList.add('hidden');
            codeScreen.classList.remove('hidden');
        })
        .catch((error) => {
            console.error(error);
            alert("Ошибка: " + error.message);
        });
});

// Подтверждение кода
document.getElementById('verifyCodeBtn').addEventListener('click', () => {
    const code = document.getElementById('verificationCode').value.trim();
    
    confirmationResult.confirm(code)
        .then((result) => {
            codeScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            
            document.getElementById('greeting').textContent = `Привет, ${currentUserNickname}!`;
            document.getElementById('userNick').innerHTML = `
                <div class="text-sm text-gray-400">Твой ник</div>
                <div class="font-semibold">${currentUserNickname}</div>
            `;
        })
        .catch((error) => {
            alert("Неверный код");
        });
});
