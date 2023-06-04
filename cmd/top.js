const { Markup } = require('telegramsjs');
const path = require('path');

module.exports = {
  command: '/top',
  description: 'Leaderboard',
  code: async (bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const globalTopMarkup = new Markup()
      .setText(langText.global_top)
      .setAction('global_top');

    const currentGroupTopMarkup = new Markup()
      .setText(langText.group_top)
      .setAction('group_top');
      
    if (message.chat.type === 'private') {
     return message.reply(langText.supergroup_top, {
          replyMarkup: JSON.stringify({
          inline_keyboard: [
          [globalTopMarkup.toJSON()],
          ]
        })
      });
    } else {
      return message.reply(langText.supergroup_top, {
          replyMarkup: JSON.stringify({
          inline_keyboard: [
          [globalTopMarkup.toJSON()],
          [currentGroupTopMarkup.toJSON()]
          ]
        })
      });
    }
  },
};