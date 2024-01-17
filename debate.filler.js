module.exports = (req, chat, debateID, sessionID)=>{
	return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
	<nav id="topnavbar"><button id=report>Report user</button><button onclick="window.location.reload()">Refresh chat</button></nav>
 <div id="report" class=float>
 	<form action="/report" method="get">
		<select name="why">
	 		<option>Profanity</option>
		 	<option>Spam</option>
		 	<option>Misuse of app</option>
		 	<option>Other</option>
	 	</select> 
	 <textarea name="description" placeholder="Describe what the other person is doing."></textarea>
	<input type="hidden" name="chat" value="${debateID}"/>
	 <input type="submit" value="Submit">
	</form>
 </div>
    <div id="leftfacts"></div>
    <div id="chat">
			
		</div>
    <div id="rightfacts" ></div>
    <div id="message"><form action="#" method=post>
			<input type="text" name="message">
			<input type="hidden" name="user" value="${req.query.sessionID}">
			<input type="submit" value="-->">
		</form></div>
	<script>
 setInterval(loadChat, 500) 
 function loadChat() {
	 let xhttp = new XMLHttpRequest();
	let chat = []
	  xhttp.onload = function() {
 document.querySelector("#chat").innerHTML = ""
	    for (each in this.responseText) {
 		document.querySelector("#chat").innerHTML += "<p id='" + each + "'><strong>" + JSON.parse(this.responseText)["contents"]["chat"][each][1] + "</strong>: " + JSON.parse(this.responseText)["contents"]["chat"][each][0] + "</p><br>"
	}
	    }
	  	xhttp.open("GET", "https://median.anthonymouse.repl.co/getchat/${debateID}?sessionID=${sessionID}", true);
	  xhttp.send();

	
	}
	</script>
  </body>
</html>
`
}