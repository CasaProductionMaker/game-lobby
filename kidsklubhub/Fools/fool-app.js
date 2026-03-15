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
let userId;
let foolToEdit;
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

const fools = firebase.database().ref("fools");
let foolsElements = {};
let foolsD = {};
fools.on("child_added", (snapshot) => {
	const thisfool = snapshot.val();
	const key = thisfool.id;
	foolsD[key] = thisfool;

	// Create the DOM Element
	const foolEl = document.createElement("div");
	foolEl.classList.add("fool");
	let followerList = "";
	let peopleIn = 0;
	let isIn = false;

	for (let follower in thisfool.followers) {
		followerList = followerList + ", " + follower;
		peopleIn++;
		console.log(thisfool.creator)
		console.log(user)
		if(follower == user)
		{
		isIn = true;
		}
	}

	followerList = followerList.substring(2);
	foolEl.innerHTML = "<h3>" + thisfool.name + "</h3><h4>" + thisfool.creator + "</h4>" + (thisfool.creator == user ? "<button onclick='editFool(" + thisfool.id + ")'>Edit</button><button onclick='deleteFool(" + thisfool.id + ")' class='right_button'>Delete</button>" : "") + "<p>" + thisfool.desc + "</p><p>" + peopleIn + " people are in: " + followerList + "</p>" + (thisfool.creator == user ? "<button onclick='inviteFool(" + thisfool.id + ")'>Invite a Friend</button>" : "") + (thisfool.creator == user ? "" : "<button onclick='leaveFool(" + thisfool.id + ")'>Leave Fool</button>");

	if(isIn || thisfool.creator == user)
	{
		document.getElementById("fools_container").appendChild(foolEl);
		foolsElements[key] = foolEl;
	}
	if(thisfool.creator == user)
	{
		firebase.database().ref("fools/" + thisfool.id + "/followers/" + user).set(true);
	}
})

fools.on("value", (snapshot) => {
	foolsD = snapshot.val() || {};
	Object.keys(foolsD).forEach((key) => {
		const thisfool = foolsD[key];
		let el = foolsElements[key];
		let followerList = "";
		let peopleIn = 0;
		let isIn = false;
		for (let follower in thisfool.followers) {
			followerList = followerList + ", " + follower;
			peopleIn++;
			if(follower == user)
			{
				isIn = true;
			}
		}
		followerList = followerList.substring(2);
		if(isIn)
		{
			el.innerHTML = "<h3>" + thisfool.name + "</h3><h4>" + thisfool.creator + "</h4>" + (thisfool.creator == user ? "<button onclick='editFool(" + thisfool.id + ")'>Edit</button><button onclick='deleteFool(" + thisfool.id + ")' class='right_button'>Delete</button>" : "") + "<p>" + thisfool.desc + "</p><p>" + peopleIn + " people are in: " + followerList + "</p>" + (thisfool.creator == user ? "<button onclick='inviteFool(" + thisfool.id + ")'>Invite a Friend</button>" : "") + (thisfool.creator == user ? "" : "<button onclick='leaveFool(" + thisfool.id + ")' class='right_button'>Leave Fool</button>");
		}
	})
})

fools.on("child_removed", (snapshot) => {
	const obj = snapshot.val();
	document.body.removeChild(foolsElements[obj.id]);
	delete foolsElements[foolsElements[obj.id]];
})

firebase.database().ref("reloader").set({
	rl: Math.random()*Math.random()*Math.random()*Math.random()*Math.random()
});

function createFool() {
	if(document.getElementById("fname").value != "" && document.getElementById("fdesc").value != "")
	{
		const date = Date.now();
		firebase.database().ref("fools/" + date).set({
			id: date, 
			name: document.getElementById("fname").value, 
			desc: document.getElementById("fdesc").value, 
			creator: user, 
			followers: {}
		});
		document.getElementById("fname").value = "";
		document.getElementById("fdesc").value = "";
	}
}

function inviteFool(thisfool) {
	const ans = prompt("Who to invite?");
	firebase.database().ref("fools/" + thisfool + "/followers/" + ans).set(true);
}
function leaveFool(thisfool) {
  	firebase.database().ref("fools/" + thisfool + "/followers/" + user).remove();
}
function deleteFool(thisfool) {
  	firebase.database().ref("fools/" + thisfool).remove();
}
function editFool(thisfool) {
	document.querySelector("#editF").style.visibility = "visible";
	document.getElementById("ename").value = foolsD[thisfool].name;
	document.getElementById("edesc").value = foolsD[thisfool].desc;
	foolToEdit = thisfool;
}
function applyEditToFool() {
	document.querySelector("#editF").style.visibility = "hidden";
	firebase.database().ref("fools/" + foolToEdit).update({
		name: document.getElementById("ename").value, 
		desc: document.getElementById("edesc").value
	});
	document.getElementById("ename").value = "";
	document.getElementById("edesc").value = "";
}