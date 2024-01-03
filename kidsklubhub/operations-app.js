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
if(user == "null")
{
  window.location.href = "index.html"
}
function logUserOut() {
  localStorage.setItem("username", "null");
  window.location.href = "index.html"
}

window.addEventListener('beforeunload', (event) => {
  localStorage.setItem("username", "null");
  event.returnValue = '';
});

const operations = firebase.database().ref("operations");
let operationsD = {};
operations.on("child_added", (snapshot) => {
  const thisoperation = snapshot.val();
  const key = thisoperation.id;
  operationsD[key] = thisoperation;

  // Create the DOM Element
	const operationEl = document.createElement("div");
	operationEl.classList.add("operation", "col-lg-5");
	operationEl.innerHTML = "<h3>" + thisoperation.name + "</h3><h4>" + thisoperation.creator + "</h4><p>" + thisoperation.desc + "</p><button onclick='joinOperation(" + thisoperation.id + ")'>I'm In!</button>";

  document.body.appendChild(operationEl);
})
firebase.database().ref("reloader").set({
  rl: Math.random()*Math.random()*Math.random()*Math.random()*Math.random()
});

function createOperation() {
	const date = Date.now();
	firebase.database().ref("operations/" + date).set({
		id: date, 
		name: document.getElementById("opname").value, 
		desc: document.getElementById("opdesc").value, 
		creator: user, 
		followers: {}
	});
}

function joinOperation(thisoperation) {
  firebase.database().ref("operations/" + thisoperation + "/followers/" + user).set(true);
}