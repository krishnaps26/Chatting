const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    message : {
        type : String,
        required : [true, "message is required"]
    },
    room : {
        type : String,
        required : [true, "room is required"]
    },
    sender : {
        type : String,
        required : [true, "sender is required"]
    }
})

const message = mongoose.model("message",messageSchema)

module.exports = message



















