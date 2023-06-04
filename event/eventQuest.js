const cron = require('cron');
const moment = require('moment-timezone');
const ms = require('ms');

module.exports = {
  name: 'ready',
  once: false,
  code: async(bot, client) => {
    const quest = await [
      {id: 1, text: 'Написать 500 сообщений'},
      {id: 2, text: 'Получить больше 30000 в команде /bonus'},
      {id: 3, text: 'Получить больше 20000 в команде /pay'},
      {id: 4, text: 'Использовать 100 команд в боте'},
      {id: 5, text: 'Выиграть 3 раза в /play'},
      {id: 6, text: 'Купить 4 предмета с /shop'}
    ];
    // создаем задание, которое будет выполняться каждый день в 00:00
    const lastUpdateTime = await bot.db.get('quest', 'last_update_time') || 0;
    const currentTime = await moment().valueOf();
    const timeDiff = await currentTime - lastUpdateTime;
    const oneDay = await ms('1d');
    //console.log(currentTime);
    //console.log(moment().tz('Europe/Moscow').startOf('day').add(1, 'days').valueOf());
    //console.log(lastUpdateTime);
    const updateTime = await Math.max(lastUpdateTime - ms('1d') - Date.now(), 0);
    if (timeDiff > lastUpdateTime) {
      // если время больше полуночи, отправляем сообщение и записываем в базу данных
      const allUsers = await bot.db.get('quest', 'users') || [];
      allUsers.forEach(async(userId) => {
        const userQuests = await generateUserQuests(quest);
        await bot.db.set('quest', `${userId}_quest`, userQuests);

        await bot.sendMessage({
          chatId: userId,
          text: 'Ваши квесты на сегодня:\n\n' + userQuests.map(q => q.text).join('\n')
        }).catch(err => console.log);
      });
      
      await bot.db.set('quest', 'last_update_time', await moment().tz('Europe/Moscow').valueOf());
      console.log(`Квесты обновлены в ${moment().tz('Europe/Moscow').format('DD.MM.YYYY HH:mm:ss')}`);
    } else if (timeDiff >= oneDay) {
      // если время меньше полуночи, но прошло больше 24 часов с последнего обновления, то тоже отправляем сообщение и записываем в базу данных
      const allUsers = await bot.db.get('quest', 'users') || [];
      allUsers.forEach(async(userId) => {
        const userQuests = await generateUserQuests(quest);
        await bot.db.set('quest', `${userId}_quest`, userQuests);

        await bot.sendMessage({
          chatId: userId,
          text: 'Ваши квесты на сегодня:\n\n' + userQuests.map(q => q.text).join('\n')
        }).catch(err => console.log);
      });
      
      await bot.db.set('quest', 'last_update_time', await moment().tz('Europe/Moscow').valueOf());
      //await dailyReset.start();
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