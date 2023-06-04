const ms = require('ms');
const path = require('path');

module.exports = {
  command: '/work',
  description: 'Work and earn',
  code: async (bot, message) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const userId = await message.from.id;
    const chatId = await message.chat.id;
    const usersKey = await `${chatId}_${userId}`;
    const currenc = await bot.db.get('currency', message.chat.id) ?? '🍑'
    
    const lastWorkTime = await bot.db.get('cooldown', `${chatId}_${userId}_work`) ?? 0;
    const remainingTime = await lastWorkTime + ms('4h') - Date.now();
    
    if (remainingTime > 0) {
      const remainingTimeText = await ms(remainingTime, { long: true });
      return await message.reply(`${langText.error_work_cooldown} ${remainingTimeText}.`);
    }
    
    const earnings = await bot.random(10, 300);
    const userBalance = await bot.db.get('supergroup', usersKey) ?? 0;
    
    await bot.db.set('supergroup', usersKey, userBalance + earnings);
    await bot.db.set('cooldown', `${chatId}_${userId}_work`, Date.now());
    await bot.db.set('global', `${message.chat.id}_${message.from.id}`, (bot.db.get('global', `${message.chat.id}_${message.from.id}`) ?? 0) + earnings);
    
    await message.reply(langText.work_message_result.replace('{earnings}', earnings).replaceAll('{currenc}', currenc).replace('{general}', userBalance + earnings));
  },
};