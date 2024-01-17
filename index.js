/* 
For the encrypt/decrypt function:

MIT License

Copyright (c) 2018 CrypTools

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const randomstring = require("randomstring");
const express = require("express");
const bodyParser = require("body-parser");
const key = process.env["SECRET_KEY"];
const Database = require("replpersist");
const users = new Database("users");
const EIGHT_HOURS = 280000000;
const appFiller = require("./app.filler.js")
const e = require("./encrypt.js")
const debateFiller = require("./debate.filler.js")

const vercelAnalytics = require("@vercel/analytics")
console.log(vercelAnalytics)
vercelAnalytics.inject()

String.prototype.encrypt = e

let app = express();
let mapSessionIDs = {};
let openChatRooms = [];
let chatRooms = {};
let reports = []

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signup.html", (req, res) => {
  if (req.body.formtype === "signup") {
    if (users.data[req.body.username] !== undefined) {
      res.redirect("/signup.html?err=0");
    } else {
      users.data[req.body.username] = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password.encrypt(key),
				chatRooms: [],
				bio: null,
				totalDebates: 0,
				wins: 0,
				losses: 0,
				winStreak: 0,
				favoriteTopic: null,
				achievements: []
      };
      res.redirect("/?mes=0");
    }
  } else if (req.body.formtype === "login") {
    if (users.data[req.body.username] == undefined) {
      console.log(users.data);
      res.redirect("/signup.html?err=1");
    } else if (
      users.data[req.body.username].password !== req.body.password.encrypt(key)
    ) {
      res.redirect("/signup.html?err=2");
    } else {
      var sessionID = randomstring.generate(25);
      users.data[req.body.username].currentSessionID = sessionID;

      res.redirect("/app?sessionID=" + sessionID);
      mapSessionIDs[sessionID] = req.body.username;
      users.data[req.body.username].expireTime =
        new Date().getTime() + EIGHT_HOURS;
    }
  }
});

app.get("/app", (req, res) => {
  const sessionID = req.query.sessionID;
  let user = {};
  // for (each in users.data) {
  // 	if (users.data[each].currentSessionID == sessionID) {
  // 		username = each
  // 		user = users.data[username]
  // 		userFound = true;
  // 	}
  // }
  user = users.data[mapSessionIDs[sessionID]];
  if (user.expireTime < new Date().getTime()) {
    res.send("Session not found. <a href='/'>Go Home</a>");
  } else {
    for (each in user.achievements) {
      user.achievementsHTML += `<div class="achievement">${user.achievements[each].textName}<img src="/achievements/${user.achievements[each].imageName}"></div>`;
    }
    res.send(appFiller(user));
  }
});

app.get("/startdebate", (req, res) => {
  var user = users.data[mapSessionIDs[req.query.sessionID]];
  if (openChatRooms.length == 0) {
    debateID = randomstring.generate(25);
    chatRooms[debateID] = {
      debateID: debateID,
      topic: "No topic yet!",
      users: [user.username],
      messages: [],
    };
    openChatRooms.push(debateID);
    users.data[mapSessionIDs[req.query.sessionID]].chatRooms.push(debateID);
		res.redirect("/waitingroom/" + debateID + "?sessionID=" + req.query.sessionID)
  } else {
    var chatRoomTaken = Math.floor(Math.random() * openChatRooms.length);
    users.data[mapSessionIDs[req.query.sessionID]].chatRooms.push(
      openChatRooms[chatRoomTaken]
    );
    chatRooms[openChatRooms[chatRoomTaken]].users.push(user.username);
		chatRooms[openChatRooms[chatRoomTaken]].chat = []
		chatRooms[openChatRooms[chatRoomTaken]].ready = true;
		res.redirect("/chat/" +openChatRooms[chatRoomTaken] + "?sessionID=" + req.query.sessionID);
		openChatRooms.splice(chatRoomTaken, 1);
  }
});

app.get("/waitingroom/:debateID", (req, res) => {
	if (chatRooms[req.params.debateID].ready == true) {
		res.redirect("/chat/" + req.params.debateID + "?sessionID=" + req.query.sessionID)
	} else {
		res.send("Waiting on another person to join your room. Refresh page periodically to check if the room is ready.")
	}
})

app.get("/chat/:debateID", (req, res) => {
	if (chatRooms[req.params.debateID].ready == false) {
		res.send(`This room is not ready; please <a href='/app?sessionID=${req.query.sessionID}'>go back</a> and wait for a partner to join.`)
	} else {
		res.send(debateFiller(req, JSON.stringify(chatRooms[req.params.debateID].chat), req.params.debateID, req.query.sessionID))
	}
});

app.post("/chat/:debateID", (req, res)=>{
	chatRooms[req.params.debateID].chat.push([req.body.message, users.data[mapSessionIDs[req.body.user]].username])
	res.redirect("/chat/" + req.params.debateID + "?sessionID=" + req.query.sessionID)
})

app.get("/report", (req, res)=>{
	
})

app.get("/getchat/:debateID", (req, res)=>{
	var accessDenied = true;
	for (each in chatRooms[req.params.debateID].users) {
		if (chatRooms[req.params.debateID].users[each] == mapSessionIDs[req.query.sessionID]) {
			accessDenied = false;
		}
	}
	if (accessDenied == true) {
		res.json({code: 1, contents: "Access denied."})
	} else {
		res.json({code: 0, contents: chatRooms[req.params.debateID]})
	}
})

app.listen(3000);

// Hello from outer space (aka Android Studio/IntelliJ)