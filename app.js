const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

// Год, месяц (0–11), день.
const startDate = new Date(2025, 6, 15);
const daysElement = document.getElementById("days");
const sinceDateElement = document.getElementById("sinceDate");
const menuButton = document.getElementById("menuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function updateDays() {
    const days = Math.max(0, Math.floor((Date.now() - startDate) / 86400000));
    daysElement.textContent = days;
    daysElement.animate(
        [{ transform: "scale(.96)", opacity: .7 }, { transform: "scale(1)", opacity: 1 }],
        { duration: 350, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
}

function setMenu(open) {
    sidebar.classList.toggle("open", open);
    overlay.classList.toggle("show", open);
    sidebar.setAttribute("aria-hidden", String(!open));
    overlay.setAttribute("aria-hidden", String(!open));
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
}

function haptic(style = "light") {
    tg?.HapticFeedback?.impactOccurred(style);
}

sinceDateElement.textContent = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric", month: "long", year: "numeric"
}).format(startDate);
sinceDateElement.dateTime = startDate.toISOString().slice(0, 10);

updateDays();
setInterval(updateDays, 60000);

menuButton.addEventListener("click", () => {
    const open = !sidebar.classList.contains("open");
    setMenu(open);
    haptic("medium");
});
closeMenuButton.addEventListener("click", () => { setMenu(false); haptic(); });
overlay.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
});
document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => { setMenu(false); haptic(); });
});

if (tg?.themeParams?.bg_color) {
    document.documentElement.style.setProperty("--page-bg", tg.themeParams.bg_color);
}
