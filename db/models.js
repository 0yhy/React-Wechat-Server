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