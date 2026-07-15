import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
    getAuth, 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUxyJ1SP5BojDMBkRBgKXFtkE8zSxHcJY",
  authDomain: "together-313cc.firebaseapp.com",
  projectId: "together-313cc",
  appId: "1:547247117130:web:acb59e4e760a71bf4167b3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Важно! Устанавливаем язык (для Украины)
auth.languageCode = 'uk';   // или 'ru'

let confirmationResult = null;
let currentUserNickname = "";

// === Регистрация ===
document.getElementById('sendCodeBtn').addEventListener('click', () => {
    const nickname = document.getElementById('nickname').value.trim();
    let phone = document.getElementById('phone').value.trim();

    if (!nickname || !phone) {
        alert("Заполни никнейм и номер телефона");
        return;
    }

    // Добавляем +380 если не ввели
    if (!phone.startsWith('+')) phone = '+' + phone;

    currentUserNickname = nickname;

    // reCAPTCHA
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sendCodeBtn', {
        'size': 'invisible',
        'callback': () => {}
    });

    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
        .then((result) => {
            confirmationResult = result;
            document.getElementById('registerScreen').classList.add('hidden');
            document.getElementById('codeScreen').classList.remove('hidden');
        })
        .catch((error) => {
            console.error(error);
            alert("Не удалось отправить SMS: " + error.message);
        });
});

// Подтверждение кода
document.getElementById('verifyCodeBtn').addEventListener('click', () => {
    const code = document.getElementById('verificationCode').value;
    
    confirmationResult.confirm(code)
        .then(() => {
            document.getElementById('codeScreen').classList.add('hidden');
            document.getElementById('mainScreen').classList.remove('hidden');
            
            document.getElementById('greeting').textContent = `Привет, ${currentUserNickname}!`;
            document.getElementById('userNick').innerHTML = `
                <div class="text-sm text-gray-400">Твой ник</div>
                <div class="font-semibold">${currentUserNickname}</div>
            `;
        })
        .catch(() => alert("Неверный код"));
});
