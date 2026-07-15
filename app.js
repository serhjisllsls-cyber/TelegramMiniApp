<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Смотрим вместе</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body { background: #111827; color: white; }
        #player { width: 100%; max-height: 70vh; background: black; }
        .chat-msg { margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="max-w-5xl mx-auto p-4">
        <!-- Login Screen -->
        <div id="loginScreen" class="flex flex-col items-center justify-center min-h-screen">
            <h1 class="text-4xl font-bold mb-8 text-center">Смотрим вместе 🎥</h1>
            <button id="loginBtn" 
                    class="bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-2xl text-xl font-medium">
                Войти через Google
            </button>
        </div>

        <!-- Main App -->
        <div id="mainApp" class="hidden">
            <div class="flex justify-between mb-6">
                <h1 class="text-3xl font-bold">Смотрим вместе</h1>
                <button id="logoutBtn" class="text-red-500">Выйти</button>
            </div>

            <div class="bg-black rounded-3xl overflow-hidden mb-6">
                <video id="player" controls></video>
            </div>

            <div class="bg-gray-800 rounded-3xl p-6 mb-6">
                <input id="roomInput" placeholder="ID комнаты" 
                       class="w-full bg-gray-700 p-4 rounded-2xl mb-4 text-lg">
                <button id="joinRoomBtn" 
                        class="w-full bg-green-600 py-4 rounded-2xl text-lg font-medium">
                    Присоединиться к комнате
                </button>
            </div>

            <div id="fileSelector" class="hidden bg-gray-800 rounded-3xl p-6 mb-6">
                <button id="pickFileBtn" class="w-full bg-indigo-600 py-4 rounded-2xl">
                    Выбрать видео из Google Drive
                </button>
                <div id="selectedFile" class="mt-4 text-center text-sm"></div>
            </div>

            <!-- Chat -->
            <div class="bg-gray-800 rounded-3xl p-6">
                <h3 class="font-bold mb-4">💬 Чат</h3>
                <div id="chatMessages" class="h-80 overflow-y-auto mb-4 space-y-3"></div>
                <div class="flex">
                    <input id="chatInput" placeholder="Сообщение..." 
                           class="flex-1 bg-gray-700 p-4 rounded-l-2xl">
                    <button id="sendChatBtn" class="bg-blue-600 px-8 rounded-r-2xl">→</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Загружаем как module -->
    <script type="module" src="app.js"></script>
</body>
</html>
