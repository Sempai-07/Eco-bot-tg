const path = require('path');

module.exports = {
  command: '/buyitem',
  description: 'Buy an item from the shop',
  usage: '/buyitem [name]',
  code: async (bot, message, args) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));

    const itemName = args[0];
    const price = bot.db.get('shop', `shop_${message.chat.id}_${itemName}`);

    if (!price) {
      return message.reply(langText.buyitem_item_not_found.replace('{itemName}', itemName));
    }

    const userId = message.from.id;
    const userBalance = bot.db.get('supergroup', `${message.chat.id}_${userId}`) ?? 0;
    const currency = bot.db.get('currency', message.chat.id) ?? '🍑';

    const isRegistered = bot.db.get('quest', `${userId}_registered`) ?? false;
    const userQuests = bot.db.get('quest', `${userId}_quest`) || [];
    const canGetPoints = userQuests.some(q => q.id === 6);
    
    if (!isRegistered || !canGetPoints) {
      return message.reply(langText.buyitem_cannot_get_points);
    }

    if (userBalance < price) {
      return message.reply(langText.buyitem_insufficient_funds.replace('{itemName}', itemName).replace('{price}', price).replace('{currency}', currency).replace('{userBalance}', userBalance));
    }

    const userItemsCount = bot.db.get('shop', `${message.chat.id}_${userId}_${itemName}`) ?? 0;
    bot.db.set('shop', `${message.chat.id}_${userId}_${itemName}`, userItemsCount + 1);
    bot.db.set('supergroup', `${message.chat.id}_${userId}`, userBalance - price);
    bot.db.set('global', `${message.chat.id}_${userId}`, (bot.db.get('global', `${message.chat.id}_${userId}`) ?? 0) - price);

    const boughtItemsCount = bot.db.get('shop', `${message.chat.id}_${userId}_${itemName}_count`) ?? 0;
    
    bot.db.set('shop', `${message.chat.id}_${userId}_${itemName}_count`, boughtItemsCount + 1);

    if (boughtItemsCount + 1 === 4) {
      const reward = Math.floor(Math.random() * (3500 - 100 + 1) + 100);
      bot.db.set('supergroup', `${message.chat.id}_${userId}`, userBalance + reward);
      bot.db.set('global', `${message.chat.id}_${userId}`, (bot.db.get('global', `${message.chat.id}_${userId}`) ?? 0) + reward + price);
      message.reply(langText.buyitem_reward.replace('{reward}', reward).replace('{currency}', currency));
    } else {
      message.reply(langText.buyitem_item_bought.replace('{itemName}', itemName).replace('{price}', price).replace('{currency}', currency));
    }
  }
};