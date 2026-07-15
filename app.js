const tg = window.Telegram.WebApp;
tg.expand();

// Укажите дату знакомства
// ГОД, МЕСЯЦ (0-11), ДЕНЬ
const startDate = new Date(2024, 0, 1);

function updateDays(){

    const now = new Date();

    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    document.getElementById("days").textContent = days;
}

updateDays();

// Обновляем раз в минуту
setInterval(updateDays, 60000);