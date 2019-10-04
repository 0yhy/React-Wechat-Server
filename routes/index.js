var express = require('express');
var router = express.Router();

/* GET home page. */
//注册路由，处理get请求，
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//注册一个路由，用于register
/*
path:             /register
请求方式：        POST
接收参数：        username，password
注册成功：        {code:0, data{id: , username,  password}  }
注册失败：        {code:1, msg:"此用户已存在"}
*/
/*
回调函数
1. 获取参数
2. 处理
3. 返回响应数据
*/
router.post("/register", function(req, res) {
  //1. 获取请求参数
  const {username, password} = req.body;
  //2. 处理
  if(username === "admin") {
    res.send({code:1, msg:"此用户已存在"})
  }
  else {
    res.send({code:0, data:{id: "abc123", username, password}})
  }
})

module.exports = router;
