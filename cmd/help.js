const path = require('path');

module.exports = {
  command: '/help',
  description: 'Get a list of available commands',
  code: async(bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const currenc = await bot.db.get('currency', message.chat.id) ?? '🍑'
    await message.reply(langText.help_text.replaceAll('{currenc}', currenc), { parseMode: 'HTML'
    })
  },
};