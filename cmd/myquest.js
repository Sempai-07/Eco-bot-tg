const ms = require('ms');
const path = require('path');

module.exports = {
  command: '/myquest',
  description: 'List of your quests',
  code: async (bot, message) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const userId = await message.from.id;
    const hasRegistered = await bot.db.get('quest', `${userId}_registered`) ?? false;
    const lastUpdateTime = await bot.db.get('quest', 'last_update_time') || 0;
    const timeToNextUpdate = await Math.max(lastUpdateTime + ms('1d') - Date.now(), 0);
    if (hasRegistered) {
      const userQuests = await bot.db.get('quest', `${userId}_quest`);
      const questsList = await userQuests.map(q => q.text).join('\n');
      const nextUpdateMessage = await `\n\n${langText.myquest_update_message} ${ms(timeToNextUpdate, {long: true})}`;
      await message.reply(`${langText.myquest_message_current}\n\n${questsList}${nextUpdateMessage}`);
    } else {
      await message.reply(langText.myquest_error_usage);
    }
  }
};