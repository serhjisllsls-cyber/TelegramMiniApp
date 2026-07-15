const tg = window.Telegram.WebApp;

tg.expand();

let user = tg.initDataUnsafe.user;

if(user){
    document.getElementById("user").innerHTML =
    "Привет, " + user.first_name;
}

document.getElementById("btn").onclick = function(){

    tg.showAlert("Кнопка работает!");

}