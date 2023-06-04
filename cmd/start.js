const path = require('path');

module.exports = {
  command: '/start',
  exudates: true,
  description: 'Начало',
  code: async (bot, message) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const currenc = await bot.db.get('currency', message.chat.id) ?? '🍑'
    await message.reply({
      text: langText.start_message.replace('{currenc}', currenc)
    });
  },
};