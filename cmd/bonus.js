const ms = require('ms');
const path = require('path');

module.exports = {
  command: '/bonus',
  description: 'Daily reward',
  code: async (bot, message) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const userId = await message.from.id;
    const chatId = await message.chat.id;
    const usersKey = await `${chatId}_${userId}`;
    const lastBonusTime = await bot.db.get('cooldown', `${chatId}_${userId}_bonus`) ?? 0;
    const remainingTime = await lastBonusTime + ms('1d') - Date.now();
    const currenc = await bot.db.get('currency', message.chat.id) ?? '🍑'
    const userBalance = await bot.db.get('supergroup', usersKey) ?? 0;
    const userQuest = await bot.db.get('quest', `${userId}_quest`) ?? [];

    if (remainingTime > 0) {
      const remainingTimeText = await ms(remainingTime, { long: true });
      await message.reply(langText.error_bonus_cooldown.replace('{cooldown}', remainingTimeText));
    } else {
      let bonusAmount = await bot.random(500, 50000);
      const oldBonus = await bot.db.get('quest', `${message.from.id}_bonus`) ?? 0;
      await bot.db.set('quest', `${message.from.id}_bonus`, oldBonus + bonusAmount)
      const totalBonus = await bot.db.get('quest', `${message.from.id}_bonus`) ?? 0;
      let replyText;
      if (userQuest.some(q => q.id === 2) && totalBonus > 30000) {
        bonusAmount += await 10000;
        replyText = await langText.bonus_normal_text.replace('{amount}', bonusAmount).replace('{currenc}', currenc);
      } else {
        replyText = await langText.bonus_quest_text.replace('{amount}', bonusAmount).replace('{currenc}', currenc);
      }
      await bot.db.set('cooldown', `${chatId}_${userId}_bonus`, Date.now());
      await bot.db.set('global', usersKey, (bot.db.get('global', `${message.chat.id}_${message.from.id}`) ?? 0) + bonusAmount);
      await bot.db.set('supergroup', usersKey, userBalance + bonusAmount);
      await message.reply(langText.bonus_last_text.replace('{currenc}', currenc).replace('{lastMoney}', userBalance + bonusAmount).replace('{replyText}', replyText));
    }
  },
};