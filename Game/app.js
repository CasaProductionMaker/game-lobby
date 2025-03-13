if(localStorage.getItem("TheBattleGame") == null)
{
  window.location.href = "index.html";
}

//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
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

//Mouse Info
let mousePos = {x: undefined, y: undefined};
let screenDim = {x: window.innerWidth, y: window.innerHeight};
let mouseTile = {x: undefined, y: undefined};
let mouseNonRelativePosition = {x: undefined, y: undefined};
let mouseDown = false;
document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
});

//Player
let myX = 0;
let myY = 0;
let yVel = 0;
let xVel = 0;
let isD;
let isA;
let isW;  
let isS;
let isRight;
let isLeft;
let isUp;
let isDown;
let isSpace;
let PlayerHealth = 100;
let animationStartFrame = -5;
let direction = 1;
let summonID = 0;
let appliedKnock = true;
let isDead = false;
let Bombs = [0, 0]
let lastBombTick = 0;
let lastAttackTick = 0;

//Time
let startTime = new Date();
let startTick = startTime.getTime();
let currentTick = startTick;
let currentGameTick = 0;

//Game
let gameHost = "";
let tickRate = 40;
let mapSize = 500;
let weaponStats = {
  "Sword": {
    Damage: 5
  }, 
  "Taser": {
    Damage: 15
  }, 
  "Mace": {
    Damage: 30
  }, 
  "LaserGun": {
    Damage: 0
  }, 
  "Laser": {
    Damage: 10
  }
}
let armorStats = {
  "Green": {
    DamageReduction: 0.2, 
    ProjectileReduction: 0.5, 
    ExplosiveReduction: 0
  }, 
  "Aqua": {
    DamageReduction: 0.4, 
    ProjectileReduction: 1, 
    ExplosiveReduction: 0.1
  }, 
  "Blue": {
    DamageReduction: 0.8, 
    ProjectileReduction: 1, 
    ExplosiveReduction: 0.3
  }, 
  "No": {
    DamageReduction: 0, 
    ProjectileReduction: 0, 
    ExplosiveReduction: 0
  }
}
let opponentName = "";
let gameWinner = "";

//Misc
let isDebug = false;
let gameCode = localStorage.getItem("TheBattleGame");

function randomFromArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}
function getPowerUpToDrop() {
  let powerup = "Health";
  let RNG = Math.random() * 100;
  if(RNG < 20) {
    powerup = "Health";
  } else if(RNG < 40) {
    powerup = "Taser";
  } else if(RNG < 50) {
    powerup = "Mace";
  } else if(RNG < 60) {
    powerup = "LaserGun";
  } else if(RNG < 70) {
    powerup = "Bomb";
  } else if(RNG < 80) {
    powerup = "GreenArmor";
  } else if(RNG < 90) {
    powerup = "AquaArmor";
  } else if(RNG < 95) {
    powerup = "BlueBomb";
  } else if(RNG < 100) {
    powerup = "BlueArmor";
  }
  return powerup;
}
function getKeyString(x, y) {
	return `${x}x${y}`;
}
function createName() {
  const prefix = randomFromArray([
    "COOL",
    "SMUG",
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
    "ANT",
  ]);
  return `${prefix}_${animal}`;
}
function distanceBetween(x1, y1, x2, y2) {
  return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
}

