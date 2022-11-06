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
    // 背景头像
    bgcUrl: {
      type: String,
      default: "https://img2.baidu.com/it/u=1907452097,3002523506&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300"
    },
    // 手机号
    phone: {
      type: String,
    },
    // 性别
    sex: {
      type: String,
      default: "-1"
    },
    // 登录时间
    time: {
      type: String,
    },
    // 注册时间
    zhuce: {
      type: String,
    },
    // 标语
    slogan: {
      type: String,
      default: "分享你的一切美好瞬间",
    },
    wode: {
      type: Array,
    },
    dianzng: {
      type: Array,
    },
    shocang: {
      type: Array,
    }
  }
);



//发布数据库模型为model
let User = mongoose.model('User', kittySchema);



// User.remove().then(er => {
//   console.log(er)
// })




// for (let i = 0; i < 10; i++) {

//   let file = new User(
//     {
//       author: "FeiMao@110",
//       originator: "31232134",
//       bgcUrl: "https://192.168.43.209:8848/bgc.jpg",
//       phone: "18770726347",
//       sex: "男",
//       time: "2022/10/17",
//       zhuce: "2022/10/1",
//       slogan: "分享美好瞬间",
//     }
//   )


//   file.save(function (err, fluffy) {
//     if (err) return console.error(err);
//     console.log(fluffy)
//   });

// }











//导出模型
module.exports = User





