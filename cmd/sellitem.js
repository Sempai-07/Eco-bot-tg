const path = require('path');


module.exports = {
  command: '/sellitem',
  description: 'Sell item',
  usage: '/sellitem [name]',
  code: async (bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const itemName = await args[0];
    //const itemPrice = parseInt(args[1]);
    
    if (message.chat.type === 'private') {
      return await message.reply(langText.error_message_private);
    }

    if (!itemName) {
      return await message.reply(langText.sellitem_message_non_name);
    }

    const userItemsCount = await bot.db.get('shop', `${message.chat.id}_${message.from.id}_${itemName}`) ?? 0;

    if (userItemsCount < 1) {
      return await message.reply(langText.sellitem_non_item_user.replace('{name}', itemName));
    }
    
    
    const itemHas = await bot.db.has('shop', `shop_${message.chat.id}_${itemName}`);
    const itemGet = await bot.db.get('shop', `shop_${message.chat.id}_${itemName}`);
    const itemGetDel = await bot.db.has('shop', `delete_${message.chat.id}_${itemName}`);
    
    if (itemHas) {
      const itemPrice = await Math.round(itemGet / 2)
      const currency = await bot.db.get('currency', message.chat.id) || '🍑';
      //bot.db.set('shop', `shop_${message.chat.id}_${itemName}`, itemPrice);
      await bot.db.set('shop', `${message.chat.id}_${message.from.id}_${itemName}`, userItemsCount - 1);
      await bot.db.set('supergroup', `${message.chat.id}_${message.from.id}`, (bot.db.get('supergroup', `${message.chat.id}_${message.from.id}`) ?? 0) + itemPrice);
      await bot.db.set('global', `${message.chat.id}_${message.from.id}`, (bot.db.get('global', `${message.chat.id}_${message.from.id}`) ?? 0) + itemPrice);
      
      return await message.reply(langText.sellitem_message_result.replace('{name}', itemName).replace('{price}', itemPrice).replace('{currenc}', currency));
    } else {
      const itemPrice = await Math.round(itemGetDel / 2)
      const currency = await bot.db.get('currency', message.chat.id) || '🍑';
      //bot.db.set('shop', `shop_${message.chat.id}_${itemName}`, itemPrice);
      await bot.db.set('shop', `${message.chat.id}_${message.from.id}_${itemName}`, userItemsCount - 1);
      await bot.db.set('supergroup', `${message.chat.id}_${message.from.id}`, (bot.db.get('supergroup', `${message.chat.id}_${message.from.id}`) ?? 0) + itemPrice);
      await bot.db.set('global', `${message.chat.id}_${message.from.id}`, (bot.db.get('global', `${message.chat.id}_${message.from.id}`) ?? 0) + itemPrice);
      
      return await message.reply(langText.sellitem_message_result.replace('{name}', itemName).replace('{price}', itemPrice).replace('{currenc}', currency));
    }
  }
};