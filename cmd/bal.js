const path = require('path');

module.exports = {
  command: '/bal',
  description: 'Your balance',
  code: async (bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const chatId = await message.chat.id;
    const currenc = await bot.db.get('currency', chatId) ?? '🍑';
    let userId;
    const hasUserRedister = await bot.db.get('username', `username_${args[0]}`)
    
    if (hasUserRedister === undefined && !message.reply_to_message?.from?.username) {
      userId = await message.from.id;
    }
    
    if (!message.reply_to_message && hasUserRedister === undefined) {
      userId = await message.from.id;
    }
    
    userId = await hasUserRedister || message.reply_to_message?.from?.id || userId;
    
    const generalBalance = await bot.db.get('supergroup', `${chatId}_${userId}`) ?? 0;
    const globalBalance = await bot.db.get('global', `${chatId}_${userId}`) ?? 0;
    
   if (message.chat.type === 'supergroup') 
   await message.reply(langText.balance_text_supergroup.replace('{global}', globalBalance).replace('{general}', generalBalance).replaceAll('{currenc}', currenc));
   else 
   await message.reply(langText.balance_text_private.replace('{general}', generalBalance).replaceAll('{currenc}', currenc));
  },
};