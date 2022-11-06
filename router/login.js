const express = require('express');//框架模块
const md5 = require('md5');//加密模块
const { createToken, verifyToken } = require('../utils/token');


let Register = require('../mongoDB/register');//导入数据库
const User = require('../mongoDB/user');

// 实例化 router在express中
const router = express.Router();


// 返回数据
const GetStatus = require('../utils/GetStatus')


// 01:返回登录的数据
router.post('/api/logindata', async (req, res) => {

  // 01获取账户传递过来的账户数据
  let params = req.body;

  //02 更根据用户名或者用户Id进行查找数据
  let UserData = await Register.findOne({
    $or: [
      { author: params.account },
      { originator: params.account }
    ]
  })

  //02 判断是否有数据 

  //数据库中无该账户数据
  if (!UserData) {
    return GetStatus(res, 201, {}, "该账户未注册", false)
  } else {
    //MD5加密后 比对数据库中的数据
    if (md5(md5(params.password)) !== UserData.password) {
      return GetStatus(res, 201, {}, "账户或者密码错误", false)
      // 成功登录 并且携带token返回出去
    } else {
      UserData.time = new Date().getTime();// 设置登录时间
      UserData.save().then(value => {
        // console.log("登录时间修改完成")
      })

      return GetStatus(res, 200, { UserData, token: createToken({ author: UserData.author }) }, "登录成功", true)
    }

  }
})






//返回用户数据
router.post('/api/user', async (req, res) => {

  verifyToken(req.headers.authorization).then(async (value) => {
    // console.log("传递过来的token解析后的参数", value)

    //通过id获取用户数据 这里的查询数据是从验证token函数返回出来的
    let UserData = await User.findOne({ author: value.author })

    //如果没有数据那么就返回
    if (UserData == null) {
      return GetStatus(res, 201, {}, "token 失效了请重新登录", false)
    } else {
      return GetStatus(res, 200, { UserData }, "登录成功", true)
    }
  }).catch(error => {
    // console.log("token 失效了")
    return GetStatus(res, 401, {}, "token 失效了请重新登录", false)
  })





})






module.exports = router