(function() {
	let playerId;
	let playerRef;
  let players = {};
  let playerElements = {};
  let entities = {};
  let entityElements = {};
  let powerups = {};
  let powerupElements = {};
  let isButton = false;
  let chatMsg = 0;

  const gameContainer = document.querySelector(".game-container");

  function healLoop() {
    if(players[playerId] != null) {
      if(players[playerId].health < PlayerHealth && players[playerId].health > 0 && !isDead)
      {
        firebase.database().ref(`games/` + gameCode + `/players/` + playerId).update({
          health: players[playerId].health + 1
        })
      }
    }
    //repeat
    setTimeout(() => {
      healLoop();
    }, 1000);
  }
  function tickLoop() {
    let tempTime = new Date();
    currentTick = tempTime.getTime() - startTick;
    currentGameTick++;
    screenDim = {x: window.innerWidth, y: window.innerHeight};
    if(players[playerId] != null) {
      //Get push values
      if(players[playerId].xKnock != 0 || players[playerId].yKnock != 0)
      {
        xVel += players[playerId].xKnock;
        yVel += players[playerId].yKnock;
        playerRef.update({
          xKnock: 0, 
          yKnock: 0
        })
      }

      //Move player
      if(isD || isRight)
      {
        xVel += 2
        direction = 1;
      }
      if(isA || isLeft)
      {
        xVel -= 2
        direction = -1;
      }
      if((isW || isUp) && myY == 0 && yVel == 0)
      {
        yVel = -15
      }
      xVel *= 0.8;
      if(Math.abs(xVel) < 0.01) xVel = 0;
      yVel += 1.25;
      handleMovement(xVel, 0);
      handleMovement(0, yVel);
      myX = players[playerId].x;
      myY = players[playerId].y;

      //Combat
      if(isSpace && currentGameTick - lastAttackTick > 8)
      {
        animationStartFrame = currentGameTick;
        lastAttackTick = currentGameTick;
        Object.keys(players).forEach((key) => {
          const thisPlayer = players[key];
          if(thisPlayer.id != playerId)
          {
            if(((direction == 1 && myX - thisPlayer.x > -60 && myX - thisPlayer.x < 0) || (direction == -1 && myX - thisPlayer.x < 60 && myX - thisPlayer.x > 0)) && Math.abs(myY - thisPlayer.y) < 40)
            {
              let damage = weaponStats[players[playerId].weapon].Damage;
              let isCrit = false;
              if(yVel > 1)
              {
                damage *= 2;
                isCrit = true;
              }
              damage *= (1 - armorStats[thisPlayer.armorType].DamageReduction);
              if(isCrit)
              {
                for (var i = 0; i < Math.ceil(damage / 5) + 1; i++) {
                  firebase.database().ref(`games/` + gameCode + `/entities/` + summonID).set({
                    x: thisPlayer.x, 
                    y: thisPlayer.y, 
                    xV: (Math.random() * 20) - 10, 
                    yV: (Math.random() * -5) - 5, 
                    type: "CritParticle", 
                    owner: playerId, 
                    id: summonID
                  })
                  summonID++;
                }
              }
              firebase.database().ref("games/" + gameCode + "/players/" + thisPlayer.id).update({
                health: thisPlayer.health - damage, 
                xKnock: ((thisPlayer.x - players[playerId].x) / (Math.abs(thisPlayer.x - players[playerId].x) == 0 ? 1 : Math.abs(thisPlayer.x - players[playerId].x))) * 10, 
                yKnock: -5
              })
            }
          }
        })
        if(players[playerId].weapon == "LaserGun")
        {
          firebase.database().ref(`games/` + gameCode + `/entities/` + summonID).set({
            x: players[playerId].x, 
            y: players[playerId].y, 
            xV: players[playerId].direction * 15, 
            yV: 0, 
            type: "Laser", 
            owner: playerId, 
            id: summonID
          })
          summonID++;
        }
      }

      //Graphics
      document.querySelector(".Floor").style.top = -1855 + (screenDim.y/2) - players[playerId].y + "px";
      document.querySelector(".Floor").style.left =  -2420 + (screenDim.x/2) - players[playerId].x + "px";
      document.querySelector(".you .Character_weapon_sprite").style.background =  "url(images/" + players[playerId].weapon + ".png)";
      if(currentGameTick - animationStartFrame > 4) document.querySelector(".you .Character_weapon_sprite").style.transform = "scaleX(" + direction + ")";
      if(currentGameTick - animationStartFrame < 4)
      {
        document.querySelector(".you .Character_weapon_sprite").style.background =  "url(images/" + players[playerId].weapon + (currentGameTick - animationStartFrame) + ".png)";
      }
      if(currentGameTick - animationStartFrame == 4)
      {
        document.querySelector(".you .Character_weapon_sprite").style.background =  "url(images/" + players[playerId].weapon + "3.png)";
      }
      Object.keys(entities).forEach((key) => {
        const thisEntity = entities[key];
        if(thisEntity.owner == playerId)
        {
          let hitPlayer = "";
          Object.keys(players).forEach((key) => {
            const thisPlayer = players[key];
            if(distanceBetween(thisPlayer.x, thisPlayer.y, thisEntity.x, thisEntity.y) < 30 && thisPlayer.id != playerId)
            {
              hitPlayer = thisPlayer.id;
            }
          })
          if(thisEntity.type == "Bomb" || thisEntity.type == "BlueBomb" || thisEntity.type == "CritParticle")
          {
            firebase.database().ref("games/" + gameCode + "/entities/" + thisEntity.id).update({
              xV: thisEntity.xV * 0.95, 
              yV: thisEntity.yV + 1
            })
          }
          if(Math.abs(thisEntity.x) > 1000 || Math.abs(thisEntity.y) > 1000)
          {
            firebase.database().ref("games/" + gameCode + "/entities/" + thisEntity.id).remove()
          } else if((thisEntity.type == "Bomb" || thisEntity.type == "BlueBomb") && thisEntity.x > -375 && thisEntity.x < 345 && thisEntity.y > 10) {
            Object.keys(players).forEach((key) => {
              const thisPlayer = players[key];
              if(distanceBetween(thisPlayer.x, thisPlayer.y, thisEntity.x, thisEntity.y) < 80 * (thisEntity.type == "BlueBomb" ? 1.7 : 1))
              {
                let damage = 30 + (thisEntity.type == "BlueBomb" ? 20 : 0);
                damage *= (1 - armorStats[thisPlayer.armorType].ExplosiveReduction);
                firebase.database().ref("games/" + gameCode + "/players/" + thisPlayer.id).update({
                  health: thisPlayer.health - damage, 
                  xKnock: ((thisPlayer.x - thisEntity.x) / (Math.abs(thisPlayer.x - thisEntity.x) == 0 ? 1 : Math.abs(thisPlayer.x - thisEntity.x))) * 30, 
                  yKnock: ((thisPlayer.y - thisEntity.y) / (Math.abs(thisPlayer.y - thisEntity.y) == 0 ? 1 : Math.abs(thisPlayer.y - thisEntity.y))) * 15
                })
              }
            })
            firebase.database().ref("games/" + gameCode + "/entities/" + thisEntity.id).update({
              type: thisEntity.type + "Explosion", 
              xV: 0, 
              yV: 0
            })
            setTimeout(() => {
              firebase.database().ref("games/" + gameCode + "/entities/" + thisEntity.id).remove()
            }, 800)
          } else if(thisEntity.type == "CritParticle" && thisEntity.x > -375 && thisEntity.x < 345 && thisEntity.y > 10) {
            firebase.database().ref("games/" + gameCode + "/entities/" + thisEntity.id).remove()
          } else if(hitPlayer != "" && thisEntity.type != "CritParticle") {
            if(thisEntity.type == "Laser")
            {
              let damage = weaponStats[thisEntity.type].Damage;
              damage *= (1 - armorStats[players[hitPlayer].armorType].ProjectileReduction);
              firebase.database().ref("games/" + gameCode + "/players/" + hitPlayer).update({
                health: players[hitPlayer].health - damage, 
                xKnock: ((players[hitPlayer].x - thisEntity.x) / (Math.abs(players[hitPlayer].x - thisEntity.x) == 0 ? 1 : Math.abs(players[hitPlayer].x - thisEntity.x))) * 10, 
                yKnock: -5
              })
              firebase.database().ref("games/" + gameCode + "/entities/" + thisEntity.id).remove()
            }
            if(thisEntity.type == "Bomb" || thisEntity.type == "BlueBomb")
            {
              Object.keys(players).forEach((key) => {
                const thisPlayer = players[key];
                if(distanceBetween(thisPlayer.x, thisPlayer.y, thisEntity.x, thisEntity.y) < 80 * (thisEntity.type == "BlueBomb" ? 1.7 : 1))
                {
                  let damage = 30 + (thisEntity.type == "BlueBomb" ? 20 : 0);
                  damage *= (1 - armorStats[thisPlayer.armorType].ExplosiveReduction);
                  firebase.database().ref("games/" + gameCode + "/players/" + thisPlayer.id).update({
                    health: thisPlayer.health - damage, 
                    xKnock: ((thisPlayer.x - thisEntity.x) / (Math.abs(thisPlayer.x - thisEntity.x) == 0 ? 1 : Math.abs(thisPlayer.x - thisEntity.x))) * 30, 
                    yKnock: ((thisPlayer.y - thisEntity.y) / (Math.abs(thisPlayer.y - thisEntity.y) == 0 ? 1 : Math.abs(thisPlayer.y - thisEntity.y))) * 15
                  })
                }
              })
              firebase.database().ref("games/" + gameCode + "/entities/" + thisEntity.id).update({
                type: thisEntity.type + "Explosion", 
                xV: 0, 
                yV: 0
              })
              setTimeout(() => {
                firebase.database().ref("games/" + gameCode + "/entities/" + thisEntity.id).remove()
              }, 1000)
            }
          } else {
            firebase.database().ref("games/" + gameCode + "/entities/" + thisEntity.id).update({
              x: thisEntity.x + thisEntity.xV, 
              y: thisEntity.y + thisEntity.yV
            })
          }
        }
        let el = entityElements[key];
        let left = ((thisEntity.x - myX) + ((screenDim.x / 2) - 16)) + "px";
        let top = ((thisEntity.y - myY) + ((screenDim.y / 2) - 16)) + "px";
        if(el != undefined) el.style.transform = `translate3d(${left}, ${top}, 0)`;
        if(el != undefined) el.querySelector(".Entity_sprite").style.background = "url(images/" + thisEntity.type + ".png)";
        if(thisEntity.type == "BombExplosion")
        {
          el.querySelector(".Entity_sprite").style.scale = "0.4";
        }
        if(thisEntity.type == "BlueBombExplosion")
        {
          el.querySelector(".Entity_sprite").style.scale = "0.8";
        }
      })
      Object.keys(powerups).forEach((key) => {
        const thisPowerup = powerups[key];
        if(thisPowerup.owner == playerId) {
          let gone = false;
          Object.keys(players).forEach((key) => {
            const thisPlayer = players[key];
            if(distanceBetween(thisPlayer.x, thisPlayer.y, thisPowerup.x, thisPowerup.y) < 30)
            {
              if(thisPowerup.type == "Health")
              {
                firebase.database().ref(`games/` + gameCode + `/players/` + thisPlayer.id).update({
                  health: Math.min(thisPlayer.health + 20, PlayerHealth)
                })
              } else if(thisPowerup.type == "Taser" || thisPowerup.type == "Mace" || thisPowerup.type == "LaserGun") {
                firebase.database().ref(`games/` + gameCode + `/players/` + thisPlayer.id).update({
                  weapon: thisPowerup.type
                })
              } else if(thisPowerup.type == "GreenArmor") {
                firebase.database().ref(`games/` + gameCode + `/players/` + thisPlayer.id).update({
                  armorType: "Green"
                })
              } else if(thisPowerup.type == "AquaArmor") {
                firebase.database().ref(`games/` + gameCode + `/players/` + thisPlayer.id).update({
                  armorType: "Aqua"
                })
              } else if(thisPowerup.type == "BlueArmor") {
                firebase.database().ref(`games/` + gameCode + `/players/` + thisPlayer.id).update({
                  armorType: "Blue"
                })
              } else if(thisPowerup.type == "Bomb") {
                Bombs[0] += 3;
              } else if(thisPowerup.type == "BlueBomb") {
                Bombs[1] += 3;
              }
              firebase.database().ref("games/" + gameCode + "/powerups/" + thisPowerup.id).update({
                framesAlive: 250
              })
              gone = true;
            }
          })
          if(!gone)
          {
            firebase.database().ref("games/" + gameCode + "/powerups/" + thisPowerup.id).update({
              x: thisPowerup.x, 
              y: thisPowerup.y + thisPowerup.fallV, 
              fallV: thisPowerup.fallV + 1, 
              framesAlive: thisPowerup.framesAlive+1
            })
            if(thisPowerup.y >= 0)
            {
              firebase.database().ref("games/" + gameCode + "/powerups/" + thisPowerup.id).update({
                y: 0, 
                fallV: 0
              })
            }
          }
        }
      })
      if(players[playerId].health <= 0 && !isDead)
      {
        isDead = true;
        if(gameWinner == "") firebase.database().ref("games/" + gameCode + "/winner").set(opponentName);
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000)
      }
      if(gameWinner != "") document.querySelector(".winTxt").innerText = (gameWinner == players[playerId].name ? "You Won!" : "You have lost...");
    }

    //repeat
    setTimeout(() => {
      tickLoop();
    }, tickRate);
  }
  function dropPowerups() {
    if(players[playerId] != null) {
      //Spawn power up
      firebase.database().ref("games/" + gameCode + "/powerups/" + summonID).set({
        x: Math.round((Math.random() * 600) - 300), 
        y: -300, 
        fallV: 0, 
        owner: playerId, 
        type: getPowerUpToDrop(), 
        id: summonID, 
        framesAlive: 0
      })
      summonID++;
    }

    //repeat
    setTimeout(() => {
      dropPowerups();
    }, randomFromArray([8000, 9000, 10000, 11000]));
  }
  function renderLoop() {
    Object.keys(players).forEach((key) => {
      const characterState = players[key];
      let el = playerElements[key];
      el.querySelector(".Character_name").innerText = characterState.name;
      let left = ((characterState.x - myX) + ((screenDim.x / 2) - 16)) + "px";
      let top = ((characterState.y - myY) + ((screenDim.y / 2) - 16)) + "px";
      if(characterState.id === playerId)
      {
        left = ((screenDim.x / 2) - 16) + "px";
        top = ((screenDim.y / 2) - 16) + "px";
        if(characterState.health < 0) characterState.health = 0;
        if((characterState.health / PlayerHealth) * 100 >= 50)
        {
          document.querySelector(".hp-cover").style.left = (((((characterState.health / PlayerHealth) * 2) - 1) * 434) - 434) + "px";
          document.querySelector(".hp-cover").style.background = "url(images/health/HPAdd.png)";
        }
        if((characterState.health / PlayerHealth) * 100 < 50)
        {
          document.querySelector(".hp-cover").style.left = ((((characterState.health / PlayerHealth) * 2) * 434) - 434) + "px";
          document.querySelector(".hp-cover").style.background = "url(images/health/HPCover.png)";
        }
      } else {
          if(playerElements[characterState.id] != undefined) playerElements[characterState.id].querySelector(".Character_weapon_sprite").style.background =  "url(images/" + characterState.weapon + characterState.animFrame + ".png)";
          if(characterState.animFrame == "") playerElements[characterState.id].querySelector(".Character_weapon_sprite").style.transform =  "scaleX(" + characterState.direction + ")";
      }
      el.style.transform = `translate3d(${left}, ${top}, 0)`;
    })
    document.querySelector(".player-info").innerHTML = "Bombs: " + Bombs[0] + "<br>Blue Bombs: " + Bombs[1];
    //repeat
    setTimeout(() => {
      renderLoop();
    }, tickRate);
  }
  function handleMovement(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    const oldX = players[playerId].x;
    const oldY = players[playerId].y;
    if (!players[playerId].isDead) {
      players[playerId].x = newX;
      players[playerId].y = newY;
      let isCollision = false;
      if(newY > 0 && newY < 80 && newX < 355 && newX > -385)
      {
        isCollision = true;
      }
      if(newY > 750)
      {
        players[playerId].health = 0;
        playerRef.update({
          health: players[playerId].health
        });
      }
      Object.keys(players).forEach((key) => {
        const thisPlayer = players[key];
        if(Math.abs(newX - thisPlayer.x) < 20 && Math.abs(newY - thisPlayer.y) < 20 && thisPlayer.id != playerId)
        {
          xVel = (newX - thisPlayer.x) / ((Math.abs(xVel) * 2) + 5);
        }
      })
      if(isCollision)
      {
        if(yChange != 0) yVel = 0;
        players[playerId].x = oldX;
        players[playerId].y = oldY;
      }
      playerRef.update({
        x: players[playerId].x, 
        y: players[playerId].y, 
        direction, 
        animFrame: currentGameTick - animationStartFrame < 4 ? currentGameTick - animationStartFrame : ""
      });
    }
  }

  function initGame() {
    //Key Registers
    new KeyPressListener("ArrowUp", () => {isUp = true;}, () => {isUp = false;})
    new KeyPressListener("ArrowDown", () => {isDown = true;}, () => {isDown = false;})
    new KeyPressListener("ArrowLeft", () => {isLeft = true;}, () => {isLeft = false;})
    new KeyPressListener("ArrowRight", () => {isRight = true;}, () => {isRight = false})
    new KeyPressListener("KeyW", () => {isW = true;}, () => {isW = false;})
    new KeyPressListener("KeyA", () => {isA = true;}, () => {isA = false;})
    new KeyPressListener("KeyS", () => {isS = true;}, () => {isS = false;})
    new KeyPressListener("KeyD", () => {isD = true;}, () => {isD = false;})
    new KeyPressListener("Space", () => {
      isSpace = true;
    }, () => {isSpace = false;})
    new KeyPressListener("KeyB", () => {
      if(Bombs[0] > 0 && currentTick - lastBombTick >= 800)
      {
        firebase.database().ref(`games/` + gameCode + `/entities/` + summonID).set({
          x: players[playerId].x, 
          y: players[playerId].y, 
          xV: players[playerId].direction * ((Math.random() * 4) + 10), 
          yV: (Math.random() * -4) - 8, 
          type: "Bomb", 
          owner: playerId, 
          id: summonID
        })
        summonID++;
        Bombs[0]--;
        lastBombTick = currentTick;
      }
    }, () => {})
    new KeyPressListener("KeyN", () => {
      if(Bombs[1] > 0 && currentTick - lastBombTick >= 800)
      {
        firebase.database().ref(`games/` + gameCode + `/entities/` + summonID).set({
          x: players[playerId].x, 
          y: players[playerId].y, 
          xV: players[playerId].direction * ((Math.random() * 4) + 10), 
          yV: (Math.random() * -4) - 8, 
          type: "BlueBomb", 
          owner: playerId, 
          id: summonID
        })
        summonID++;
        Bombs[1]--;
        lastBombTick = currentTick;
      }
    }, () => {})

    const allPlayersRef = firebase.database().ref(`games/` + gameCode + `/players`);
    const allEntitiesRef = firebase.database().ref(`games/` + gameCode + `/entities`);
    const allPowerupsRef = firebase.database().ref(`games/` + gameCode + `/powerups`);
    const winnerRef = firebase.database().ref(`games/` + gameCode + `/winner`);

    allPlayersRef.on("value", (snapshot) => {
      //change
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        el.querySelector(".Character_name").innerText = characterState.name;
        el.querySelector(".Character_armor_sprite").style.background = "url(images/armor/" + characterState.armorType + "Armor.png)";
        el.querySelector(".Character_sprite").style.background = "url(images/playerSkins/" + characterState.skin + ".png)";
        let left = ((characterState.x - myX) + ((screenDim.x / 2) - 16)) + "px";
        let top = ((characterState.y - myY) + ((screenDim.y / 2) - 16)) + "px";
        if(characterState.id === playerId)
        {
          left = ((screenDim.x / 2) - 16) + "px";
          top = ((screenDim.y / 2) - 16) + "px";
          if(characterState.health < 0) characterState.health = 0;
          if((characterState.health / PlayerHealth) * 100 >= 50)
          {
            document.querySelector(".hp-cover").style.left = (((((characterState.health / PlayerHealth) * 2) - 1) * 434) - 434) + "px";
            document.querySelector(".hp-cover").style.background = "url(images/health/HPAdd.png)";
          }
          if((characterState.health / PlayerHealth) * 100 < 50)
          {
            document.querySelector(".hp-cover").style.left = ((((characterState.health / PlayerHealth) * 2) * 434) - 434) + "px";
            document.querySelector(".hp-cover").style.background = "url(images/health/HPCover.png)";
          }
        } else {
            if(playerElements[characterState.id] != undefined) playerElements[characterState.id].querySelector(".Character_weapon_sprite").style.background =  "url(images/" + characterState.weapon + characterState.animFrame + ".png)";
            if(characterState.animFrame == "") playerElements[characterState.id].querySelector(".Character_weapon_sprite").style.transform =  "scaleX(" + characterState.direction + ")";
        }
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    })
    allPlayersRef.on("child_added", (snapshot) => {
      //new nodes
      const addedPlayer = snapshot.val();
      const characterElement = document.createElement("div");
      characterElement.classList.add("Character");
      if(addedPlayer.id === playerId)
      {
        characterElement.classList.add("you");
      }
      characterElement.innerHTML = (`
        <div class="Character_sprite"></div>
        <div class="Character_armor_sprite"></div>
        <div class="Character_weapon_sprite"></div>
        <div class="Character_name-container">
          <span class="Character_name"></span>
        </div>
      `);

      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      let left = ((addedPlayer.x - myX) + ((screenDim.x / 2) - 32)) + "px";
      let top = ((addedPlayer.y - myY) + ((screenDim.y / 2) - 32)) + "px";
      if(addedPlayer.id === playerId)
      {
        left = ((screenDim.x / 2) - 16) + "px";
        top = ((screenDim.y / 2) - 16) + "px";
      } else {
        opponentName = addedPlayer.name;
      }
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      //Add
      playerElements[addedPlayer.id] = characterElement;
      gameContainer.appendChild(characterElement);
    })
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      firebase.database().ref("games/" + gameCode).remove();
      if(removedKey != playerId) window.location.href = "index.html";
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })

    allEntitiesRef.on("value", (snapshot) => {
      //change
      entities = snapshot.val() || {};
      Object.keys(entities).forEach((key) => {
        const thisEntity = entities[key];
        let el = entityElements[key];
        let left = ((thisEntity.x - myX) + ((screenDim.x / 2) - 16)) + "px";
        let top = ((thisEntity.y - myY) + ((screenDim.y / 2) - 16)) + "px";
        if(el != undefined) el.style.transform = `translate3d(${left}, ${top}, 0)`;
        el.querySelector(".Entity_sprite").style.background = "url(images/" + thisEntity.type + ".png)";
        if(thisEntity.type == "CritParticle") el.querySelector(".Entity_sprite").style.scale = "0.1";
      })
    })
    allEntitiesRef.on("child_added", (snapshot) => {
      //new nodes
      const addedEntity = snapshot.val();
      const entityElement = document.createElement("div");
      entityElement.classList.add("Entity");
      entityElement.innerHTML = (`
        <div class="Entity_sprite"></div>
      `);

      let left = ((addedEntity.x - myX) + ((screenDim.x / 2) - 32)) + "px";
      let top = ((addedEntity.y - myY) + ((screenDim.y / 2) - 32)) + "px";
      entityElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      entityElement.querySelector(".Entity_sprite").style.background = "url(images/" + addedEntity.type + ".png)";

      //Add
      entityElements[addedEntity.id] = entityElement;
      gameContainer.appendChild(entityElement);
    })
    allEntitiesRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(entityElements[removedKey]);
      delete entityElements[removedKey];
    })

    allPowerupsRef.on("value", (snapshot) => {
      //change
      powerups = snapshot.val() || {};
      Object.keys(powerups).forEach((key) => {
        const thisPowerup = powerups[key];
        let el = powerupElements[key];
        let left = ((thisPowerup.x - myX) + ((screenDim.x / 2) - 16)) + "px";
        let top = ((thisPowerup.y - myY) + ((screenDim.y / 2) - 16)) + "px";
        if(el != undefined) el.style.transform = `translate3d(${left}, ${top}, 0)`;
        if(el != undefined && thisPowerup.type != undefined) el.querySelector(".Powerup_sprite").style.background = "url(images/powerups/" + (thisPowerup.type || "Sword") + ".png)";
        if(el != undefined && (thisPowerup.type == "Bomb" || thisPowerup.type == "BlueBomb")) el.querySelector(".Powerup_sprite").style.scale = "0.2";
        if(thisPowerup.framesAlive >= 250)
        {
          firebase.database().ref("games/" + gameCode + "/powerups/" + thisPowerup.id).remove()
        }
        if(thisPowerup.owner == undefined)
        {
          firebase.database().ref("games/" + gameCode + "/powerups/" + thisPowerup.id).remove()
        }
      })
    })
    allPowerupsRef.on("child_added", (snapshot) => {
      //new nodes
      const addedPowerup = snapshot.val();
      const powerupElement = document.createElement("div");
      powerupElement.classList.add("Powerup");
      powerupElement.innerHTML = (`
        <div class="Powerup_sprite"></div>
      `);

      let left = ((addedPowerup.x - myX) + ((screenDim.x / 2) - 32)) + "px";
      let top = ((addedPowerup.y - myY) + ((screenDim.y / 2) - 32)) + "px";
      powerupElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      powerupElement.querySelector(".Powerup_sprite").style.background = "url(images/powerups/" + addedPowerup.type + ".png)";

      //Add
      powerupElements[addedPowerup.id] = powerupElement;
      gameContainer.appendChild(powerupElement);
    })
    allPowerupsRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(powerupElements[removedKey]);
      delete powerupElements[removedKey];
    })

    winnerRef.on("value", (snapshot) => {
      gameWinner = snapshot.val() || "";
    })

    firebase.database().ref("games/" + gameCode + "/host").once("value").then((snapshot) => {
      gameHost = snapshot.val() || "";
      console.log(gameHost)
      if(gameHost == localStorage.getItem("TheBattleUser"))
      {
        dropPowerups();
      }
    });
    window.addEventListener('mousemove', (event) => {
      mousePos = {x: event.clientX, y: event.clientY};
      let margin = {x: (screenDim.x - 720) / 2, y: (screenDim.y - 624) / 2};
      mouseTile = {x: Math.floor((((mousePos.x + ((myX - 7) * 48)) - margin.x)) / 48), y: Math.floor(((mousePos.y + ((myY - 7) * 48)) - margin.y) / 48)};
      const left = mousePos.x - (screenDim.x/2);
      const top = mousePos.y - (screenDim.y/2);
      //1919, 977
    });
    window.onmousedown = () => {
      mouseDown = true;
    }
    window.onmouseup = () => {
      mouseDown = false;
    }
    healLoop();
    setTimeout(() => tickLoop(), 500);
    setTimeout(() => renderLoop(), 500);
  }
	firebase.auth().onAuthStateChanged((user) =>{
    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`games/` + gameCode + `/players/${playerId}`);

      let name;
      if(localStorage.getItem("TheBattleName") != null)
      {
        name = localStorage.getItem("TheBattleName");
      } else {
        name = createName();
      }
      const x = randomFromArray([-310, -260, -210, -160, -110, -60, -10, 40, 90, 140, 190, 240, 290]);
      const y = 0;

      playerRef.set({
        id: playerId,
        name, 
        x, 
        y, 
        xKnock: 0, 
        yKnock: 0, 
        health: PlayerHealth, 
        op: false, 
        weapon: "Sword", 
        direction, 
        animFrame: "", 
        armorType: "No", 
        skin: localStorage.getItem("TheBattleSkin")
      })

      //ADD PLAYER JOIN MSG

      //Remove me from Firebase when I diconnect
      playerRef.onDisconnect().remove();

      //Begin the game now that we are signed in
      initGame();
    } else {
      //You're logged out.
    }
  })
	firebase.auth().signInAnonymously().catch((error) => {
	    var errorCode = error.code;
	    var errorMessage = error.message;
	    // ...
	    console.log(errorCode, errorMessage);
	});
})();