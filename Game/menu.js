// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDBKwQRTu3xsHZjuzW3TFZFdHlGwbhttqY",
  authDomain: "test-game-eba29.firebaseapp.com",
  databaseURL: "https://test-game-eba29-default-rtdb.firebaseio.com",
  projectId: "test-game-eba29",
  storageBucket: "test-game-eba29.firebasestorage.app",
  messagingSenderId: "118728291028",
  appId: "1:118728291028:web:3f0a0dc3ee48dbcb304141"
};
const app = firebase.initializeApp(firebaseConfig);

// Before running setup
if(localStorage.getItem("TheBattleUser") == null)
{
  window.location.href = "login.html";
} // Go back if not logged in
localStorage.removeItem("TheBattleGame"); // Reset game
window.addEventListener('beforeunload', (event) => {
  if(waitingForJoin)
  {
    firebase.database().ref("games/" + gameCode).remove();
  }
});

// Return Functions
function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function createName() {
  const prefix = randomFromArray([
    "COOL",
    "SUPER",
    "HIP",
    "SMUG",
    "SILKY",
    "GOOD",
    "SAFE",
    "DEAR",
    "DAMP",
    "WARM",
    "RICH",
    "LONG",
    "DARK",
    "SOFT",
    "BUFF",
    "DOPE",
    "UNCOOL",
    "GODLY",
    "OP",
    "POOR",
    "THE",
  ]);
  const animal = randomFromArray([
    "BEAR",
    "DOG",
    "CAT",
    "FOX",
    "LAMB",
    "LION",
    "BOAR",
    "GOAT",
    "VOLE",
    "SEAL",
    "PUMA",
    "MULE",
    "BULL",
    "BIRD",
    "BUG",
    "MONKEY",
    "DRAGON",
    "ANT",
    "SNAKE",
  ]);
  return `${prefix} ${animal}`;
}
function generateGameCode() {
  let code = "";
  for (var i = 0; i < 5; i++) {
    code = code + randomFromArray(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
  }
  return code;
}

//Variables
let gameCode = null;
let name;
let loadImgRot = 0;
let waitingDots = 1;
let toolTips = ["Use bomb knockback to knock others off the platform!", "Blue bombs not only create bigger explosions but do more damage!", "Armor reduction is increased for projectiles.", "If you see a health power up, save it for when you actually need it."];
let toolTip = randomFromArray([0, toolTips.length-1]);
let waitingForJoin = false;
const playerNameInput = document.querySelector("#player-name");
let skinNum = 1;
let stats = {}

if(localStorage.getItem("TheBattleName") == null)
{
	localStorage.setItem("TheBattleName", createName());
} // Set name if there is none
name = localStorage.getItem("TheBattleName"); // Set name variable
playerNameInput.value = name; // Set player name input
let gamesRef = {};

firebase.database().ref("games").once("value").then((snapshot) => {
  gamesRef = snapshot.val() || {};
});
firebase.database().ref("users").once("value").then((snapshot) => {
  tempusers = snapshot.val() || {};
  myUser = tempusers[localStorage.getItem("TheBattleUser")];
  skinNum = myUser.skin;
  if(skinNum == undefined) skinNum = 1;
  document.querySelector(".skin").style.background = "url(images/playerSkins/" + skinNum + ".png)";
  localStorage.setItem("TheBattleSkin", skinNum)
  if(myUser == null || myUser == undefined) {
    window.location.href = "login.html";
  }

  if(myUser.stats == undefined)
  {
    firebase.database().ref("users/" + localStorage.getItem("TheBattleUser") + "/stats/totalWins").set(0);
    firebase.database().ref("users/" + localStorage.getItem("TheBattleUser") + "/stats/totalLosses").set(0);
  } else {
    if(myUser.stats.totalWins == undefined)
    {
      firebase.database().ref("users/" + localStorage.getItem("TheBattleUser") + "/stats/totalWins").set(0);
    }
    if(myUser.stats.totalLosses == undefined)
    {
      firebase.database().ref("users/" + localStorage.getItem("TheBattleUser") + "/stats/totalLosses").set(0);
    }
  }
  stats = myUser.stats;
});
firebase.database().ref("games").on("value", (snapshot) => {
  //change
  gamesRef = snapshot.val() || {};
  if(waitingForJoin)
  {
    Object.keys(gamesRef[gameCode].playerlist).forEach((key) => {
      if(key != localStorage.getItem("TheBattleUser"))
      {
        waitingForJoin = false;
        window.location.href = "game.html";
      }
    })
  }
})

//Code
playerNameInput.addEventListener("change", (e) => {
  const newName = e.target.value || createName();
  playerNameInput.value = newName;
  name = newName;
  localStorage.setItem("TheBattleName", newName);
  if(gameCode != null) firebase.database().ref("games/" + gameCode + "/playerlist/" + localStorage.getItem("TheBattleUser")).set(name);
})

function createGame() {
  gameCode = generateGameCode();
  firebase.database().ref("games/" + gameCode + "/playerlist/" + localStorage.getItem("TheBattleUser")).set(name);
  firebase.database().ref("games/" + gameCode + "/host").set(localStorage.getItem("TheBattleUser"));
  firebase.database().ref("games/" + gameCode + "/isOpen").set(true);
  firebase.database().ref("games/" + gameCode + "/code").set(gameCode);
  firebase.database().ref("games/" + gameCode + "/winner").set("");
  localStorage.setItem("TheBattleGame", gameCode);
}

function joinGame(code) {
  //JOIN A GAME
  gameCode = code;
  localStorage.setItem("TheBattleGame", gameCode);
  firebase.database().ref("games/" + gameCode + "/playerlist/" + localStorage.getItem("TheBattleUser")).set(name);
}

function attemptJoinGame()
{
  let foundGame = false;
  Object.keys(gamesRef).forEach((key) => {
    if(gamesRef[key].isOpen && !foundGame)
    {
      joinGame(gamesRef[key].code);
      foundGame = true;
      firebase.database().ref("games/" + gamesRef[key].code + "/isOpen").set(false);
      window.location.href = "game.html";
    }
  })
  if(!foundGame)
  {
    createGame();
    waitingForJoin = true;
    document.querySelector(".Loading").style.visibility = "visible";
    document.querySelector(".Play").style.visibility = "hidden";
    document.querySelector(".SkinSelector").style.visibility = "hidden";
  }
}

function logOut()
{
  localStorage.removeItem("TheBattleUser");
  window.location.href = "login.html";
}

function loop() {
  document.querySelector(".loadImg").style.rotate = loadImgRot + "deg";
  loadImgRot += 3;
  if(loadImgRot > 355) loadImgRot = 0;
  if(loadImgRot == 0)
  {
    waitingDots++;
    if(waitingDots > 3)
    {
      waitingDots = 1;
      toolTip++;
      if(toolTip == toolTips.length) toolTip = 0;
    }
  }
  let dots = "";
  for (var i = 0; i < waitingDots; i++) {
    dots += ".";
  }
  document.querySelector(".loadTxt").innerText = "Waiting for players" + dots;
  document.querySelector(".loadTT").innerText = toolTips[toolTip];
  setTimeout(() => {
    loop();
  }, 10);
}

function nextSkin(num) {
  skinNum += num;
  console.log(skinNum)
  if(skinNum > 11)
  {
    skinNum = 1;
  }
  if(skinNum < 1)
  {
    skinNum = 11;
  }
  document.querySelector(".skin").style.background = "url(images/playerSkins/" + skinNum + ".png)";
  firebase.database().ref("users/" + localStorage.getItem("TheBattleUser") + "/skin").set(skinNum)
  localStorage.setItem("TheBattleSkin", skinNum)
}

function setStats(active) {
  document.querySelector(".StatsMenu").style.visibility = active;
  document.querySelector("#tW").innerText = "Total wins: " + stats.totalWins;
  document.querySelector("#tL").innerText = "Total losses: " + stats.totalLosses;
}

loop();