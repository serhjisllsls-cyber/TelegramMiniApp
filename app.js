let currentUser = null;

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
        reader.onload = function(e) {
            const avatarUrl = e.target.result;
            saveAndShowUser(nickname, password, avatarUrl);
        };
        reader.readAsDataURL(file);
    } else {
        saveAndShowUser(nickname, password, "https://via.placeholder.com/150");
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
    if (avatarImg && user.avatarUrl) {
        avatarImg.src = user.avatarUrl;
    }
}

// Автологин, если пользователь уже есть
window.onload = () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
        showMainScreen(savedUser);
    }
};
