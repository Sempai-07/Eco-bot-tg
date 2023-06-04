const path = require('path');

module.exports = {
  command: '/deleteitem',
  description: 'Remove an item from the store',
  usage: '/deleteitem [name]',
  code: async (bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const memberInfo = await bot.getChatMember({
      chatId: message.chat.id,
      userId: message.from.id
    });
    const isGroupAdmin = await memberInfo.status === 'administrator';
    const isGroupCreator = await memberInfo.status === 'creator';
    
    if (message.chat.type === 'private') {
      return await message.reply(langText.error_commandblack_private);
    }
    
    if (!(!isGroupAdmin && !isGroupCreator)) {
      return await message.reply(langText.error_commandblack_administrator);
    }

    const itemName = await args.join(' ');
    if (!itemName) {
      return await message.reply(langText.error_deleteitem_args);
    }

    const shopItemKey = await `shop_${message.chat.id}_${itemName}`;
    const itemExists = await bot.db.has('shop', shopItemKey);
    if (!itemExists) {
      return await message.reply(langText.error_deleteitem_name.replace('{name}', itemName));
    }
    
    const shopDeleteItemKey = await `delete_${message.chat.id}_${itemName}`;
    await bot.db.set('shop', shopDeleteItemKey)
    await bot.db.delete('shop', shopItemKey);
    return await message.reply(langTngT.reply_deleteitem_text.replace('{name}', itemName));
  }
};