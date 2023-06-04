const ms = require('ms');
const path = require('path');

module.exports = {
  command: '/cooldown',
  description: 'Shows all remaining cooldown',
  code: async (bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const chatId = await message.chat.id;
    let userId;
    const hasUserRedister = await bot.db.get('username', `username_${args[0]}`)
    
    if (hasUserRedister === undefined && !message.reply_to_message?.from?.username) {
      userId = await message.from.id;
    }
    
    if (!message.reply_to_message && hasUserRedister === undefined) {
      userId = await message.from.id;
    }
    
    userId = await hasUserRedister || message.reply_to_message?.from?.id || userId;
    
    const playCooldown = await bot.db.get('cooldown', `${chatId}_${userId}_play`) ?? 1;
    const bonusCooldown = await bot.db.get('cooldown', `${chatId}_${userId}_bonus`) ?? 1;
    const workCooldown = await bot.db.get('cooldown', `${chatId}_${userId}_work`) ?? 1;
    const bonusTime = await Math.max(bonusCooldown + ms('1d') - Date.now(), 0);
    const workTime = await Math.max(workCooldown + ms('4h') - Date.now(), 0);
    const playTime = await Math.max(playCooldown + ms('1h') - Date.now(), 0);
    await message.reply(langText.cooldown_text.replace('{bonus}', bonusTime <= 0 ? langText.isnot : ms(bonusTime, { long: true })).replace('{play}', playTime <= 0 ? langText.isnot : ms(playTime, { long: true })).replace('{work}', workTime <= 0 ? langText.isnot : ms(workTime, { long: true })));
  }
};