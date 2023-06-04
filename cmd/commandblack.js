const path = require('path');

module.exports = {
  command: '/commandblack',
  description: 'Forbids/allows the use of the command',
  usage: '/commandblack [-/+] [command] [@username/reply message]',
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

    if (args.length < 2) {
      return await message.reply(langText.error_commandblack_example.replace('{command}'));
    }
    
    const { result: commands } = await bot.getMyCommands();
    const commandName = await args[1];
    const commandExists = await commands.some((command) => command.command === commandName);
    
    if (!commandExists) {
      return await message.reply(langText.error_commandblack_exist.replace('{command}', commandName));
    } 
    
    
    
    let userId;
    const hasUserRedister = await bot.db.get('username', `username_${args[3]}`)
    
    if (hasUserRedister === undefined && !message.reply_to_message?.from?.username) {
      return await message.reply(langText.error_text_search);
    }
    
    if (!message.reply_to_message && hasUserRedister === undefined) {
      return await message.reply(langText.error_text_reply);
    }
    
    userId = await hasUserRedister || message.reply_to_message.from.id;
    
    const isBlacklisted = await bot.db.get('command_blacklist', `${message.chat.id}_${userId}_${args[1]}`) || false;
    const command = await args[1];
    const user = await args[3] === undefined ? message.reply_to_message.from?.username : args[3];
    
    if (args[0] === '-' && !isBlacklisted) {
      await bot.db.set('command_blacklist', `${message.chat.id}_${userId}_${command}`, true);
      const replyMessage = await langText.text_reply_username_true.replace('{user}', `@${user}`).replace('{command}', command);
      return await message.reply(replyMessage);
    } else if (args[0] === '+' && isBlacklisted) {
      await bot.db.set('command_blacklist', `${message.chat.id}_${userId}_${command}`, false);
      const replyMessage = await langText.text_reply_username_false.replace('{user}', `@${user}`).replace('{command}', command);
      return await message.reply(replyMessage);
    } else {
      const action = await args[0] === '-' ? '-' : '+';
      const isBlacklistedMessage = await isBlacklisted ? langText.command_blacklist_istrue : langText.command_blacklist_isfalse;
      const replyMessage = await langText.replymessage_commandblack.replace('{command}', command).replace('{isBlacklistedMessage}', isBlacklistedMessage).replace('{user}', user).replace('{action}').replace('{usage}', usage);
      return await message.reply(replyMessage);
    }
  }
};