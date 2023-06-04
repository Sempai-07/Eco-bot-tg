const path = require('path');
const { Button } = require('telegramsjs');

module.exports = {
  command: '/click',
  description: 'Click and get coins',
  code: async (bot, message) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const currenc = await bot.db.get('currency', message.chat.id) ?? '🍑';
    
    const clickButtons = new Button()
      .setText(langText.click_button)
      .setAction('click');
    
    message.reply({
      text: langText.click_text,
      replyMarkup: JSON.stringify({
        inline_keyboard: [
        [clickButtons.toJSON()]
      ]
      })
    })
  },
};