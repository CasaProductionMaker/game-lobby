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
let user = document.getElementById("userI");
let pass = document.getElementById("passI");

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
function Login()
{
	Object.keys(usersD).forEach((key) => {
		const thisuser = usersD[key];
		if(user.value == thisuser.username && pass.value == thisuser.password)
		{
			localStorage.setItem("username", thisuser.username);
			window.location.href = "../Home/index.html";
		}
	})
}