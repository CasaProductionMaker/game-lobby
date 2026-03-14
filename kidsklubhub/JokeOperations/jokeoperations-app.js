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
  window.location.href = "index.html";
}
function loadHomepage() {
  saveUser = true;
  console.log(saveUser)
  window.location.href = "homepage.html";
}
function logUserOut() {
  localStorage.setItem("username", "null");
  window.location.href = "index.html";
}

window.addEventListener('beforeunload', (event) => {
  if(!saveUser)
  {
    localStorage.setItem("username", "null");
    event.returnValue = '';
  }
});

const operations = firebase.database().ref("joke-operations");
let operationsElements = {};
let operationsD = {};
operations.on("child_added", (snapshot) => {
  const thisoperation = snapshot.val();
  const key = thisoperation.id;
  operationsD[key] = thisoperation;

  // Create the DOM Element
	const operationEl = document.createElement("div");
	operationEl.classList.add("operation", "col-lg-5");
  let followerList = "";
  let peopleIn = 0;
  for (let follower in thisoperation.followers) {
    followerList = followerList + ", " + follower;
    peopleIn++;
  }
  followerList = followerList.substring(2);
	operationEl.innerHTML = "<h3>" + thisoperation.name + "</h3><h4>" + thisoperation.creator + "</h4>" + (thisoperation.creator == user ? "<button onclick='deleteOperation(" + thisoperation.id + ")'>Delete</button>" : "") + "<p>" + thisoperation.desc + "</p><p>" + peopleIn + " people are in: " + followerList + "</p><button onclick='joinOperation(" + thisoperation.id + ")'>I'm In!</button><button onclick='leaveOperation(" + thisoperation.id + ")'>I'm Out!</button>";

  document.body.appendChild(operationEl);
  operationsElements[key] = operationEl;
})

operations.on("value", (snapshot) => {
  operationsD = snapshot.val() || {};
  Object.keys(operationsD).forEach((key) => {
    const thisoperation = operationsD[key];
    let el = operationsElements[key];
    let followerList = "";
    let peopleIn = 0;
    for (let follower in thisoperation.followers) {
      followerList = followerList + ", " + follower;
      peopleIn++;
    }
    followerList = followerList.substring(2);
    el.innerHTML = "<h3>" + thisoperation.name + "</h3><h4>" + thisoperation.creator + "</h4>" + (thisoperation.creator == user ? "<button onclick='deleteOperation(" + thisoperation.id + ")'>Delete</button>" : "") + "<p>" + thisoperation.desc + "</p><p>" + peopleIn + " people are in: " + followerList + "</p><button onclick='joinOperation(" + thisoperation.id + ")'>I'm In!</button><button onclick='leaveOperation(" + thisoperation.id + ")'>I'm Out!</button>";
  })
})

operations.on("child_removed", (snapshot) => {
  const obj = snapshot.val();
  document.body.removeChild(operationsElements[obj.id]);
  delete operationsElements[operationsElements[obj.id]];
})

firebase.database().ref("reloader").set({
  rl: Math.random()*Math.random()*Math.random()*Math.random()*Math.random()
});

function createOperation() {
  if(document.getElementById("opname").value != "" && document.getElementById("opdesc").value != "")
  {
  	const date = Date.now();
  	firebase.database().ref("joke-operations/" + date).set({
  		id: date, 
  		name: document.getElementById("opname").value, 
  		desc: document.getElementById("opdesc").value, 
  		creator: user, 
  		followers: {}
  	});
    document.getElementById("opname").value = "";
    document.getElementById("opdesc").value = "";
  }
}

function joinOperation(thisoperation) {
  firebase.database().ref("joke-operations/" + thisoperation + "/followers/" + user).set(true);
}
function leaveOperation(thisoperation) {
  firebase.database().ref("joke-operations/" + thisoperation + "/followers/" + user).remove();
}

function deleteOperation(thisoperation) {
  firebase.database().ref("joke-operations/" + thisoperation).remove();
}