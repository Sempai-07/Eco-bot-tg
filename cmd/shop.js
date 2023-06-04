const path = require('path');

module.exports = {
  command: '/shop',
  description: 'View items in the store',
  usage: '/shop',
  code: async (bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    if (message.chat.type === 'private') {
      return await message.reply(langText.error_message_private);
    }
    
    const shopItems = await {};
    await bot.db.forEach('shop', async(value, key) => {
      if (key.startsWith(`shop_${message.chat.id}`)) {
        shopItems[key] = await value;
      }
    });

    const currenc = await bot.db.get('currency', message.chat.id) ?? '🍑';

    if (Object.keys(shopItems).length === 0) {
      return await message.reply(langText.shop_non_item);
    }

    const itemList = await Object.entries(shopItems)
      .map(async([key, value]) => {
        const name = await key.split('_').slice(2).join(' ');
        return await `${name} - ${value} ${currenc}`;
      })
      .join('\n');

    return await message.reply(`${langText.shop_message_result}\n${itemList}`);
  }
};