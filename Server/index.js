"use strict";

var fs = require("fs");
var express = require("express");
var app = express();

//Mailing
const nodemailer = require("nodemailer");
const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

var https = require("https");
var server = https.createServer(
  {
    key: fs.readFileSync("/etc/letsencrypt/live/hubandrock.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/hubandrock.com/cert.pem"),
    ca: fs.readFileSync("/etc/letsencrypt/live/hubandrock.com/chain.pem"),
    requestCert: false,
    rejectUnauthorized: false,
  },
  app
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Content-Type", "application/json");

  if (req.method == "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

server.listen(3000, () => {
  console.log("Socket.io server is listening on port 3000");
});

app.post("/newsletter", function (req, res) {
  const email = req.body.email;
  let apiKey = process.env.SIB_API_KEY;

  // auth + setup
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let api_Key = defaultClient.authentications["api-key"];
  api_Key.apiKey = apiKey;

  // create contact
  let apiInstance = new SibApiV3Sdk.ContactsApi();
  let createContact = new SibApiV3Sdk.CreateContact();
  createContact.email = email;
  createContact.listIds = [2];

  // call sib api
  apiInstance.createContact(createContact).then(
    (data) => {
      // success
      res.send({
        data: "success",
      });
    },
    function (error) {
      res.send({
        data: "error",
      });
    }
  );
});

app.post("/enviarContact", function (req, res) {
  const transporter = nodemailer.createTransport({
    host: "smtp.dondominio.com",
    port: 587,
    auth: {
      user: "contact@hubandrock.com",
      pass: "Hubandrock2021.",
    },
  });

  const mailOptions = {
    from: "contact@hubandrock.com",
    to: "contact@hubandrock.com",
    subject: `<${req.body.correu_electronic}> ${req.body.nom_cognoms} - ${req.body.nom_empresa}`,
    text: req.body.missatge,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send({
        data: "error",
      });
    } else {
      console.log("Correu enviat " + info.response);
      res.send({
        data: "success",
      });
    }
  });

  console.log("Data recieved: ");
  console.log(
    req.body.nom_cognoms +
      ", " +
      req.body.nom_empresa +
      ", " +
      req.body.correu_electronic +
      ", " +
      req.body.missatge
  );
});

var io = require("socket.io")(server, {
  cors: {
    origin: "https://hubandrock.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

var users = [];
var commonRoomName;

io.on("connection", function (socket) {
  console.log("A user connected!");

  socket.on("common_room", function (commonRoomName) {
    socket.join(commonRoomName);
    this.commonRoomName = commonRoomName;
    console.log("New person joined on " + this.commonRoomName);
  });

  //Append new user to userList
  socket.on("user_connected", function (roomId) {
    if (!users.includes(roomId)) {
      users.push(roomId);
    }

    socket.join(roomId);

    console.log("ACTIVE SOCKETS:");
    console.log(socket.rooms);

    io.emit("user_connected", users);
  });

  socket.on("send_message", function (data) {
    io.sockets.in(data.roomId).emit("new_message", data);
    io.sockets.in(this.commonRoomName).emit("new_message_commonRoom", data);
    // socket.broadcast.to(sendTo).emit('new_message', data);
  });

  socket.on("user_disconnected", function (roomId) {
    console.log("ROOM QUE VOLEM ELIMINAR: " + roomId);
    function arrayRemove(arr, value) {
      return arr.filter(function (ele) {
        return ele != value;
      });
    }
    users = arrayRemove(users, roomId);
    socket.leave(roomId);

    io.emit("user_disconnected", users);
    console.log("USER LIST:", users);
  });
});
