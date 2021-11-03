const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');

// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);
// const dbName = 'chat';



// var MongoClient = require('mongodb').MongoClient

// MongoClient.connect('mongodb://localhost:27017/chat', function (err, client) {
//   if (err) throw err

//   var db = client.db('chat')

//   db.collection('messages').find().toArray(function (err, result) {
//     if (err) throw err

//     console.log("result")
//   })
// })

app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

let Message = mongoose.model("Message", {
  name: String,
  message: String
})

// let messages = [
//   {name: "ismael chaquir", message: "tudo bem?"},
//   {name: "susy soares", message: "tudo bem?"}
// ]

app.get("/messages",(req,res) =>{
  Message.find({}, (err, messages) => {
    res.send(messages)
  })
});

app.post("/messages",(req,res) =>{
  let message = new Message(req.body)
  message.save((err) => {
    if (err) sendStatus(500)


    io.emit("message",req.body)
    res.sendStatus(200)

  })
  
  
});

io.on("connection",(socket)=>{
  console.log("user connected");
  socket.emit("msg:get",{ message: "hello"})
})

mongoose.connect('mongodb://localhost/chat', ()=>{
  console.log("connection successful")
});

server.listen(PORT, ()=>{
  console.log(`[+] application running on http://localhost:${PORT}`)
})
