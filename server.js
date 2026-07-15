const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  pingTimeout: 60000
});

const HISTORY_FILE = 'chat-history.json';
let messages = [];
let activeUsers = new Map();
let lastSeen = new Map(); // имя → timestamp

const ALLOWED_NAMES = ['Сережа', 'Дана'];
const PASSWORD = 'sergeydana';

if (fs.existsSync(HISTORY_FILE)) {
  try { messages = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch (e) {}
}

function saveHistory() {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(messages, null, 2));
}

function updateLastSeen(name) {
  if (name) lastSeen.set(name, Date.now());
}

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

io.on('connection', (socket) => {
  socket.on('join', ({ name, password }) => {
    if (!ALLOWED_NAMES.includes(name)) {
      socket.emit('error', 'Это приватный чат только для Сережи и Даны');
      socket.disconnect(true);
      return;
    }
    if (password !== PASSWORD) {
      socket.emit('error', 'Неверный пароль');
      return;
    }
    const existing = Array.from(activeUsers.values()).find(u => u.name === name);
    if (existing) {
      socket.emit('error', `${name} уже в чате`);
      return;
    }

    activeUsers.set(socket.id, { name, role: name });
    updateLastSeen(name);
    socket.join('private-room');

    socket.emit('history', messages);

    const userList = Array.from(activeUsers.values()).map(u => u.name);
    io.to('private-room').emit('user-joined', { 
      users: userList,
      lastSeen: Object.fromEntries(lastSeen)
    });
  });

  socket.on('chat message', (data) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    updateLastSeen(user.name);

    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    let messageData;

    if (typeof data === 'string') {
      messageData = {
        id: Date.now(),
        name: user.name,
        type: 'text',
        message: data.trim(),
        time,
        read: false
      };
    } else if (data && data.type === 'image') {
      messageData = {
        id: Date.now(),
        name: user.name,
        type: 'image',
        data: data.data,
        time
      };
    } else return;

    messages.push(messageData);
    if (messages.length > 500) messages.shift();
    saveHistory();

    io.to('private-room').emit('chat message', messageData);
  });

  socket.on('typing', (name) => {
    socket.to('private-room').emit('typing', name);
  });

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      updateLastSeen(user.name);
      activeUsers.delete(socket.id);
      io.to('private-room').emit('user-left', user.name);
    }
  });
});

server.listen(3000, () => console.log('✅ Чат Сережи и Даны запущен: http://localhost:3000'));
