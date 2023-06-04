const path = require('path');

module.exports = {
  command: '/additem',
  description: 'Add item to shop',
  usage: '/additem [name] [money]',
  code: async (bot, message, args, usage) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const memberInfo = await bot.getChatMember({
      chatId: message.chat.id,
      userId: message.from.id
    });
    const isGroupAdmin = memberInfo.status === 'administrator';
    const isGroupCreator = memberInfo.status === 'creator';
    
    if (message.chat.type === 'private') {
      return await message.reply(langText.error_message_private);
    }

    if (!(!isGroupAdmin && !isGroupCreator)) {
      return await message.reply(langText.error_administrator);
    }

    if (args.length < 2) {
      return await message.reply(langText.error_additem_example.replace('{usage}', usage));
    }

    const name = await args[0];
    const price = await parseInt(args[1]);

    if (isNaN(price)) {
      return await message.reply(langText.error_additem_example.replace('{usage}', usage));
    }

    await bot.db.set('shop', `shop_${message.chat.id}_${name}`, price);
    return await message.reply(langText.additem_text.replace('{name}', name).replace('{price}', price).replaceAll('{currenc}', bot.db.get('currency', message.chat.id) ?? '🍑'));
  }
};