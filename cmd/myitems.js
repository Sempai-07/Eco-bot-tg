const path = require('path');

module.exports = {
  command: '/myitems',
  description: 'View purchased items',
  usage: '/myitems',
  code: async (bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    if (message.chat.type === 'private') {
      return await message.reply(langText.error_commandblack_private);
    }
    
    const userItems = await {};
    await bot.db.forEach('shop', (value, key) => {
      if (key.startsWith(`${message.chat.id}_${message.from.id}`)) {
        const itemName = key.split('_').slice(2).join(' ');
        const purchasePrice = bot.db.get('shop', `shop_${message.chat.id}_${itemName}`);
        const sellPrice = purchasePrice ? Math.round(purchasePrice / 2) : undefined;
        if (value === null || value === '') return;
        userItems[itemName] = {
          count: value,
          purchasePrice,
          sellPrice
        };
      }
    })
    const currency = await bot.db.get('currency', message.chat.id) || '🍑';
    if (Object.keys(userItems).length === 0) {
      return await message.reply(langText.myitems_non_item);
    }

    
    const itemList = await Object.entries(userItems)
      .reduce(async(acc, [itemName, { count, purchasePrice, sellPrice }]) => {
        if (purchasePrice === undefined) return await acc;
        return await acc + langText.myitems_message_return.replace('{name}', itemName).replace('{count}', count).replaceAll('{currenc}', currency).replace('{purchase}', purchasePrice).replace('{sell}', sellPrice);
      }, '');

    return await message.reply(`Вы купили следующие предметы:\n${itemList}`);
  }
};