const authData = JSON.parse(localStorage.getItem('user')) || {};

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

    let avatarUrl = "https://via.placeholder.com/150";

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarUrl = e.target.result;
            saveUser(nickname, password, avatarUrl);
        };
        reader.readAsDataURL(file);
    } else {
        saveUser(nickname, password, avatarUrl);
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

function saveUser(nickname, password, avatarUrl) {
    const user = { nickname, password, avatarUrl };
    localStorage.setItem('user', JSON.stringify(user));
    showMainScreen(user);
}

function showMainScreen(user) {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');
    
    document.getElementById('greeting').textContent = `Привет, ${user.nickname}!`;
    document.getElementById('userNick').innerHTML = `
        <div class="text-sm text-gray-400">Ник</div>
        <div class="font-bold">${user.nickname}</div>
    `;
    document.getElementById('userAvatar').src = user.avatarUrl;
}
