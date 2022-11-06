let express = require('express');// express 框架模块
let path = require('path');// 路径模块
let fs = require('fs');// 路径模块
const UUID = require('uuid');//uuid 生成id模块
let GetStatus = require('../utils/GetStatus')// 返回参数函数


let router = express.Router();


let User = require('../mongoDB/user')
let Home = require('../mongoDB/home')
let Register = require('../mongoDB/register');


// 01: 查找用户id数据接口
router.get('/api/editUserList', async (req, res) => {

  //这个是传递过来的一个id [用于账户查询]
  let originator = req.query.originator;
  let UserId = await Register.findOne({ originator: originator })
  if (UserId == null) {
    return GetStatus(res, 201, {}, "账户数据获取失败请重新登录", false)
  }
  return GetStatus(res, 200, UserId, "个人信息更新成功", true)
})


// 02:根据传递过来的参数进行数据库查找更新
router.post('/api/editUserGx', async (req, res) => {


  // 01:接收数据
  let filesUpload = req.body.filesUpload || {}; // 头像的数据
  let inputFile = req.body.inputFile || {};//input中的数据



  // 判断用户名称是否已经有人注册了

  //查早当前登录的账户
  let a = await Register.findOne({ originator: inputFile.originator })

  // 查找当前传递过来的账户名称 如果查到了那么就
  let b = await Register.findOne({ author: inputFile.author })

  if (a.author == inputFile.author || b == null) {



    // 02:这里是需要上传头像的业务
    if (JSON.stringify(filesUpload) != "{}" && JSON.stringify(inputFile) != "{}") {
      // console.log("需要处理头像的业务")

      // 这里我们需要判断修改的用户名称是否有人使用了

      // 03: 收集图片的后缀名
      let hzm = filesUpload.fileName.split('/').pop();

      // 04:转换成 base64数据格式  [这里这里由于传递过来的数据开头会有一个图片格式""data:image",所以用正则表达式给给清空]
      const base64 = filesUpload.fileData.replace(/^data:image\/\w+;base64,/, "")
      const dataBuffer = new Buffer.from(base64, 'base64')

      //06：imgId： UUid 生成id+上面拼接的后缀名
      //    avatarPath :获取当前的文件地址，后面的参数就是需要保存图片的路径 [这里我使用了../由于__dirname获取的是当前文件目录的地址，如果不回到上一级目录就回出现拼接路径错误]
      let imgId = UUID.v1() + `.${hzm}`;
      let avatarPath = path.join(__dirname, `../public/bgcUrl/${imgId}`);

      // 07:将图片保存到bgcUrl
      fs.writeFile(avatarPath, dataBuffer, async (err) => {
        // 提交失败那么就 返回错误信息
        if (err) return GetStatus(res, 201, {}, "作品发布失败，请稍后重试", false);

        // 写入成功那么就需要开始更新数据
        // 获取input 传递过来的用户id 以方便更新数据
        let originator = inputFile.originator;

        let author = "";

        // ____________________________________________


        // 查找注册中的数据  并更新
        let regData = await Register.findOne({ originator: originator });
        //10：判断是否有数据
        if (regData == null) {
          return GetStatus(res, 201, {}, "作品发布失败，请稍后重试", false);
        }
        // 这里是获取一下用户的未修改之前的用户名称 方便home 页面进行数据更新
        author = regData.author;


        //更新 register 注册的数据 并更新数据
        regData.author = inputFile.author;
        regData.sex = inputFile.sex;
        regData.slogan = inputFile.slogan;
        regData.befint = inputFile.befint;
        regData.phone = inputFile.phone;
        regData.bgcUrl = `8848/public/bgcUrl/${imgId}`;

        //14：保存到register 模块中
        regData.save().catch(err => {
          return GetStatus(res, 201, {}, "更新数据失败请重试", false);
        })

        // ____________________________________________


        // 这里是更新User 数据表中的数据
        let userData = await User.findOne({ originator: originator });
        //10：判断是否有数据
        if (regData == null) {
          return GetStatus(res, 201, {}, "更新数据失败请重试", false);
        }
        //更新 User 注册的数据 并更新数据
        userData.author = inputFile.author;
        userData.slogan = inputFile.slogan;
        userData.bgcUrl = `8848/public/bgcUrl/${imgId}`;

        // 保存到user模块中
        userData.save().catch(err => {
          return GetStatus(res, 201, {}, "更新数据失败请重试", false);
        });




        // 开始查找首页的数据
        let HomeData = await Home.find({
          author: author
        })


        HomeData.forEach(item => {
          item.author = inputFile.author;
          item.slogan = inputFile.slogan;
          item.bgcUrl = `8848/public/bgcUrl/${imgId}`;
          item.save().catch(err => {
            return GetStatus(res, 201, {}, "更新数据失败请重试", false);
          });
        })

        return GetStatus(res, 200, {}, "数据更新成功", true);



      })

      //  这里是不需要处理上传的头像业务
    } else {

      // 写入成功那么就需要开始更新数据
      // 获取input 传递过来的用户id 以方便更新数据
      let originator = inputFile.originator;

      let author = "";
      // _____________________  01  _______________________

      // 查找注册中的数据  并更新
      let regData = await Register.findOne({ originator: originator });
      //10：判断是否有数据
      if (regData == null) {
        return GetStatus(res, 201, {}, "作品发布失败，请稍后重试");
      }
      // 这里是获取一下用户的未修改之前的用户名称 方便home 页面进行数据更新
      author = regData.author;


      //更新 register 注册的数据 并更新数据
      regData.author = inputFile.author;
      regData.sex = inputFile.sex;
      regData.slogan = inputFile.slogan;
      regData.befint = inputFile.befint;
      regData.phone = inputFile.phone;
      regData.bgcUrl = inputFile.bgcUrl;

      //14：保存到register 模块中
      regData.save().catch(err => {
        return GetStatus(res, 201, {}, "更新数据失败请重试");
      })







      // ____________________ 02 ________________________

      let userData = await User.findOne({ originator: originator });
      //10：判断是否有数据
      if (regData == null) {
        return GetStatus(res, 201, {}, "更新数据失败请重试");
      }
      //更新 User 注册的数据 并更新数据
      userData.author = inputFile.author;
      userData.slogan = inputFile.slogan;
      // userData.bgcUrl = `8848/public/bgcUrl/${imgId}`;
      regData.bgcUrl = inputFile.bgcUrl;

      // 保存到user模块中
      userData.save().catch(err => {
        return GetStatus(res, 201, {}, "更新数据失败请重试");
      });






      // 开始查找首页的数据
      let HomeData = await Home.find({
        author: author
      })

      // 更新数据
      HomeData.forEach(item => {
        item.author = inputFile.author;
        item.slogan = inputFile.slogan;
        // item.bgcUrl = `8848/public/bgcUrl/${imgId}`;
        regData.bgcUrl = inputFile.bgcUrl;

        item.save().catch(err => {
          return GetStatus(res, 201, {}, "更新数据失败请重试");
        });
      })


      return GetStatus(res, 200, {}, "个人信息更新成功", true);

    }

  } else {
    return GetStatus(res, 201, {}, "该用户名称已经被使用了 请换一个吧~", false);
  }
















})


module.exports = router