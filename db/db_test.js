const md5 = require("blueimp-md5");

/* 1. 连接数据库 */
//引入mongoose
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/db_test";
//使用引入模块的方法 连接指定数据库
mongoose.connect(url);
//获取连接对象
const conn = mongoose.connection;
//绑定连接完成的监听
conn.on("connected", function() {
    console.log("( •̀ ω •́ )✌");
})

/* 2.得到 对应特定集合的model */

//描述文档结构：字义schema（约束）
const userSchema = mongoose.Schema({//属性值类型/是否必须
    username: {type:String, required:true},
    password: {type:String, required:true},
})
//定义model（与集合对应，可以操作集合）
const UserModel = mongoose.model("user", userSchema);//参数“user”即决定了集合的名称为users

/* 3.通过Model或其实例对集合数据进行增删查改操作 */
//save()
function testSave() {
    const userModel = new UserModel({username: "Shaun", password: md5("123")});
    userModel.save(function(err, user) {//回调函数：err/包含user信息的文档对象
        console.log(err, user);
    })
}
// testSave();

//find()
function testFind() {
    //查询多个
    UserModel.find(function(err, users) {//users:数组
        console.log(err, users);
    })
    //查询一个
    UserModel.find({username:"Shaun"}, function(err, user) {
        console.log(err, user);
    })
}
// testFind();

//update()
function testUpdate() {
    UserModel.findByIdAndUpdate({_id: "5d97e2f0e1bd3620b88dc966"}, {username:"Jack"}, function(err, oldUser) {
        console.log("update()", err, oldUser);
    })
}
// testUpdate();

//del()
function testDelete() {
    UserModel.remove({_id: "5d97e2f0e1bd3620b88dc966"}, function(err, doc) {
        console.log(err, doc);
    })
}
testDelete();