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

// Page references
const reply_info = document.getElementById("reply_info");

// Chat actions
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
		reply_info.classList.remove("replying");
	}
}

function setReplyTo(replyto, replying_to_person) {
	replytomsg = replyto;
	reply_info.classList.add("replying");
	document.getElementById("replying_to").textContent = `Replying to @${replying_to_person}`
}

function cancelReply() {
	replytomsg = null;
	reply_info.classList.remove("replying");
}

function deleteMessage(messageID) {
	const chatRef = firebase.database().ref(`chat/` + messageID);
	chatRef.remove();
}

// Chat component builders
function buildMessageOptions(msgID, showDeleteButton, messagesender) {
	return `
		<div class="message_options">
			<button onclick="setReplyTo('${msgID}', '${messagesender}')" class="message_option"><div class="reply_icon fit_icon"></div></button>
			${showDeleteButton ? `<button onclick="deleteMessage('${msgID}')" class="message_option"><div class="trash_icon fit_icon"></div></button>` : ""}
		</div>
	`;
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
let chatDOM = {};
let chatD = {};
const chat = firebase.database().ref("chat");

// Loading/updating chat
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
		messageElement.innerHTML = messageToDisplay + buildMessageOptions(thismessage.id, thismessage.sender == user, thismessage.sender);
	} else {
		if(thismessage.replyto != null)
		{
			messageElement.innerHTML = `
				<div class='reply-text'><img src='../Images/WhiteReplyLine.svg' class='reply_line'>${chatD[thismessage.replyto] != undefined ? `${chatD[thismessage.replyto].sender}: ${chatD[thismessage.replyto].message}` : "Message was deleted."}</div>
				<div class='message-name ${thisrank}'>${thismessage.sender}</div>
				${messageToDisplay}
				${buildMessageOptions(thismessage.id, thismessage.sender == user, thismessage.sender)}
			`;
		} else {
			messageElement.innerHTML = `
				<div class='message-name ${thisrank}'>${thismessage.sender}</div>
				${messageToDisplay}
				${buildMessageOptions(thismessage.id, thismessage.sender == user, thismessage.sender)}
			`;
		}
	}
	previousload = thismessage;

	// Keep a reference for removal later and add to DOM
	chatDOM[key] = chatContainer.appendChild(messageElement);
	chatContainer.scrollTop = chatContainer.scrollHeight - 100;
})

chat.on("child_removed", (snapshot) => {
	const thismessage = snapshot.val();
	const key = thismessage.id;
	delete chatD[key];
	chatContainer.removeChild(chatDOM[key]);
	delete chatDOM[key];
})

// Force reload
firebase.database().ref("reloader").set({
	rl: Math.random()*Math.random()*Math.random()*Math.random()*Math.random()
});

// Key presses
new KeyPressListener("Enter", () => sendMessage());
new KeyPressListener("KeyQ", () => {
  console.log(replytomsg)	
});