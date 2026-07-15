// ===================================
// Telegram Mini App
// ===================================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ===================================
// ДАТА ЗНАКОМСТВА
// ===================================
//
// Формат:
// ГОД, МЕСЯЦ (0-11), ДЕНЬ
//
// Пример:
// 15 июля 2025 года
//
// new Date(2025, 6, 15)
//

const startDate = new Date(
    2025,
    6,
    15
);


// ===================================
// ЭЛЕМЕНТЫ
// ===================================

const daysElement = document.getElementById("days");

const menuButton = document.getElementById("menuButton");

const sidebar = document.getElementById("sidebar");

const overlay = document.getElementById("overlay");


// ===================================
// ПОДСЧЕТ ДНЕЙ
// ===================================

function updateDays(){

    const now = new Date();

    const diff = now - startDate;

    const days = Math.floor(diff / 86400000);

    daysElement.style.transform = "scale(1.04)";

    daysElement.textContent = days;

    setTimeout(() => {

        daysElement.style.transform = "scale(1)";

    },150);

}

updateDays();

setInterval(updateDays,60000);


// ===================================
// ОТКРЫТЬ МЕНЮ
// ===================================

menuButton.addEventListener("click",()=>{

    sidebar.classList.add("open");

    overlay.classList.add("show");

});


// ===================================
// ЗАКРЫТЬ МЕНЮ
// ===================================

overlay.addEventListener("click",()=>{

    sidebar.classList.remove("open");

    overlay.classList.remove("show");

});


// ===================================
// ESC
// ===================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        sidebar.classList.remove("open");

        overlay.classList.remove("show");

    }

});


// ===================================
// БЛОКИ МЕНЮ
// ===================================

document.querySelectorAll(".menu-item").forEach(item=>{

    item.addEventListener("click",()=>{

        sidebar.classList.remove("open");

        overlay.classList.remove("show");

        tg.HapticFeedback.impactOccurred("light");

    });

});


// ===================================
// HAPTIC
// ===================================

menuButton.addEventListener("click",()=>{

    tg.HapticFeedback.impactOccurred("medium");

});


// ===================================
// ТЕМА TELEGRAM
// ===================================

document.body.style.background =
    tg.themeParams.bg_color || "#000";


// ===================================
// КОНЕЦ
// ===================================