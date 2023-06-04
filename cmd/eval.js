module.exports = {
  command: '/eval',
  exudates: true,
  description: 'Команда для разработчика',
  code: async (bot, message) => {
    if (message.from.id !== 1574132959) return;
    try {
      const textEval = eval(message.text.slice(6));
      return message.reply({
        text: textEval ? textEval : 'true'
      });
    } catch (err) {
      return message.reply({
        text: err ? err : 'error code'
      });
    }
  },
};
