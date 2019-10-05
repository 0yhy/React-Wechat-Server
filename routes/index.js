var express = require('express');
var router = express.Router();

const md5 = require("blueimp-md5");
const {UserModel} = require("../db/models");
const filter = {password: 0, __v: 0};//过滤指定属性（这里为密码和自带的_v）

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
  const {username, password} = req.body;
  //用户是否存在？
  UserModel.findOne({username}, function(err, user) {
    if(user) {//如果user存在
      res.send({code: 1, msg: "Username Existed!"});
    }
    else {
      new UserModel({username, password:md5(password)}).save(function(err, user) {
        //生成cookie，交给浏览器保存，实现自动登录
        res.cookie("userid", user._id, {maxAge: 10000*60*60*24})
        const data = {username, _id:user._id};//密码不要传给前台，传一个id
        res.send({code: 0, data});
      })
    }
  })
})

//登录的路由
router.post("/login", function(req, res) {
  const {username, password} = req.body;
  UserModel.findOne({username, password:md5(password)}, filter, function(err, user) {
    if(user) {
      res.cookie("userid", user._id, {maxAge:1000*60*60*24});
      res.send({code: 0, data: user});
    }
    else {
      res.send({code: 1, msg: "Incorrect USERNAME or PASSWORD!"});
    }
  })
})

module.exports = router;
