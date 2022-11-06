const jwt = require("jsonwebtoken");
//撒盐，加密时候混淆
const secret = '161456555646699637'

//生成token
//info也就是payload是需要存入token的信息
function createToken(info) {
  let token = jwt.sign(info, secret, {
    //Token有效时间 单位s
    // expiresIn: 5 * 5
    expiresIn: 2 * 60 * 60 * 60
  })
  return token; 
}

//验证Token
//返回是是promise对象
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, result) => {
      if (error) {
        return reject("登录状态失效了")
      } else {
        return resolve(result)
      }
    })
  })
}






module.exports = {
  createToken,
  verifyToken,
}