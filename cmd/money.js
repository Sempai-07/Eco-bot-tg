const path = require('path');

module.exports = {
  command: '/money',
  description: 'Issue or withdraw money from the user',
  usage: '/money [+/-money] [@username/reply message]',
  code: async (bot, message, args, usage) => {
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

    /*if (args.length < 2) {
      return message.reply(`Пожалуйста, укажите сумму и пинг пользователя. Пример использования команды: /money [+/-сумма] [пинг пользователя]`);
    }*/

    const amount = await parseInt(args[0]);
    if (isNaN(amount)) {
      return await message.reply(langText.error_money_number.replace('{usage}', usage));
    }
    
    let userId;
    /*const mentionEntity = message.entities.find(entity => entity.type === 'mention');
    if (!mentionEntity || !message.reply_to_message) {
      return message.reply('Не найдено упоминание пользователя в сообщении,  или же ответ на его сообщение');
    }*/
    const hasUserRedister = await bot.db.get('username', `username_${args[2]}`)
    
    if (hasUserRedister === undefined && !message.reply_to_message?.from?.username) {
      return await message.reply(langText.error_text_search);
    }
    
    if (!message.reply_to_message && hasUserRedister === undefined) {
      return await message.reply(langText.error_text_reply);
    }
    
    userId = await hasUserRedister || message.reply_to_message.from.id;
    
    const currency = await bot.db.get('currency', message.chat.id) || '🍑';

    let action = await "";
    if (args[0][0] === "+") {
      await bot.db.set('supergroup', `${message.chat.id}_${userId}`, (bot.db.get('supergroup', `${message.chat.id}_${userId}`) ?? 0) + amount);
      await bot.db.set('global', `${message.chat.id}_${userId}`, (bot.db.get('global', `${message.chat.id}_${userId}`) ?? 0) + amount);
      action = await "+";
    } else if (args[0][0] === "-") {
      await bot.db.set('supergroup', `${message.chat.id}_${userId}`, (bot.db.get('supergroup', `${message.chat.id}_${userId}`) ?? 0) - amount);
      await bot.db.set('global', `${message.chat.id}_${userId}`, (bot.db.get('global', `${message.chat.id}_${userId}`) ?? 0) - amount);
      action = await "-";
    } else {
      return await message.reply(langText.error_money_args.replace('{usage}', usage));
    }
    let recipient = await '';
    if (args[2]) {
      recipient = await `@${args[2]}`;
    } else if (message.reply_to_message && message.reply_to_message.from.username) {
      recipient = await `@${message.reply_to_message.from.username}`;
    } else if (message.reply_to_message && message.reply_to_message.from.first_name) {
      recipient = await message.reply_to_message.from.first_name;
    }
    return await message.reply(`${langText.error_money[4]} ${action === "+" ? langText.error_money[0] : langText.error_money[1]} ${amount} ${currency} ${action === "+" ? langText.error_money[2]: langText.error_money[3] } ${recipient}`);
  }
}