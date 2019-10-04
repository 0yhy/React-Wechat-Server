//1. 连接数据库
//引入mongoose
const mongoose = require("mongoose");
//使用引入模块的方法 连接指定数据库
mongoose.connect("mongodb://localhost:27017/db_test")
//获取连接对象
const conn = mongoose.connection;
//绑定连接完成的监听
conn.on("connected", function() {
    console.log("数据库连接成功，✌")
})