const firebaseConfig = {
	apiKey: "AIzaSyBTFGg_9ITdXiqUIklFg7u6qWzfSiVnfTc",
	authDomain: "kidsklubchat.firebaseapp.com",
	databaseURL: "https://kidsklubchat-default-rtdb.firebaseio.com",
	projectId: "kidsklubchat",
	storageBucket: "kidsklubchat.appspot.com",
	messagingSenderId: "173944093629",
	appId: "1:173944093629:web:b4c99ad053bc77d8adf0d4"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Links and loading
let user = localStorage.getItem("username");
let saveUser = false;
if(user == "null")
{
  window.location.href = "../Login/index.html";	
}
function loadHomepage() {
	saveUser = true;
	console.log(saveUser)
	window.location.href = "../Home/index.html";
}
function logUserOut() {
	localStorage.setItem("username", "null");
	window.location.href = "../Login/index.html";
}
window.addEventListener('beforeunload', (event) => {
  if(!saveUser)
  {
    localStorage.setItem("username", "null");
    event.returnValue = '';
  }
});

// Chat data
let replytomsg = null;
let previousload = {sender: "blub"};

// Chat component builders
function buildMessageOptions(replyto) {
	return `
		<div class="message_options">
			<button onclick='replytomsg = ${replyto}' class='reply-button'>Reply</button>
		</div>
	`;
}


// Attempt send message
function sendMessage() {
  if(document.querySelector("#bottom-bar").querySelector("#chat_input").value != "")
  {
    const date = Date.now();
    const chatRef = firebase.database().ref(`chat/` + date);
    chatRef.set({
      message: document.querySelector("#bottom-bar").querySelector("#chat_input").value, 
      id: date, 
      sender: user, 
      replyto: replytomsg
    })
    document.querySelector("#bottom-bar").querySelector("#chat_input").value = "";
    replytomsg = null;
  }
}

// Database stuff to prepare
let usersD = firebase.database().ref("users");
const users = firebase.database().ref("users");
users.on("child_added", (snapshot) => {
	const thisuser = snapshot.val();
	const key = thisuser.username;
	usersD[key] = thisuser;
})
firebase.database().ref("reloader").set({
  	rl: Math.random()*Math.random()*Math.random()*Math.random()*Math.random()
});

// References
const chatContainer = document.querySelector("#chat-container");
let chatD = firebase.database().ref("chat");
const chat = firebase.database().ref("chat");

chat.on("child_added", (snapshot) => {
	const thismessage = snapshot.val();
	const key = thismessage.id;
	chatD[key] = thismessage;
	let messageToDisplay = thismessage.message;

	// Create the DOM Element
	const messageElement = document.createElement("div");
	messageElement.classList.add("Message");

	// Mentions
	if(thismessage.message.indexOf("@" + user) > -1)
	{
		messageElement.classList.add("Mention");
	}
	if(thismessage.message.indexOf("@everyone") > -1)
	{
		messageElement.classList.add("Mention");
		messageToDisplay = `
			${messageToDisplay.slice(0, thismessage.message.indexOf("@everyone"))}
			<span class='mention-text'>@everyone</span>
			${messageToDisplay.slice(thismessage.message.indexOf("@everyone") + 9)}
		`;
	}

	// What..?
	let thisrank = "worker";
	for (let auser in usersD) {
		if(usersD[auser]["username"] == thismessage.sender)
		{
			thisrank = usersD[auser]["rank"];
		}
		if(thismessage.message.indexOf("@" + auser) > -1)
		{
			messageToDisplay = `
			${messageToDisplay.slice(0, messageToDisplay.indexOf("@" + auser))}
			<span class='mention-text'>${messageToDisplay.slice(messageToDisplay.indexOf("@" + auser), messageToDisplay.indexOf("@" + auser) + auser.length + 1)}</span>
			${messageToDisplay.slice(messageToDisplay.indexOf("@" + auser) + auser.length + 1)}`;
		}
	}

	// Generate HTML
	if(previousload.sender == thismessage.sender && thismessage.replyto == null) {
		messageElement.innerHTML = messageToDisplay + buildMessageOptions(thismessage.id);
	} else {
		if(thismessage.replyto != null)
		{
			messageElement.innerHTML = `
				<div class='reply-text'><img src='../Images/ReplyLine.svg' class='reply_line'>${chatD[thismessage.replyto].sender}: ${chatD[thismessage.replyto].message}</div>
				<div class='message-name ${thisrank}'>${thismessage.sender}</div>
				${messageToDisplay}
				${buildMessageOptions(thismessage.id)}
			`;
		} else {
			messageElement.innerHTML = `
				<div class='message-name ${thisrank}'>${thismessage.sender}</div>
				${messageToDisplay}
				${buildMessageOptions(thismessage.id)}
			`;
		}
	}
	previousload = thismessage;

	// Keep a reference for removal later and add to DOM
	chatContainer.appendChild(messageElement);
	chatContainer.scrollTop = chatContainer.scrollHeight;
})
firebase.database().ref("reloader").set({
	rl: Math.random()*Math.random()*Math.random()*Math.random()*Math.random()
});

new KeyPressListener("Enter", () => sendMessage());
new KeyPressListener("KeyQ", () => {
  console.log(replytomsg)	
});