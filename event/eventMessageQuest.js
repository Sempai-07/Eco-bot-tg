const path = require('path');

module.exports = {
  name: 'message',
  once: false,
  code: async (bot, message) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const userId = await message.from.id;
    const chatId = await message.chat.id;
    const userQuest = await bot.db.get('quest', `${userId}_quest`) || [];
    let messageCount = await bot.db.get('quest', `${userId}_count`) || 0;
    const currency = await bot.db.get('currency', chatId) || '🍑';
    const usersKey = await `${chatId}_${userId}`;

    if (!userQuest.some(q => q.id === 1)) return;

    await messageCount++;

    if (messageCount === 500) {
      const addMoney = await bot.random(100, 6500);
      const userBalance = await bot.db.get('supergroup', usersKey) || 0;

      await bot.db.set('quest', `${userId}_count`, messageCount);
      await bot.db.set('supergroup', usersKey, userBalance + addMoney);
      await bot.db.set('global', `${chatId}_${userId}`, (bot.db.get('global', `${chatId}_${userId}`) || 0) + addMoney);
      
      await message.reply(langText.quest_bonus.replace('{addMoney}', addMoney).replace('{currenc}', currency).replace('{balance}', userBalance + addMoney))
    } else {
      await bot.db.set('quest', `${userId}_count`, messageCount);
    }
  }
};