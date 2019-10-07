const {ChatModel, CircleModel} = require("../db/models");
module.exports = function(server) {
    const io = require("socket.io")(server);
    //监视客户端与服务器的链接
    io.on("connection", function(socket) {
        console.log("有一个客户端连接上了服务器！")
        //绑定监听，接收客户端发送的消息
        socket.on("sendMsg", function({from, to, content}) {
            console.log("服务器接收到客户端发送的消息：", {from, to, content});
            //处理数据：保存消息
                //加入chat_id, create_time
            //chat_id保证两个人之间的对话一定是恒定的
            const chat_id = [from, to].sort().join("_");
            const create_time = Date.now();
            new ChatModel({from, to, content, chat_id, create_time}).save(function(err, chatMsg) {
                //向所有连接上的的客户端发（不太好）
                io.emit("receiveMsg", chatMsg)
            });
        })
        socket.on("sendCircle", function({user, content}) {
            console.log("我收到了circle！");
            console.log({user, content});
            new CircleModel({user, content}).save(function(err, circleMsg) {
                //向所有连接的的客户端发送这个CircleModel
                io.emit("receiveCircle", circleMsg);
            });
        })
    })
}