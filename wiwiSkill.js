const redis = require('./redis.js');

// { type: 'message',
//   replyToken: '07b00f50e61d4ca3abada5b6a2b41778',
//   source: 
//    { userId: 'U451048461b01b3d2b99c117dca0e306d',
//      type: 'user',
//      profile: [Function] },
//   timestamp: 1494684341927,
//   message: 
//    { type: 'text',
//      id: '6080474222700',
//      text: 'wef',
//      content: [Function] },
//   reply: [Function] }
// { type: 'message',
//   replyToken: 'a2550a53d23c42f0b7d7523c989a26a5',
//   source: 
//    { groupId: 'C2ef79757c1f5a38bec83ac5da2f18ed5',
//      type: 'group',
//      profile: [Function] },
//   timestamp: 1494684385647,
//   message: 
//    { type: 'text',
//      id: '6080478474316',
//      text: 'test wiwi',
//      content: [Function] },
//   reply: [Function] }


const talkingJoke = (event) => {
  event.reply('現在不太會說笑話，請大家再幫我完善功能')
}

const rememberGroup = (event) => {
  if ((event.source.type === 'group')) {
    const groupId = event.source.groupId;
    redis.set('group', groupId);
    event.reply(`群組id:${groupId} 將與 github 連動`);
  } else {
    event.reply('請在群組內叫我');
  }
}

const order = {
  'wiwi這是你家': rememberGroup,
  'wiwi說笑話': talkingJoke,
};

const mainFunc = (event) => {
  if (event.type === 'message') {
    const text = event.message.text;
    const commandList = Object.keys(order);
    const commandIndex = commandList.findIndex(command => command === text);
    (commandIndex > -1) && order[commandList[commandIndex]](event);
  }
};

module.exports = mainFunc;