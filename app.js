let currentUser = null;

// Надёжный дефолтный аватар (base64)
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iMTAwIiB5PSIxMTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiM5Y2EzYWYiPjx0c3Bhbj7wn5E8L3RzcGFuPjwvdGV4dD48L3N2Zz4=";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerBtn').addEventListener('click', registerUser);
    document.getElementById('loginBtn').addEventListener('click', loginUser);
});

function registerUser() {
    const nickname = document.getElementById('nickname').value.trim();
    const password = document.getElementById('password').value;
    const file = document.getElementById('avatarInput').files[0];

    if (!nickname || password.length < 6) {
        alert("Никнейм обязателен, пароль минимум 6 символов");
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            saveAndShowUser(nickname, password, e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        saveAndShowUser(nickname, password, DEFAULT_AVATAR);
    }
}

function loginUser() {
    const nickname = document.getElementById('nickname').value.trim();
    const password = document.getElementById('password').value;

    if (!nickname || !password) {
        alert("Заполни никнейм и пароль");
        return;
    }

    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser && savedUser.nickname === nickname && savedUser.password === password) {
        showMainScreen(savedUser);
    } else {
        alert("Неверный никнейм или пароль");
    }
}

function saveAndShowUser(nickname, password, avatarUrl) {
    currentUser = { nickname, password, avatarUrl };
    localStorage.setItem('user', JSON.stringify(currentUser));
    showMainScreen(currentUser);
}

function showMainScreen(user) {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');
    
    document.getElementById('greeting').textContent = `Привет, ${user.nickname}!`;
    
    document.getElementById('userNick').innerHTML = `
        <div class="text-sm text-gray-400">Ник</div>
        <div class="font-bold">${user.nickname}</div>
    `;

    const avatarImg = document.getElementById('userAvatar');
    if (avatarImg) {
        avatarImg.src = user.avatarUrl || DEFAULT_AVATAR;
    }
}

// Автологин
window.onload = () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
        showMainScreen(savedUser);
    }
};
