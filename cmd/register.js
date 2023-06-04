const path = require('path');

module.exports = {
  command: '/register',
  description: 'Register for quests',
  code: async (bot, message) => {
    const lang = bot.db.get('language', message.chat.id) ?? ((message.from?.language_code == 'uk' || 'ru' || 'en' ? message.from.language_code : false) ?? 'en');
    const langText = require(path.join(process.cwd(), `./language/${lang}.json`));
    const quest = await [
      {id: 1, text: 'Написать 500 сообщений'},
      {id: 2, text: 'Получить больше 30000 в команде /bonus'},
      {id: 3, text: 'Получить больше 20000 в команде /pay'},
      {id: 4, text: 'Использовать 100 команд в боте'},
      {id: 5, text: 'Выиграть 3 раза в /play'},
      {id: 6, text: 'Купить 4 предмета с /shop'}
    ];

    if (message.chat.type === 'private') {
      return await message.reply(langText.error_message_private);
    }

    const userId = await message.from.id;
    const allUsers = await bot.db.get('quest', 'users') || [];
    const hasRegistered = await bot.db.get('quest', `${userId}_registered`) ?? false;

    if (hasRegistered === false) {
      await bot.db.set('quest', 'users', [...allUsers, userId]);
      await bot.db.set('quest', `${userId}_registered`, true);

      const userQuests = await generateUserQuests(quest);
      await bot.db.set('quest', `${userId}_quest`, userQuests);

      await message.reply(langText.register_message_true);
    } else if (hasRegistered === true) {
      const userQuests = await bot.db.get('quest', `${userId}_quest`);
      if (!userQuests || userQuests.length === 0) {
        await message.reply(langText.register_message_repeat + ':\n\n' + quest.map(q => q.text).join('\n'));
      } else {
        await message.reply(langText.require_message_exercise + ':\n\n' + userQuests.map(q => q.text).join('\n'));
      }
    }
  }
};

function generateUserQuests(quest) {
  const shuffledQuest = shuffle(quest);
  return shuffledQuest.slice(0, 3);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};