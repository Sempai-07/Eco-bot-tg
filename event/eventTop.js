const { Button } = require('telegramsjs');
const path = require('path');

module.exports = {
  name: 'callback_query',
  once: false,
  code: async (bot, interaction) => {
    const { data, message } = await interaction;
    const lang = bot.db.get('language', interaction.chat.id) ?? ((interaction.from?.language_code == 'uk' || 'ru' || 'en' ? interaction.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const chatId = message.chat.id;
    const currenc = await bot.db.get('currency', chatId) || '🍑';
    await bot.answerCallbackQuery({
      callbackQueryId: interaction.id
    })
    
    if (data === 'group_top') {
      let count = 0;
      const userBalances = Object.values(bot.db.all('supergroup')).filter(item => item.key && item.key.startsWith(`${chatId}_`));
      const sortedTop = userBalances.sort((a, b) => Number(a.value) - Number(b.value));
      const sortedTop25 = sortedTop.reverse()
      let text = `${langText.table_supergroup}\n`;
      for (let i = 0; i < sortedTop25.length; i++) {
        const userId = sortedTop25[i].key.split('_')[1];
        const result = await bot.getChatMember({
          chatId: chatId,
          userId: userId
        });
        if (result.result && result.result.user) {
          count++;
          const userName = result.result.user.first_name;
          text += `${count}. ${userName}: ${sortedTop25[i].value} ${currenc}\n`;
        }
      } 
      
      if (sortedTop25.length === 0) {
        text += `${langText.top_none_users}\n`;
      }
      
      await interaction.reply(text);
    } else if (data === 'global_top') {
      let count = 0;
      const userBalances = Object.values(bot.db.all('global'));
      const sortedTop25 = userBalances.sort((a, b) => Number(b.value) - Number(a.value)).sort(Boolean);
      let text = `${langText.top_global}\n`;
      let users = [];
      for (let i = 0; i < sortedTop25.length; i++) {
        const userId = sortedTop25[i].key.split('_')[1];
        const chatId = sortedTop25[i].key.split('_')[0];
        try {
          const result = await bot.getChatMember({
            chatId: chatId,
            userId: userId
          });
          if (result.result && result.result.user) {
            const userName = result.result.user.first_name;
            if (!users.includes(userName)) {
              count++;
              text += `${count}. ${userName}: ${sortedTop25[i].value} ${currenc}\n`;
              users.push(userName);
            }
          }
        } catch (err) {
          console.log(err);
          const userName = sortedTop25[i].key;
          text += `${i + 1}. ${userName}: ${sortedTop25[i].value} ${currenc}\n`;
        }
      }
      
      if (sortedTop25.length === 0) {
        text += `${langText.top_none_users}\n`;
      }
      
      await interaction.reply(text);
    }
  }
};