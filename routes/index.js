var express = require('express');
var router = express.Router();

const md5 = require("blueimp-md5");
const {UserModel, ChatModel, CircleModel} = require("../db/models");
const filter = {password: 0, __v: 0};//过滤指定属性（这里为密码和自带的_v）

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/register', function(req, res, next) {
  res.render('index', { title: 'Register' });
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
  const {username, password} = req.body;
  //用户是否存在？
  UserModel.findOne({username}, function(err, user) {
    if(user) {//如果user存在
      res.send({code: 1, msg: "Username Existed!"});
    }
    else {
      new UserModel({username, password:md5(password)}).save(function(err, user) {
        // 生成cookie，交给浏览器保存，实现自动登录
        console.log("user", user._id);
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
  console.log({username, password:md5(password)});

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

//获取通讯录的路由
router.get("/contact", function(req, res) {
  UserModel.find({}, function(err, users) {
    res.send({code: 0, data: users})
  })
})

//获取消息列表
router.get("/msglist", function(req, res) {
  const userid = req.cookies.userid;
  UserModel.find(function(err, userDocs) {
    //对象容器存储
    const users = {};
    userDocs.forEach(item => {
      // console.log(item);
      users[item._id] = {username: item.username}
    })
    //查询userid相关的聊天信息:from是userid or to是userid
    ChatModel.find({"$or": [{from: userid}, {to: userid}]}, filter, function(err, chatMsgs) {//返回的为聊天消息的数组
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })

})
//标记消息为已读
router.post("/readmsg", function(req, res) {
  const from = req.body.from;
  const to = req.cookies.userid;
  //1. 查询条件
  //2. 更新为指定的数据对象
  //3. 是否一次更新多条
  ChatModel.update({from, to, read: false}, {read:true}, {multi: true}, function(err, doc) {
    res.send({code: 0, data: doc.nModified});//更新的数量
  })
})


//获取用户信息
router.get("/user", function(req, res) {
  const userid = req.cookies.userid;
  if(!userid) {
    return res.send({code:1, msg:"请先登录"});
  }
  UserModel.findOne({_id: userid}, filter, function(err, user) {
    return res.send({code:0, data: user})
  })
})

//获取朋友圈
router.get("/circle", function(req, res) {
  UserModel.find(function(err, userDocs) {
    //对象容器存储
    const users = {};
    userDocs.forEach(item => {
      // console.log(item);
      users[item._id] = {username: item.username}
    })
    //查询userid相关的聊天信息:from是userid or to是userid
    CircleModel.find(function(err, circleMsgs) {//返回的为聊天消息的数组
      res.send({code: 0, data: {users, circleMsgs}})
    })
  })
})
module.exports = router;
