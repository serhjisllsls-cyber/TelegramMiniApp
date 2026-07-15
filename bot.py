from aiogram.types import (
    ReplyKeyboardMarkup,
    KeyboardButton,
    WebAppInfo
)

@dp.message(CommandStart())
async def start(message: Message):

    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="🚀 Открыть приложение",
                    web_app=WebAppInfo(
                        url="https://ВАШ-САЙТ"
                    )
                )
            ]
        ],
        resize_keyboard=True
    )

    await message.answer(
        "Нажмите кнопку ниже.",
        reply_markup=keyboard
    )