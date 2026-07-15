import asyncio

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import (
    Message,
    ReplyKeyboardMarkup,
    KeyboardButton,
    WebAppInfo
)

TOKEN = "8885441032:AAHGm_Au7A1oYyA6BiFkaHUlcvs6PXr6eqg"

bot = Bot(token=TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: Message):

    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="🚀 Открыть приложение",
                    web_app=WebAppInfo(
                        url="https://telegram-mini-app-phi-sandy.vercel.app/"
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


async def main():
    print("Bot started...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())