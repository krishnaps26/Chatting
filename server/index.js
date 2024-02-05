const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const Message = require("./models/message");

dotenv.config({ path: "./../config.env" });

// connection establishment
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", path);
        process.exit(1);
    });

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected : ${socket.id}`);

    //to join the room using room Id
    socket.on("join_room", (data) => {
        socket.join(data);

    // fetching message history of the same room id from the database
        Message
            .find({ room: data })
            .then((messages) => {
                // console.log(typeof(messages))
                socket.emit("chat_history", messages);
            })
            .catch((err) => {
                console.log(err);
            });
        });

    // Sending messages to the client side 
    socket.on("send_message", (data) => {
    //initializing new message in a newMessage variable
        const newMessage = new Message({
            message: data.message,
            room: data.room,
            sender: socket.id,
        });

        //Saving new message in the database
        newMessage.save().then(() => {
            socket.to(data.room).emit("receive_message", {
        message: data.message,
        sender: socket.id,
        room: data.room,
            });
        });
    });
});

server.listen(3000, () => {
  console.log("server is listening at port 3000");
});
