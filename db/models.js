const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/wechat";
mongoose.connect(url);
const conn = mongoose.connection;
conn.on("connected", () => {
    console.log("yes")
})

const userSchema = mongoose.Schema({
    username:   {type: String, required: true},
    password:   {type: String, required: true}
})
const UserModel = mongoose.model("user", userSchema);
exports.UserModel = UserModel;


const chatSchema = mongoose.Schema({
    from:       {type: String, required: true},
    to:         {type: String, required: true},
    chat_id:    {type: String, required: true},
    content:    {type: String, required: true},
    read:       {type: Boolean, default: false},
    create_time:{type: Number}//用于排序
})
const ChatModel = mongoose.model("chat", chatSchema);
exports.ChatModel = ChatModel;
