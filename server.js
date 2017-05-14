const express = require('express');
const bodyParser = require('body-parser')
const linebot = require('linebot');
const GithubWebHook = require('express-github-webhook');
const wiwiSkill = require('./wiwiSkill.js');
const redis = require('./redis.js')

const app = express();
const ghParser = GithubWebHook({ path: '/ghwebhook', secret: process.env.GH_SECRET });
const bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_TOKEN
});
const linebotParser = bot.parser();

ghParser.on('repository', (event, repo, data) => {
  let message = '';
  if (data.action === 'created') {
    message = `${data.sender.login} 建立了一個新的repo 叫作 ${repo}`
  } else if (data.action === 'deleted') {
    message = `${data.sender.login} 刪除了一個 repo: ${repo}`
  }
  redis.get('group', (groupId) => { groupId && bot.push(groupId, message); });
});

ghParser.on('pull_request', (event, repo, data) => {
  const message = {
    type: 'template',
    altText: 'this is a buttons template',
    template: {
      type: 'buttons',
      thumbnailImageUrl: 'http://i.imgur.com/MIkc9U9.jpg',
      title: '發現PR',
      text: 'Please select',
      actions: [{
        type: 'uri',
        label: '點我察看',
        uri: ''
      }]
    }
  };
  if (data.action === 'opened') {
    message.template.text = `${data.pull_request.user.login} 發出了一個PR，哭著請大家有空看一下`;
    message.template.actions[0].uri = data.pull_request.url
  }
  redis.get('group', (groupId) => { groupId && bot.push(groupId, message); });
});

bot.on('message', wiwiSkill);
app.use('/linewebhook', linebotParser);
app.use(bodyParser.json());
app.use(ghParser);

app.listen(process.env.PORT || 3000, () => { console.log('server start success'); });