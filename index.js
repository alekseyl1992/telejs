var TelegramBot = require('node-telegram-bot-api');
var Sandbox = require('sandbox');
var markdownEscape = require('markdown-escape');

var token = require('./token').token;

var bot = new TelegramBot(token, {polling: true});
var s = new Sandbox();

console.log('Bot started: ' + new Date());

bot.on('inline_query', (msg) => {
  console.log('-----begin----');
  console.log('Input:');
  console.log(msg);

  if (msg.query == '')
    return;

  s.run(msg.query, (output) => {
    var text = '*' + markdownEscape(msg.query) + '*\n' + markdownEscape(output.result);
    console.log('Output:');
    console.log(text);

    console.log('API result:');
    bot.answerInlineQuery(msg.id, [{
      id: '0',
      type: 'article',
      title: markdownEscape(output.result),
      message_text: text,
      disable_web_page_preview: true,
      hide_url: true,
      parse_mode: 'Markdown'
    }]).then(
      (value) => {
        console.log(value);
        console.log('-----end------');
      },
      (error) => {
        console.log(error);
        console.log('-----end------');
      }
    )
  });
});


function exitHandler(options, err) {
    if (options.cleanup)
      console.log('clean');

    if (err)
      console.log(err.stack);

    if (options.exit) {
      console.log('Bot stopped: ' + new Date());
      process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));