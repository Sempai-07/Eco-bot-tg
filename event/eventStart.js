const chalk = require('chalk');


module.exports = {
  name: 'ready',
  once: false,
  code: async(bot, client) => {
    const username = await bot.getMe();
    await bot.setMyCommands({
      commands: JSON.stringify(bot.commands.toArray())
    });

    console.log(chalk.blue(`Bot starting: ${username.username}`));
    console.log(chalk.yellow('Registered commands:'));
    
    let count = 0;
    bot.commands.forEach(command => {
      console.log(chalk.green(`${count++}. ${command.command} - ${command.description}`));
    });
  }
}