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

ghParser.on('repository', (repo, data) => {
  let message = '';
  if (data.action === 'created') {
    message = `${data.sender.login} 建立了一個新的repo 叫作 ${repo}`
  } else if (data.action === 'deleted') {
    message = `${data.sender.login} 刪除了一個 repo: ${repo}`
  }
  redis.get('group', (err, groupId) => {
    groupId && bot.push(groupId, message);
  });
});

ghParser.on('pull_request', (repo, data) => {
  let message = {
    type: 'template',
    altText: '收到 pr',
    template: {
      type: 'buttons',
      title: '有人提出 PR',
      text: `repo: ${repo} \r\nuser: ${data.pull_request.user.login}`,
      actions: [
        {
          type: 'uri',
          label: '詳細資訊',
          uri: data.pull_request.html_url
        }
      ]
    }
  }
  if (data.action === 'opened') {
    redis.get('group', (err, groupId) => {
      groupId && bot.push(groupId, message);
    });
  }

});

bot.on('message', wiwiSkill);
app.use('/linewebhook', linebotParser);
app.use(bodyParser.json());
app.use(ghParser);

app.listen(process.env.PORT || 3000, () => { console.log('server start success'); });