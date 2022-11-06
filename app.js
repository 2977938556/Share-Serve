//导入模块
let express = require('express')
let path = require('path')
let app = express()
const { verifyToken } = require('./utils/token');





//开放静态资源文件
app.use('/public/upload', express.static(path.join(__dirname, '/public/upload')))
app.use('/public/bgcUrl', express.static(path.join(__dirname, '/public/bgcUrl')))
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));


//配置获取post请求体
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }))



//白名单
let whiteList = ["/api/logindata", "/api/registerdata",];



app.use((req, res, next) => {
  if (!whiteList.includes(req.url)) {
    //这里是判断token是否有效
    verifyToken(req.headers.authorization || "").then(res => {
      next()
      //出现了报错那颗就返回参数让其登录
    }).catch(e => {
      return res.send({
        code: 401,
        massage: "登录过期，请重新登录",
        state: false,
      })
    })
  } else {
    next()
  }
})



// 注册路由
let login = require('./router/login')//登录
let register = require('./router/register')//注册
let upload = require('./router/upload')//上传 作品
let home = require('./router/home')// 首页数据
let detail = require('./router/detail')// 详情数据
let user = require('./router/user');//个人中心数据
let edituser = require('./router/edituser')// 个人信息更改
let search = require('./router/search')// 搜索页面


app.use(login)
app.use(register)
app.use(upload)
app.use(home)
app.use(detail)
app.use(user)
app.use(edituser)
app.use(search)




// 设置端口
app.listen(8848, () => {
  console.log("调用了")
})


