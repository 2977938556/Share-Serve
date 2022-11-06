const express = require('express');//框架模块
const router = express.Router(); //设置路由模块

const fs = require('fs'); // fs 文件模块
const path = require('path');//path 路径模块
const UUID = require('uuid');//uuid 生成id模块
const GetIp = require('../utils/getip');// 获取Ip模块
const GetStatus = require('../utils/GetStatus');// 返回状态模块
const { createTokenm, verifyToken } = require('../utils/token');// 验证与生成token模块



//导入数据库
// home 首页数据库
let Home = require('../mongoDB/home')
let User = require('../mongoDB/user');






// 作品上传模块
router.post('/api/fileUpload', async (req, res,) => {

  //01:结构出数据
  //filesUpload:里面包含文件base4数据   || 文件名称
  //inputFile: 里面包含作品标题和标签
  const { filesUpload, inputFile, } = req.body;
  let userID = null;


  //02: 判断用户是否登录过期；了
  verifyToken(req.headers.authorization).then((value) => {
    // 将请求头中的token 解析的用户id数据进行保存 参数进行查询用户的数据
    userID = value.author;
  }).catch(err => {
    //返回token 过期的数据
    return GetStatus(res, 201, {}, "登录过期请重新登录");
  })




  //03：将传递的参数进行一个对象解析一个 字符串{} 进行字符串判断是否为空
  if (JSON.stringify(filesUpload) === "{}" || JSON.stringify(inputFile) == "{}") {
    return GetStatus(res, 201, {}, "上传的参数不能为空");
  } else {

    //04： 将图片名称从.切割成数组，并获取最后一个元素 获取后缀名
    let hzm = filesUpload.fileName.split('.')
    let hzms = hzm.pop();//后缀名


    //05：转换成 base64数据格式  [这里这里由于传递过来的数据开头会有一个图片格式""data:image",所以用正则表达式给给清空]
    const base64 = filesUpload.fileData.replace(/^data:image\/\w+;base64,/, "")
    const dataBuffer = new Buffer.from(base64, 'base64')

    //06：imgId： UUid 生成id+上面拼接的后缀名
    //    avatarPath :获取当前的文件地址，后面的参数就是需要保存图片的路径 [这里我使用了../由于__dirname获取的是当前文件目录的地址，如果不回到上一级目录就回出现拼接路径错误]
    let imgId = UUID.v1() + `.${hzms}`;
    let avatarPath = path.join(__dirname, `../public/upload/${imgId}`);


    //07：writeFile 异步写入文件
    fs.writeFile(avatarPath, dataBuffer, async (err) => {//用fs写入文件


      // 08：出现提交失败那么就返回错误数据提示
      if (err) return GetStatus(res, 201, {}, "作品发布失败，请稍后重试");


      //09： 通过当前id 进行查询数据 异步获取结果
      let userOne = await User.findOne({
        author: userID,
      })

      //10：判断是否有数据
      if (userOne == null) {
        return GetStatus(res, 201, {}, "作品发布失败，请稍后重试");
      }

      //11： 整理作品数据
      let user = {
        id: UUID.v4(),// 使用UUID 生成id作品ID
        title: inputFile.titles,// 作品标题
        labels: inputFile.labels,// 作品标签
        author: userOne.author,// 作品作者,
        originator: userOne._id,//作者id
        imgUrl: `8848/public/upload/${imgId}`,// 作品图片 (这里需要获取)
        bgcUrl: userOne.bgcUrl,// 头像Url
        time: new Date().getTime(),// 发布时间
        slogan: userOne.slogan, // 作者标语
        dianzan: 0,// 点赞数量
        pinglun: [],// 评论数量
      }

      //12：作品数据压入到查询出来的数据
      userOne.wode.push(user.id)

      //13：保存作品数据到 hom你就
      new Home(user).save((err) => {
        if (err) return GetStatus(res, 201, {}, "上传失败");
      })


      //14：保存到user模块中
      userOne.save().then(value => {
        return GetStatus(res, 200, { imgUrl: `8848/public/upload/${imgId}` }, "上传成功");
      }).catch(err => {
        return GetStatus(res, 201, {}, "上传失败");
      })




      // return res.send({ code: 200, massage: "发布成功" })


    })


  }
















})












module.exports = router