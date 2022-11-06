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
    id: {
      type: String,
    },
    //作品标题
    title: {
      type: String,
    },
    //账户名称
    author: {
      type: String,
    },
    //作者id
    originator: {
      type: String,
    },
    //背景图片
    imgUrl: {
      type: String,
    },
    //头像
    bgcUrl: {
      type: String,
    },
    //发布时间
    time: {
      type: String,
    },
    // 标签
    labels: {
      type: String,
      default: ""
    },
    //标语
    slogan: { type: String },
    //点赞数量
    dianzan: { type: Number },
    //收藏数量
    shocang: { type: Number },
    //评论数据
    pinglun: { type: Array }
  }
);




//发布数据库模型为model
let Home = mongoose.model('Home', kittySchema);






// 正则查询

// Home.find({
//   $or: [
//     { title: { $regex: /^2.*/ } },
//     { id: { $regex: /^9.*/ } },
//     { labels: { $regex: /^9.*/ } },
//   ]
// }).then(value => {
//   console.log(value);
// }).catch(err => {
//   console.log(err)
// })







// Home.remove()

// for (let i = 0; i < 10; i++) {


//   let file = new Home(
//     {
//       title: `看这个肥猫真肥猫呀！${i}`,
//       author: `FeiMao@110#${i}`,
//       originator: `我后期会变成uuid${i}`,
//       imgUrl: `https://192.168.43.209:8848/bgc.jpg${i}`,
//       bgcUrl: `https://192.168.43.209:8848/bgc.jpg${i}`,
//       time: `2022/10/17${i}`,
//       slogan: `分享你的美好瞬间${i}`,
//       dianzan: i,
//       shocang: i,
//       pinglun: []
//     }
//   )


//   file.save(function (err, fluffy) {
//     if (err) return console.error(err);
//     console.log(fluffy)
//   });


// }














//导出模型
module.exports = Home





