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

let ranks = ["worker", "manager", "leader"];
const operations = firebase.database().ref("operations");
let operationsD = {};
const jokeoperations = firebase.database().ref("joke-operations");
let jokeoperationsD = {};
const messages = firebase.database().ref("chat");
let messagesD = {};
const users = firebase.database().ref("users");
let usersD = {};
operations.on("child_added", (snapshot) => {
  const thisoperation = snapshot.val();
  const key = thisoperation.id;
  operationsD[key] = thisoperation;
})
jokeoperations.on("child_added", (snapshot) => {
  const thisjokeoperation = snapshot.val();
  const key = thisjokeoperation.id;
  jokeoperationsD[key] = thisjokeoperation;
})
messages.on("child_added", (snapshot) => {
  const thismessage = snapshot.val();
  const key = thismessage.id;
  messagesD[key] = thismessage;
})
users.on("child_added", (snapshot) => {
  const thisuser = snapshot.val();
  const key = thisuser.username;
  usersD[key] = thisuser;
})
firebase.database().ref("reloader").set({
  rl: Math.random()*Math.random()*Math.random()*Math.random()*Math.random()
});

function rankup(unit) {
  let theirRank = "worker";
  let myRank = "worker";
  let tRn = 0;
  let mRn = 0;
  for(thisuser in usersD)
  {
    if(usersD[thisuser]["username"] == unit)
    {
      theirRank = usersD[thisuser]["rank"];
    }
    if(usersD[thisuser]["username"] == user)
    {
      myRank = usersD[thisuser]["rank"];
    }
  }
  for (var i = 0; i < ranks.length; i++) {
    if(ranks[i] == theirRank) tRn = i;
    if(ranks[i] == myRank) mRn = i;
  }
  if(mRn > tRn)
  {
    firebase.database().ref("users/" + unit + "/rank").set(ranks[tRn+1]);
  } else if(mRn <= tRn){
    alert("You must be above the unit to rank them down!")
  }
}
function rankdown(unit) {
  let theirRank = "worker";
  let myRank = "worker";
  let tRn = 0;
  let mRn = 0;
  for(thisuser in usersD)
  {
    if(usersD[thisuser]["username"] == unit)
    {
      theirRank = usersD[thisuser]["rank"];
    }
    if(usersD[thisuser]["username"] == user)
    {
      myRank = usersD[thisuser]["rank"];
    }
  }
  for (var i = 0; i < ranks.length; i++) {
    if(ranks[i] == theirRank) tRn = i;
    if(ranks[i] == myRank) mRn = i;
  }
  if(mRn > tRn && tRn > 0)
  {
    firebase.database().ref("users/" + unit + "/rank").set(ranks[tRn-1]);
  } else if(mRn <= tRn){
    alert("You must be above the unit to rank them down!")
  } else if(tRn <= 0){
    alert("You cannot make someone lower than a worker! What will they be? A slave?")
  }
}
function rank_gen() {
  for(thisuser in usersD)
  {
    const rankEl = document.createElement("div");
    rankEl.classList.add("person");
    let chatMessages = 0;
    let ops = 0;
    let jops = 0;
    for(message in messagesD)
    {
      if(messagesD[message]["sender"] == usersD[thisuser]["username"])
      {
        chatMessages++;
      }
    }
    for(op in operationsD)
    {
      if(operationsD[op]["creator"] == usersD[thisuser]["username"])
      {
        ops++;
      }
    }
    for(jop in jokeoperationsD)
    {
      if(jokeoperationsD[jop]["creator"] == usersD[thisuser]["username"])
      {
        jops++;
      }
    }
    rankEl.innerHTML = `
      <h3>` + usersD[thisuser]["username"] + `</h3>
      <h6>Rank: ` + usersD[thisuser]["rank"] + `</h6>
      <h6>Chat Messages: ` + chatMessages + `</h6>
      <h6>Operations: ` + ops + `</h6>
      <h6>Joke Operations: ` + jops + `</h6>
      <button onclick="rankup('` + usersD[thisuser]["username"] + `')">Rank Up</button>
      <button onclick="rankdown('` + usersD[thisuser]["username"] + `')">Rank Down</button>
    `;
    document.body.appendChild(rankEl);
  }
}
firebase.database().ref("users").once("value").then((snapshot) => {
  usersD = snapshot.val() || {};
  rank_gen();
});
