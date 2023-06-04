const ms = require('ms');
const path = require('path');

module.exports = {
  command: '/play',
  description: 'Play and try to win',
  code: async (bot, message) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const userId = await message.from.id;
    const chatId = await message.chat.id;
    const usersKey = await `${chatId}_${userId}`;
    const lastPlayTime = await bot.db.get('cooldown', `${usersKey}_play`) || 0;
    const remainingTime = await Math.max(0, lastPlayTime + ms('1h') - Date.now());
    const currency = await bot.db.get('currency', chatId) || '🍑';
    const userQuest = await bot.db.get('quest', `${userId}_quest`) || [];
    let playWin = await bot.db.get('quest', `${userId}_playWin`) || 0;
    const playWinMoney = await Number(bot.db.get('quest', `${userId}_playWinMoney`)) || 0;
    const winPlayTrue = await bot.db.get('quest', `${message.from.id}_winPlayTrue`);

    if (remainingTime > 0) {
      const remainingTimeText = await ms(remainingTime, { long: true });
      await message.reply(`${langText.play_error_cooldown} ${remainingTimeText}.`);
      return;
    }

    const winChance = await bot.random(1, 100);
    const userBalance = await bot.db.get('supergroup', usersKey) || 0;

    if (winChance <= 40 && userQuest.some(q => q.id === 2)) {
      await playWin++;
      await bot.db.set('quest', `${userId}_playWin`, playWin);
    }

    if (playWin === 3) {
      const winAmount = await bot.random(100, 7500);
      await bot.db.set('supergroup', usersKey, userBalance + winAmount);
      await bot.db.set('global', `${chatId}_${userId}`, (bot.db.get('global', `${chatId}_${userId}`) || 0) + winAmount);
      await bot.db.set('quest', `${userId}_playWinMoney`, playWinMoney + winAmount);
      
      await message.reply(langText.play_message_bonus.replace('{amount}', winAmount).replace('{currenc}', currency).replace('{general}', userBalance + winAmount))
    } else if (winChance < 40) {
      const winAmount = await bot.random(100, 7000);
      
      //console.log(playWinMoney + winAmount);
      if (((playWinMoney + winAmount) >= 20000) && winPlayTrue === true) {
      //const winAmount = bot.random(100, 8000);
      await bot.db.set('supergroup', usersKey, userBalance + winAmount);
      await bot.db.set('global', `${chatId}_${userId}`, (bot.db.get('global', `${chatId}_${userId}`) || 0) + winAmount);
      await bot.db.set('quest', `${message.from.id}_winPlayTrue`, false);
      
      await message.reply(langText.play_message_bonus_lus.replace('{amount}', winAmount).replace('{currenc}', currency).replace('{general}', userBalance + winAmount))
      } else {
      await bot.db.set('supergroup', usersKey, userBalance + winAmount);
      await bot.db.set('global', `${chatId}_${userId}`, (bot.db.get('global', `${chatId}_${userId}`) || 0) + winAmount);
      await bot.db.set('quest', `${userId}_playWinMoney`, playWinMoney+winAmount);
      
      await message.reply(langText.play_message_defolt.replace('{amount}', winAmount).replace('{currenc}', currency).replace('{general}', userBalance + winAmount))
      }
    } else {
      const loseAmount = await bot.random(10, 100);
      await bot.db.set('supergroup', usersKey, userBalance - loseAmount);
      await bot.db.set('global', `${chatId}_${userId}`, (bot.db.get('global', `${chatId}_${userId}`) || 0) - loseAmount);
      await bot.db.set('quest', `${userId}_playWinMoney`, playWinMoney-loseAmount);
      
      await message.reply(langTexп.message_play_lus.replace('{amount}', loseAmount).replace('{currenc}', currency).replace('{general}', userBalance + winAmount));
    }

    await bot.db.set('cooldown', `${usersKey}_play`, Date.now())
  }
}