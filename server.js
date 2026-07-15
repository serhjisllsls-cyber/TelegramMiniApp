<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="manifest" href="manifest.json">
  <title>Чат • Сережа и Дана</title>
  <style>
    body { margin:0; font-family:-apple-system,BlinkMacSystemFont,sans-serif; background:#000; color:#fff; height:100vh; display:flex; flex-direction:column; overflow:hidden; }
    #entry { flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:20px; background:#000; text-align:center; }
    #entry h1 { font-size:32px; margin-bottom:8px; }
    #entry p { color:#888; margin-bottom:40px; }
    .role-btn { width:100%; max-width:300px; padding:18px; margin:8px 0; font-size:20px; border:none; border-radius:16px; font-weight:600; cursor:pointer; }
    .role-btn.serezha { background:#0a84ff; color:white; }
    .role-btn.dana { background:#34c759; color:black; }
    #password-screen { display:none; width:100%; max-width:300px; margin-top:20px; }
    input[type="password"] { width:100%; padding:14px; border-radius:12px; border:1px solid #444; background:#1c1c1e; color:white; font-size:17px; margin-bottom:12px; }
    header { background:rgba(28,28,30,.95); padding:10px 16px; border-bottom:1px solid #333; display:flex; align-items:center; gap:12px; }
    #other-avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; color:white; flex-shrink:0; }
    #other-name { font-weight:600; font-size:18px; line-height:1; }
    #other-status { font-size:13px; margin-top:2px; }
    #status { padding:6px 16px; font-size:13px; background:#1c1c1e; text-align:center; }
    #typing { padding:4px 16px; font-size:13px; color:#aaa; min-height:22px; }
    #messages { flex:1; overflow-y:auto; padding:16px 12px 100px; display:flex; flex-direction:column; gap:14px; }
    .message { display:flex; max-width:78%; }
    .message.me { align-self:flex-end; flex-direction:row-reverse; }
    .avatar { width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; margin:0 8px; flex-shrink:0; }
    .bubble { padding:12px 16px; border-radius:20px; font-size:17px; line-height:1.35; max-width:100%; }
    .message.other .bubble { background:#2c2c2e; border-bottom-left-radius:6px; }
    .message.me .bubble { background:#0a84ff; color:white; border-bottom-right-radius:6px; }
    .bubble img { max-width:220px; border-radius:12px; display:block; }
    .name { font-size:12px; opacity:.7; margin-bottom:3px; }
    .time { font-size:11px; opacity:.6; margin-top:5px; text-align:right; }
    .read-status { font-size:11px; color:#34c759; margin-top:2px; text-align:right; }
    #form { position:fixed; bottom:0; left:0; right:0; background:rgba(28,28,30,.95); padding:10px 12px; display:flex; gap:8px; border-top:1px solid #333; align-items:center; }
    #input { flex:1; padding:14px 20px; border-radius:9999px; border:1px solid #444; background:#1c1c1e; color:white; font-size:17px; }
    .btn { width:44px; height:44px; background:#0a84ff; color:white; border:none; border-radius:50%; font-size:22px; display:flex; align-items:center; justify-content:center; }
    .btn.photo { background:#333; font-size:24px; }
  </style>
</head>
<body>
  <!-- Экран входа -->
  <div id="entry">
    <h1>Сережа и Дана</h1>
    <p>Приватный чат</p>
    <button class="role-btn serezha" onclick="selectRole('Сережа')">Я Сережа</button>
    <button class="role-btn dana" onclick="selectRole('Дана')">Я Дана</button>

    <div id="password-screen">
      <input type="password" id="pass-input" placeholder="Пароль">
      <button onclick="tryJoin()" style="width:100%; background:#0a84ff; color:white; padding:14px; border-radius:12px; font-size:17px;">Войти в чат</button>
    </div>
  </div>

  <!-- Чат -->
  <div id="chat" style="display:none; flex-direction:column; height:100vh;">
    <header>
      <div id="other-person" style="display:flex; align-items:center; gap:12px; flex:1;">
        <div id="other-avatar"></div>
        <div>
          <div id="other-name"></div>
          <div id="other-status"></div>
        </div>
      </div>
    </header>

    <div id="status">Подключение...</div>
    <div id="typing"></div>
    <div id="messages"></div>

    <form id="form">
      <input type="file" id="photo-input" accept="image/*" style="display:none">
      <button type="button" class="btn photo" onclick="document.getElementById('photo-input').click()">+</button>
      <input id="input" placeholder="Сообщение" autocomplete="off">
      <button type="submit" class="btn">↑</button>
    </form>
  </div>

  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
  <script>
    const socket = io('http://localhost:3000', { reconnection: true });
    let myName = '';
    let isJoined = false;
    let typingTimeout = null;

    const entry = document.getElementById('entry');
    const chat = document.getElementById('chat');
    const messagesDiv = document.getElementById('messages');
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const statusEl = document.getElementById('status');
    const typingEl = document.getElementById('typing');
    const photoInput = document.getElementById('photo-input');

    function selectRole(name) {
      myName = name;
      document.getElementById('password-screen').style.display = 'block';
      document.querySelectorAll('.role-btn').forEach(b => b.style.display = 'none');
    }

    function tryJoin() {
      const pass = document.getElementById('pass-input').value.trim();
      if (!pass) return alert('Введите пароль');
      socket.emit('join', { name: myName, password: pass });
    }

    function updateOtherPersonHeader(data = {}) {
      if (!myName) return;

      const otherName = myName === 'Сережа' ? 'Дана' : 'Сережа';
      const isOnline = data.users ? data.users.includes(otherName) : false;
      const lastSeenTime = data.lastSeen && data.lastSeen[otherName];

      const avatar = document.getElementById('other-avatar');
      avatar.textContent = otherName[0];
      avatar.style.cssText = `width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:white;background:${otherName === 'Сережа' ? '#0a84ff' : '#34c759'}`;

      document.getElementById('other-name').textContent = otherName;

      const statusEl = document.getElementById('other-status');
      
      if (isOnline) {
        statusEl.textContent = 'в сети';
        statusEl.style.color = '#34c759';
      } else if (lastSeenTime) {
        const date = new Date(lastSeenTime);
        const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        statusEl.textContent = `был(а) в сети в ${timeStr}`;
        statusEl.style.color = '#888';
      } else {
        statusEl.textContent = 'не в сети';
        statusEl.style.color = '#888';
      }
    }

    function addMessage(data) {
      const isMe = data.name === myName;
      const div = document.createElement('div');
      div.className = `message ${isMe ? 'me' : 'other'}`;

      const initial = data.name[0];
      const color = data.name === 'Сережа' ? '#0a84ff' : '#34c759';

      let content = data.type === 'image' 
        ? `<img src="${data.data}" style="max-width:220px;border-radius:12px;">` 
        : data.message;

      div.innerHTML = `
        ${!isMe ? `<div class="avatar" style="background:${color}">${initial}</div>` : ''}
        <div style="max-width:100%">
          ${!isMe ? `<div class="name">${data.name}</div>` : ''}
          <div class="bubble">${content}</div>
          <div class="time">${data.time}</div>
          ${isMe && data.read ? `<div class="read-status">Прочитано</div>` : ''}
        </div>
        ${isMe ? `<div class="avatar" style="background:${color}">${initial}</div>` : ''}
      `;
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // === Socket события ===
    socket.on('connect', () => updateStatus('Подключено'));

    socket.on('history', (history) => {
      messagesDiv.innerHTML = '';
      history.forEach(addMessage);
      isJoined = true;
      updateOtherPersonHeader({});
    });

    socket.on('chat message', (data) => {
      addMessage(data);
      typingEl.textContent = '';

      if (data.name !== myName) {
        const lastMe = [...messagesDiv.querySelectorAll('.message.me')].pop();
        if (lastMe) {
          const read = lastMe.querySelector('.read-status');
          if (read) read.textContent = 'Прочитано';
        }
      }
    });

    socket.on('user-joined', (data) => {
      isJoined = true;
      entry.style.display = 'none';
      chat.style.display = 'flex';
      updateOtherPersonHeader(data);
      updateStatus(`В чате: ${data.users.join(' и ')}`);
    });

    socket.on('user-left', (name) => {
      updateStatus(`${name} вышел`);
      updateOtherPersonHeader({ users: [] });
    });

    socket.on('typing', (name) => {
      if (name !== myName) {
        typingEl.textContent = `${name} печатает...`;
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => typingEl.textContent = '', 2200);
      }
    });

    socket.on('error', (msg) => {
      alert(msg);
      location.reload();
    });

    // Отправка текста
    form.addEventListener('submit', e => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val || !socket.connected) return;
      socket.emit('chat message', val);
      input.value = '';
    });

    // Отправка фото
    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (!file || !socket.connected) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        socket.emit('chat message', { type: 'image', data: e.target.result });
      };
      reader.readAsDataURL(file);
      photoInput.value = '';
    });

    input.addEventListener('input', () => {
      if (isJoined) socket.emit('typing', myName);
    });

    function updateStatus(text) {
      statusEl.textContent = text;
    }
  </script>
</body>
</html>
