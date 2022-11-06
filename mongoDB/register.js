//导入mongoose
let mongoose = require('mongoose');

//导入uuid

//链接数据库
mongoose.connect('mongodb://localhost/imgdata');


//告诉我们连接成功数据库还是失败
let db = mongoose.connection;
db.on('error', function () {
  console.log("数据库连接失败")
});

db.once('open', function () {
  console.log("数据库连接成功")
});


//设计数据结构
let kittySchema = mongoose.Schema(
  {
    //id
    // 名称作者
    author: {
      type: String,
    },
    // 作者id
    originator: {
      type: String,
    },
    password: {
      type: String,
    },
    // 背景头像
    bgcUrl: {
      type: String,
      default: "https://img2.baidu.com/it/u=1907452097,3002523506&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300"
    },
    // 手机号
    phone: {
      type: String,
      default: "001",
    },
    // 性别
    sex: {
      type: String,
      default: "-1"
    },
    // 登录时间
    time: {
      type: String,
      default: Date.now,
    },
    befint: {
      type: String,
      default: "这个人很神秘,没有留下什么"
    },
    // 注册时间
    zhuce: {
      type: String,
    },
    // 标语
    slogan: {
      type: String,
      default: "分享你的一切美好瞬间",
    }
  }
);



//发布数据库模型为model
let Register = mongoose.model('Register', kittySchema);


// Register.remove().then(e=>{
//   console.log(e)
// })





// for (let i = 0; i < 20; i++) {

//   let file = new Register(
//     {
//       author: `FeiMao@110#${i}`,
//       originator: `账户id${i}`,
//       password: "00000" + i,
//       bgcUrl: `https://192.168.43.209:8848/bgc.jpg${i}`,
//       phone: `${Math.random()}770726347`,
//       sex: "男",
//       time: `2022/10/17${i}`,
//       zhuce: "2022/10/1",
//       slogan: `分享你的美好瞬间${i}`,
//     }
//   )


//   file.save(function (err, fluffy) {
//     if (err) return console.error(err);
//     console.log(fluffy)
//   });
// }











//导出模型
module.exports = Register





