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

//My Code
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