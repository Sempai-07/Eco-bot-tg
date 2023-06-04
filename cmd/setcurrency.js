const path = require('path');

module.exports = {
  command: '/setcurrency',
  description: 'Set currency for group',
  usage: '/setcurrency [emoji]',
  code: async (bot, message, args, usage) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const memberInfo = await bot.getChatMember({
      chatId: message.chat.id,
      userId: message.from.id
    });
    const isGroupAdmin = await memberInfo.status === 'administrator';
    const isGroupCreator = await memberInfo.status === 'creator';

    if (!(!isGroupAdmin && !isGroupCreator || message.chat.type === 'private')) {
      return await message.reply(langText.error_message_administration);
    }

    if (!args[0]) {
      return await message.reply(langText.setcurrency_message_args + usage);
    }
    
    if (args[0].length > 5) {
      return await message.reply(langText.setcurrency_message_args_non);
    }

    await bot.db.set('currency', message.chat.id, args[0]);
    return await message.reply(langText.setcurrency_message_result + `"${args[0]}".`);
  }
};