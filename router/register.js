const express = require('express');
const { v4: UUID4 } = require('uuid');
const md5 = require('md5')

//导入user数据库
const User = require('../mongoDB/user');

//导入register数据库 
const Register = require('../mongoDB/register')




// 实例化 router在express中
let router = express.Router();





// 返回数据
function GetStatus(res, code, data = {}, massage, status) {
  return res.send({
    code: code,
    data: data,
    massage: massage,
    state: status,
  })
}







// 01:注册模块
router.post('/api/registerdata', async (req, res) => {

  let params = req.body;
  // console.log("传递过来的数据", params)

  //01:数据库查找数据
  let UserData = await Register.findOne({
    $or: [
      { author: params.account },
      { originator: params.account }
    ]
  });


  //01:数据库查找数据是否有该账户名称
  //02:如果有数据那么就返回已经被注册了
  //03:如果没有那么就给你注册
  //04:判断两次密码是否一致
  //05:不一致那么就返回密码不一致
  //06:符合合法命名那么就保存到数据库中 
  // 扩展 密码加密 


  //02:判断

  // 查找不到账户那么就是合法的
  if (!UserData) {
    //使用正则表达式进行判断用户名是否合法
    var reg = new RegExp("[`~!#$^&*()=|{}':;',\\[\\].<>《》/?~！#￥……&*（）――|{}【】‘；：”“'。，、？ ]");
    if (reg.test(params.account)) {
      return GetStatus(res, 201, {}, "账户名不合法,请使用数字或者中英文", false)
    } else if ((params.password == "" || params.account == "" || params.passwordB == "")) {
      return GetStatus(res, 201, {}, "提交的内容不能为空", false)
    } else {
      // 判断密码是否合法
      if (params.password != params.passwordB) {
        return GetStatus(res, 201, {}, "两次密码不一致", false)
      }
      else {
        // 生成一个 账户id
        let UUIDS = UUID4();
        //01:账户保存到user数据表中
        let user = await new User({
          author: params.account,//账户
          originator: UUIDS,//账户id,
          zhuce: new Date().getTime(),// 登录时间
        }).save()

        //保存到 注册表 Register数据表中
        new Register({
          author: params.account,//账户
          password: md5(md5(params.password)),//Md5 双从加密
          originator: UUIDS,//账户id
        }).save()

        // 返回状态信息
        return GetStatus(res, 200, user, "注册成功", true);
      }
    }

  } else {
    return GetStatus(res, 201, {}, "该账户已经被注册了", false)
  }

























































})



// router.post('/api/home',async(req,res)=>{
//   res.send({
//     code:200,
//     massage:"成功返回数"
//   })
// })













module.exports = router
