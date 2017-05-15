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

const jokeList = [
  '你知道什麼蜜蜂最長壽嗎？ 答案是高齡峰 😘',
  '阿罵跟孫女去湖邊，孫女掉到湖裡，湖中女神問她在找什麼，阿罵:[我在找金孫]，湖中女神:[你太貪心了]',
  '小孩子跌倒，猜一成語？ 答案：馬馬虎虎（媽媽撫撫）',
  '死掉的腎臟，猜一本中國小說？ 答案：西遊記（台語：死腰子）',
  '一顆心值多少錢？ 答案：一億（一心一意）',
  '愛是什麼？ 答案：基摩人（愛斯基摩人）',
  '饅頭假裝是肉包，猜一人名？ 答案：吳宗憲（無中陷）',
  '誰家沒有電話？ 答案：天衣，因為天衣無縫（PHONE）',
  '孔子有3位徒弟：子貢、子路和子游，哪一位不是人？ 答案：子路，因為指鹿為馬（子路為馬）',
  '哪種動物最怕冷？ 答案：鴨子（〝呱呱〞台語：冷冷）',
  '老鼠姓什麼？ 答案：米（米老鼠）',
  '一口井，旁邊有兩杯茶猜一種職業？ 答案：警察伯伯',
  '鯊魚不小心吞了一顆綠豆，牠變成了什麼？ 答案：綠豆沙（綠豆鯊）',
  '少了一本書，猜一成語？ 答案：缺一不可（缺一Book）',
  '第11本書，猜一成語？ 答案：不可思議（Book11）',
  '很多離婚的女人，猜一成語？ 答案：前功盡棄（前公盡棄）',
  '希爾頓、香格里拉、凱悅，哪一家服務生最沒禮貌？ 答案：香格里拉（台語：誰叫你來）',
  '小明爬樓梯，才爬到2樓，為什麼覺得腳很酸？ 答案：因為他踩到檸檬',
  '夕陽西下，斷腸人在哪裡？ 答案：醫院',
  '五月花和百合花哪一個沒有生小孩？ 答案：五月花。五月花〝衛生紙〞（未生子）',
  '為什麼阿里巴巴只帶36名海盜過來？ 答案：因為台灣已經有市民大道（4名大盜）了',
  '老師:為啥要來上學？ 學生:不讓老師失業！',
  '猩猩跟猴子很怕一種線，請問那是什麼線？ 答案: 平行線，因為沒有相交（沒有香蕉)',
  '大象的媽媽為什麼是猩猩？ 答案:因為象由猩生阿...（相由心生）',
  '有個人住在雨傘上面，猜猜他是誰？ 答案:黑狗兄啦！',
  '為什麼上帝不用租A片? 答案: 是因為人在看天在看',
  '人體哪個東西貴的可賣到兆？ 答案: 膽...好膽麥跑(兆).(台語)',
  '有一把隱形的劍，是什麼劍？ 答案:看不見(劍)',
  '李哪吒、唐三奘、牛魔王，哪一個患有不孕症呢？ 答案:唐三奘【唐三奘要去西方取經(精)】',
  '誰的大便最濃？ 答案: 席維斯【屎特濃】',
  '請他飲料又幫他插上吸管...但還不喝...那麼大牌的人是誰？ 答案:美國總統布希(不吸)',
  '馬.狗.豬各一隻.哪隻較聰明？ 答案:豬..因為豬(珠)算~~高手',
  '請問老虎叫什麼名字咧? 答案:....丹丹~ 因為： 虎視眈眈(虎是丹丹)',
  '請問這個世界上誰的快遞最多？ 答案:王老先生....因為....王老先生有快遞',
  '迪士尼卡通的辛巴姓什麼? 答案:..姓王..因為獅子 王辛巴',
  '進浴室洗澡時，要先脫衣服還是褲子？ 答案 :先關門比較好',
];


const talkingJoke = (event) => {
  const joke = jokeList[Math.floor(Math.random() * jokeList.length)]
  event.reply(`乖喔～ 🤗 wiwi講笑話給你聽: 　${joke}`);
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
  '這是你家': rememberGroup,
  '笑話|無聊|愛睏|想睡': talkingJoke,
};

const mainFunc = (event) => {
  if ((event.type === 'message') && (event.message.text.toLowerCase().indexOf('wiwi') > -1)) {
    const text = event.message.text;
    const commandList = Object.keys(order);
    const commandIndex = commandList.findIndex(command => new RegExp(command).test(text));
    (commandIndex > -1) && order[commandList[commandIndex]](event);
  }
};

module.exports = mainFunc;