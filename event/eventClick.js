const path = require('path');
const { Markup } = require('telegramsjs');

module.exports = {
  name: 'callback_query',
  once: false,
  code: async(bot, interaction) => {
    const { data, message } = await interaction;
    const lang = bot.db.get('language', interaction.chat.id) ?? ((interaction.from?.language_code == 'uk' || 'ru' || 'en' ? interaction.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    let chatId = await message.chat.id;
    const currenc = await bot.db.get('currency', message.chat.id) ?? '🍑';
    await interaction.deferUpdate()
    
    if (data === 'click') {
      let clickCout = await bot.db.get('click', 'click_all') ?? 0;
      const clickMarkups = await new Markup()
      .setText(langText.click)
      .setAction('click');
      
      const currenc = await bot.db.get('currency', interaction.chat.id) ?? '🍑';
      const userBalance = await bot.db.get('supergroup', `${message.chat.id}_${interaction.from.id}`) ?? 0;
      
      const winChance = await 0.4;
      const winAmount = await 10;
      const random = await Math.random();
      let replyText = await '';
      
      
      if (random < winChance) {
        await bot.db.set('supergroup', `${interaction.chat.id}_${interaction.from.id}`, userBalance + winAmount);
        await bot.db.set('global', `${interaction.chat.id}_${interaction.from.id}`, (bot.db.get('global', `${interaction.chat.id}_${interaction.from.id}`) ?? 0) + winAmount);
        replyText = await `${langText.click_win} ${winAmount} ${currenc}!`;
      } else {
        await bot.db.set('supergroup', `${interaction.chat.id}_${interaction.from.id}`, userBalance - 3);
        await bot.db.set('global', `${interaction.chat.id}_${interaction.from.id}`, (bot.db.get('global', `${interaction.chat.id}_${interaction.from.id}`) ?? 0) - 3);
        replyText = await langText.click_lus.replace('{currenc}', currenc);
      }
      
      setTimeout(function() {
        //throw new Error('Error');
      }, 2000);
      
      const updatedBalance = await bot.db.get('supergroup', `${message.chat.id}_${interaction.from.id}`) ?? 0;
      await bot.db.set('click', 'click_all', ++clickCout);
      await bot.editMessageText({
        chatId: message.chat.id,
        text: `${replyText}\n\n${langText.click_result.replace('{balance}', updatedBalance).replace('{currenc}', currenc).replace('{count}', clickCout)}`,
        messageId: message.message_id,
        replyMarkup: JSON.stringify({ inline_keyboard: [
          [clickMarkups.toJSON()]
          ]
       })
     });
    }
  }
}