const path = require('path');

module.exports = {
  command: '/botinfo',
  description: 'Information about the bot',
  code: async (bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    
    const botAuthor = 'Vladimir';
    const botContact = 'https://t.me/SempaiJS';
    const botVersion = '0.0.1';
    
    const botInfo = langText.botinfo_text
      .replace('{author}', botAuthor)
      .replace('{contact}', botContact)
      .replace('{version}', botVersion);
    
    await message.reply(botInfo);
  },
};