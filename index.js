var TelegramBot = require('node-telegram-bot-api');
var Sandbox = require('sandbox');

var token = require('./token').token;

var bot = new TelegramBot(token, {polling: true});
var s = new Sandbox();

bot.on('inline_query', function (msg) {
  console.log(msg);

  if (msg.query == '')
    return;

  s.run(msg.query, function(output) {
    bot.answerInlineQuery(msg.id, [{
      id: '0',
      type: 'article',
      title: output.result,
      message_text: '*' + msg.query + '*\n' + output.result,
      disable_web_page_preview: true,
      hide_url: true,
      parse_mode: 'Markdown'
    }]);
  });
});
