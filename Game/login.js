const firebaseConfig = {
  apiKey: "AIzaSyDBKwQRTu3xsHZjuzW3TFZFdHlGwbhttqY",
  authDomain: "test-game-eba29.firebaseapp.com",
  databaseURL: "https://test-game-eba29-default-rtdb.firebaseio.com",
  projectId: "test-game-eba29",
  storageBucket: "test-game-eba29.firebasestorage.app",
  messagingSenderId: "118728291028",
  appId: "1:118728291028:web:3f0a0dc3ee48dbcb304141"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

let user;
let pass;
let content = document.querySelector(".content");

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


function logIn()
{
  Object.keys(usersD).forEach((key) => {
    const thisuser = usersD[key];
    if(user.value == thisuser.username && pass.value == thisuser.password)
    {
      localStorage.setItem("TheBattleUser", thisuser.username);
      window.location.href = "index.html";
    }
  })
}

function createAccountMenu()
{
  content.innerHTML = `
    <div>
      <label for="player-user">Username:</label>
      <input id="player-user" maxlength="16" type="text"/>
    </div>
    <div>
      <label for="player-pass">Password:</label>
      <input id="player-pass" type="password"/>
    </div>
    <div>
      <label for="player-repeat-pass">Repeat Password:</label>
      <input id="player-repeat-pass" type="password"/>
    </div>
    <div><button onclick="mainMenu()">Back</button><button onclick="createAccount()">Create</button></div>
  `;
  user = document.querySelector("#player-user");
  pass = document.querySelector("#player-pass");
}

function loginMenu()
{
  content.innerHTML = `
    <div>
      <label for="player-user">Username:</label>
      <input id="player-user" maxlength="16" type="text"/>
    </div>
    <div>
      <label for="player-pass">Password:</label>
      <input id="player-pass" type="password"/>
    </div>
    <div><button onclick="mainMenu()">Back</button><button onclick="logIn()">Log In!</button></div>
  `;
  user = document.querySelector("#player-user");
  pass = document.querySelector("#player-pass");
}

function mainMenu()
{
  content.innerHTML = `
    <button onclick="createAccountMenu()">Create Account</button>
    <button onclick="loginMenu()">Log in</button>
  `;
}

function createAccount()
{
  if(user.value != "" && pass.value == document.querySelector("#player-repeat-pass").value)
  {
    firebase.database().ref("users/" + user.value).set({
      username: user.value, 
      password: pass.value
    })
    localStorage.setItem("TheBattleSkin", 1);
    logIn()
  }
}


/*
<div>
        <label for="player-user">Username:</label>
        <input id="player-user" maxlength="16" type="text"/>
      </div>
      <div>
        <label for="player-pass">Password:</label>
        <input id="player-pass" type="password"/>
      </div>
      <div>
        <label for="player-pass">Repeat Password:</label>
        <input id="player-pass" type="password"/>
      </div>
      <div><button onclick="logIn()">Log In!</button></div>

<button onclick="createAccountMenu()">Create Account</button><button onclick="loginMenu()">Log in</button>
*/