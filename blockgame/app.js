//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyD45xgHgOVARIYyKkx1tJztg2QKLwVX4j0",
  authDomain: "block-game-2b27b.firebaseapp.com",
  projectId: "block-game-2b27b",
  storageBucket: "block-game-2b27b.appspot.com",
  messagingSenderId: "664778162781",
  appId: "1:664778162781:web:ee1a91d4a59e2629bd83b4"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

//Prevent Right-clicks
document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
});


//Seed Generation
let seed = Math.random();

//Mouse Info
let mousePos = {x: undefined, y: undefined};
let screenDim = {x: undefined, y: undefined};
let mouseTile = {x: undefined, y: undefined};
let mouseNonRelativePosition = {x: undefined, y: undefined};
let mouseDown = false;

//Player Movement
let startTimeDate = new Date();
let startTime = startTimeDate.getTime();
let thisTime;
let timer;
let myX;
let myY;
let yVel = 0.1;
let xVel = 0;
let currentTick = 0;
let deltaTime = 1;
let isJump = false;
let isD;
let isA;
let isRight;
let isLeft;
let isOnGround;
let deltaTimeForMovement = 0;
let deltaCollection = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
let averageDelta = 1;
let deltaBeforeJump = averageDelta;

//Block Mining
let mineIdx = 0;
let myBlockId = (localStorage.getItem("myOldBlockId") != null ? localStorage.getItem("myOldBlockId") : 0);

//World Generation
let renderDistance = 5;
let isMapG;
let worldRad = 60;
let action = 0;

//Drowning
let inWater = false;
let timeInWater = 0;
let timeSinceSpawn = 0;

//Mobile Movement
let mobileMovement = {
  x: [0, 0], 
  y: [0, 0]
}
let isMobile = (localStorage.getItem("isMobile") != null ? localStorage.getItem("isMobile") : false);

//Biomes
let biomeMap = [];
let BiomeRules = {
  "forest": ["plains", "ocean"], 
  "plains": ["forest", "desert", "ocean"], 
  "desert": ["plains"], 
  "ocean": ["plains", "forest"]
};
let BiomeBlock = {
  desert: "sand", 
  plains: "grass", 
  forest: "grass", 
  ocean: "water"
}

//Block Data
let BlockProperties = {
  "bedrock": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 9000000000000000000000000000000000000000000000000, 
    wasteDurability: true
  }, 
  "stone": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 500, 
    wasteDurability: true
  }, 
  "grass": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 30, 
    wasteDurability: true
  }, 
  "sand": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 20, 
    wasteDurability: true
  }, 
  "dirt": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 30, 
    wasteDurability: true
  }, 
  "leaves": {
    sizeX: 0.0, 
    sizeY: 0.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 15, 
    wasteDurability: false
  }, 
  "log": {
    sizeX: 0.0, 
    sizeY: 0.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 50, 
    wasteDurability: true
  }, 
  "water": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 9000000000000000000000000000000000000000000000, 
    wasteDurability: true
  }, 
  "coal_ore": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 400, 
    wasteDurability: true
  }, 
  "iron_ore": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 600, 
    wasteDurability: true
  }, 
  "gold_ore": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 300, 
    wasteDurability: true
  }, 
  "stone_bricks": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 600, 
    wasteDurability: true
  }, 
  "tall_grass": {
    sizeX: 0.0, 
    sizeY: 0.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 10, 
    wasteDurability: false
  }, 
  "furnace": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 700, 
    wasteDurability: true
  }, 
  "anvil": {
    sizeX: 1.0, 
    sizeY: 0.875,
    centerX: 0.0, 
    centerY: 0.063,  
    strength: 800, 
    wasteDurability: true
  }, 
  "chest": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 50, 
    wasteDurability: true
  }
};
let BlockTraits = {
  "bedrock": {
    drop: ["none"], 
    amount: [0], 
    dataRequired: {}
  }, 
  "stone": {
    drop: ["stone"], 
    amount: [1], 
    breakWith: "pickaxe", 
    dataRequired: {}
  }, 
  "grass": {
    drop: ["grass"], 
    amount: [1], 
    dataRequired: {}
  }, 
  "sand": {
    drop: ["sand"], 
    amount: [1], 
    dataRequired: {}
  }, 
  "dirt": {
    drop: ["dirt"], 
    amount: [1], 
    dataRequired: {}
  }, 
  "leaves": {
    drop: ["leaves", "stick"], 
    amount: [1], 
    breakWith: "axe", 
    dataRequired: {}
  }, 
  "log": {
    drop: ["log"], 
    amount: [1], 
    breakWith: "axe", 
    dataRequired: {}
  }, 
  "water": {
    drop: ["none"], 
    amount: [0], 
    dataRequired: {}
  }, 
  "coal_ore": {
    drop: ["coal_ore"], 
    amount: [1], 
    breakWith: "pickaxe", 
    dataRequired: {}
  }, 
  "iron_ore": {
    drop: ["iron_ore"], 
    amount: [1], 
    breakWith: "pickaxe", 
    dataRequired: {}
  }, 
  "gold_ore": {
    drop: ["gold_ore"], 
    amount: [1], 
    breakWith: "pickaxe", 
    dataRequired: {}
  }, 
  "stone_bricks": {
    drop: ["stone_bricks"], 
    amount: [1], 
    breakWith: "pickaxe", 
    dataRequired: {}
  }, 
  "tall_grass": {
    drop: ["cotton", "none"], 
    amount: [1, 2], 
    dataRequired: {}
  }, 
  "furnace": {
    drop: ["furnace"], 
    amount: [1], 
    breakWith: "pickaxe", 
    dataRequired: {}
  }, 
  "anvil": {
    drop: ["anvil"], 
    amount: [1], 
    breakWith: "pickaxe", 
    dataRequired: {
      blockCraftProgress: 0, 
      blockInventory: [
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }
      ]
    }
  }, 
  "chest": {
    drop: ["chest"], 
    amount: [1], 
    breakWith: "axe", 
    dataRequired: {
      blockInventory: [
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }, 
        {
          item: "none", 
          amount: 0, 
          refinements: {}, 
          durability: 1
        }
      ]
    }
  }
};

//Inventory
let Inventory = [
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }, 
  {
    item: "none", 
    amount: 0, 
    refinements: {}, 
    durability: 1
  }
];
let currentSlot = 0;
let inventoryMouseSlot = {
  item: "none", 
  amount: 0, 
  refinements: {}, 
  durability: 1
};

//Item Data
let ItemProperties = {
  "none": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "stone": {
    stackSize: 16, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "grass": {
    stackSize: 16, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "sand": {
    stackSize: 16, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "dirt": {
    stackSize: 16, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "leaves": {
    stackSize: 16, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "log": {
    stackSize: 8, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "coal_ore": {
    stackSize: 16, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "iron_ore": {
    stackSize: 8, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "gold_ore": {
    stackSize: 8, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "stick": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "long_stick": {
    stackSize: 8, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "sharpened_stick": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.75, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "handle": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "long_handle": {
    stackSize: 8, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "cotton": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "string": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "long_sharpened_stick": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "wood": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "wooden_blade": {
    stackSize: 8, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "wooden_axehead": {
    stackSize: 8, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "long_string": {
    stackSize: 8, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "wooden_pickaxe_head": {
    stackSize: 8, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "rock": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "pebble": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "stone_bricks": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "stone_rod": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "sharp_stone_rod": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.75, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "stone_blade": {
    stackSize: 8, 
    isPlaceable: false, 
    damage: 0.75, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "iron_ingot": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "iron_nugget": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "cotton_strand": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "wooden_sword": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 1, 
    attackSpeed: 3, 
    durability: 35
  }, 
  "wooden_axe": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 1, 
    toolType: "axe", 
    toolTier: "wooden", 
    attackSpeed: 4.5, 
    durability: 35
  }, 
  "wooden_pickaxe": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 0.75, 
    toolType: "pickaxe", 
    toolTier: "wooden", 
    attackSpeed: 1.5, 
    durability: 35
  }, 
  "bow": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "stone_pickaxe": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 1, 
    toolType: "pickaxe", 
    toolTier: "stone", 
    attackSpeed: 2, 
    durability: 50
  }, 
  "stone_axe": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 1.5, 
    toolType: "axe", 
    toolTier: "stone", 
    attackSpeed: 5, 
    durability: 50
  }, 
  "stone_sword": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 2, 
    attackSpeed: 3.5, 
    durability: 50
  }, 
  "stone_axehead": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "stone_pickaxe_head": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "iron_pickaxe": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 2, 
    toolType: "pickaxe", 
    toolTier: "iron", 
    attackSpeed: 2, 
    durability: 75
  }, 
  "iron_axe": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 2, 
    toolType: "axe", 
    toolTier: "stone", 
    attackSpeed: 6, 
    durability: 75
  }, 
  "iron_sword": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 3, 
    attackSpeed: 4, 
    durability: 75
  }, 
  "iron_axehead": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "iron_pickaxe_head": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "golden_pickaxe": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 2.5, 
    toolType: "pickaxe", 
    toolTier: "gold", 
    attackSpeed: 1.5, 
    durability: 30
  }, 
  "golden_axe": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 3, 
    toolType: "axe", 
    toolTier: "stone", 
    attackSpeed: 3.5, 
    durability: 30
  }, 
  "golden_sword": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 4, 
    attackSpeed: 2.5, 
    durability: 30
  }, 
  "golden_axehead": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "golden_pickaxe_head": {
    stackSize: 1, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "iron_rod": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "sharp_iron_rod": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 1, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "iron_blade": {
    stackSize: 8, 
    isPlaceable: false, 
    damage: 2, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "golden_rod": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "sharp_golden_rod": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 2, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "golden_blade": {
    stackSize: 8, 
    isPlaceable: false, 
    damage: 2.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "golden_ingot": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "golden_nugget": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "furnace": {
    stackSize: 1, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "anvil": {
    stackSize: 1, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "woodchip": {
    stackSize: 16, 
    isPlaceable: false, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }, 
  "chest": {
    stackSize: 1, 
    isPlaceable: true, 
    damage: 0.5, 
    attackSpeed: 1.5, 
    durability: 1000000000
  }
};
let craftingRecipes = [
  {
    item: "long_stick", 
    amount: 1, 
    recipe: ["stick", "stick"], 
    workplace: "hand", 
    pattern: false, 
    duration: 2
  }, 
  {
    item: "sharpened_stick", 
    amount: 1, 
    recipe: ["stick", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 5
  }, 
  {
    item: "handle", 
    amount: 1, 
    recipe: ["stick", "string"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "long_handle", 
    amount: 1, 
    recipe: ["handle", "stick"], 
    workplace: "hand", 
    pattern: false, 
    duration: 2
  }, 
  {
    item: "long_sharpened_stick", 
    amount: 1, 
    recipe: ["sharpened_stick", "stick"], 
    workplace: "hand", 
    pattern: false, 
    duration: 2
  }, 
  {
    item: "wood", 
    amount: 2, 
    recipe: ["log", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "wooden_blade", 
    amount: 1, 
    recipe: ["sharpened_stick", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 6
  }, 
  {
    item: "wooden_axehead", 
    amount: 1, 
    recipe: ["stick", "wood"], 
    workplace: "hand", 
    pattern: false, 
    duration: 5
  }, 
  {
    item: "long_string", 
    amount: 1, 
    recipe: ["string", "string"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "wooden_pickaxe_head", 
    amount: 1, 
    recipe: ["sharpened_stick", "sharpened_stick"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "rock", 
    amount: 2, 
    recipe: ["stone", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "pebble", 
    amount: 2, 
    recipe: ["rock", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "stone_bricks", 
    amount: 1, 
    recipe: ["stone", "stone"], 
    workplace: "hand", 
    pattern: false, 
    duration: 5
  }, 
  {
    item: "stone_rod", 
    amount: 1, 
    recipe: ["pebble", "rock"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "sharp_stone_rod", 
    amount: 1, 
    recipe: ["stone_rod", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 8
  }, 
  {
    item: "stone_blade", 
    amount: 1, 
    recipe: ["sharp_stone_rod", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 10
  }, 
  {
    item: "iron_nugget", 
    amount: 4, 
    recipe: ["iron_ingot", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "cotton_strand", 
    amount: 1, 
    recipe: ["cotton", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 1
  }, 
  {
    item: "string", 
    amount: 1, 
    recipe: ["cotton_strand", "cotton_strand"], 
    workplace: "hand", 
    pattern: false, 
    duration: 2
  }, 
  {
    item: "wooden_sword", 
    amount: 1, 
    recipe: ["handle", "wooden_blade"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "wooden_axe", 
    amount: 1, 
    recipe: ["long_handle", "wooden_axehead"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "wooden_pickaxe", 
    amount: 1, 
    recipe: ["long_handle", "wooden_pickaxe_head"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "bow", 
    amount: 1, 
    recipe: ["long_stick", "long_string"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "stone_sword", 
    amount: 1, 
    recipe: ["handle", "stone_blade"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "stone_pickaxe_head", 
    amount: 1, 
    recipe: ["sharp_stone_rod", "sharp_stone_rod"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "stone_axehead", 
    amount: 1, 
    recipe: ["stick", "rock"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "stone_pickaxe", 
    amount: 1, 
    recipe: ["stone_pickaxe_head", "long_handle"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "stone_axe", 
    amount: 1, 
    recipe: ["stone_axehead", "long_handle"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "iron_sword", 
    amount: 1, 
    recipe: ["handle", "iron_blade"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "iron_pickaxe_head", 
    amount: 1, 
    recipe: ["sharp_iron_rod", "sharp_iron_rod"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "iron_axehead", 
    amount: 1, 
    recipe: ["stick", "iron"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "iron_pickaxe", 
    amount: 1, 
    recipe: ["iron_pickaxe_head", "long_handle"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "iron_axe", 
    amount: 1, 
    recipe: ["iron_axehead", "long_handle"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "golden_sword", 
    amount: 1, 
    recipe: ["handle", "golden_blade"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "golden_pickaxe_head", 
    amount: 1, 
    recipe: ["sharp_golden_rod", "sharp_golden_rod"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "golden_axehead", 
    amount: 1, 
    recipe: ["stick", "gold"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "golden_pickaxe", 
    amount: 1, 
    recipe: ["golden_pickaxe_head", "long_handle"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "golden_axe", 
    amount: 1, 
    recipe: ["golden_axehead", "long_handle"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "golden_rod", 
    amount: 1, 
    recipe: ["golden_nugget", "golden_ingot"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "sharp_golden_rod", 
    amount: 1, 
    recipe: ["golden_rod", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 11
  }, 
  {
    item: "golden_blade", 
    amount: 1, 
    recipe: ["sharp_golden_rod", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 13
  }, 
  {
    item: "iron_rod", 
    amount: 1, 
    recipe: ["iron_nugget", "iron_ingot"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "sharp_iron_rod", 
    amount: 1, 
    recipe: ["iron_rod", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 10
  }, 
  {
    item: "iron_blade", 
    amount: 1, 
    recipe: ["sharp_iron_rod", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 12
  }, 
  {
    item: "iron_ingot", 
    amount: 1, 
    recipe: ["iron_ore", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 9
  }, 
  {
    item: "golden_ingot", 
    amount: 1, 
    recipe: ["gold_ore", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 10
  }, 
  {
    item: "golden_nugget", 
    amount: 4, 
    recipe: ["golden_ingot", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 7
  }, 
  {
    item: "furnace", 
    amount: 1, 
    recipe: ["stone_bricks", "stone_bricks"], 
    workplace: "hand", 
    pattern: false, 
    duration: 6
  }, 
  {
    item: "woodchip", 
    amount: 2, 
    recipe: ["wood", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 2
  }, 
  {
    item: "wooden_sword", 
    data: {
      refinements: [
        {
          name: "sharpening", 
          level: 1
        }
      ]
    }, 
    amount: 1, 
    recipe: ["wooden_sword", "wooden_blade"], 
    workplace: "anvil", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "stone_sword", 
    data: {
      refinements: [
        {
          name: "sharpening", 
          level: 1
        }
      ]
    }, 
    amount: 1, 
    recipe: ["stone_sword", "stone_blade"], 
    workplace: "anvil", 
    pattern: false, 
    duration: 6
  }, 
  {
    item: "iron_sword", 
    data: {
      refinements: [
        {
          name: "sharpening", 
          level: 1
        }
      ]
    }, 
    amount: 1, 
    recipe: ["iron_sword", "iron_blade"], 
    workplace: "anvil", 
    pattern: false, 
    duration: 8
  }, 
  {
    item: "golden_sword", 
    data: {
      refinements: [
        {
          name: "sharpening", 
          level: 1
        }
      ]
    }, 
    amount: 1, 
    recipe: ["golden_sword", "golden_blade"], 
    workplace: "anvil", 
    pattern: false, 
    duration: 10
  }, 
  {
    item: "anvil", 
    amount: 1, 
    recipe: ["iron_ingot", "iron_ingot"], 
    workplace: "hand", 
    pattern: false, 
    duration: 15
  }, 
  {
    item: "stick", 
    amount: 1, 
    recipe: ["wood", "woodchip"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "chest", 
    amount: 1, 
    recipe: ["log", "log"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }
]
let toolTierBreakSpeed = {
  "wooden": 0.9, 
  "stone": 0.8, 
  "iron": 0.6, 
  "gold": 0.4
}

//Lang
let lang = {
  "stone": "Stone", 
  "grass": "Grass", 
  "sand": "Sand", 
  "dirt": "Dirt", 
  "leaves": "Leaves", 
  "log": "Log", 
  "coal_ore": "Coal Ore", 
  "iron_ore": "Iron Ore", 
  "gold_ore": "Gold Ore", 
  "stick": "Stick", 
  "long_stick": "Long Stick", 
  "sharpened_stick": "Sharpened Stick", 
  "handle": "Handle", 
  "long_handle": "Long Handle", 
  "cotton": "Cotton", 
  "string": "String", 
  "long_sharpened_stick": "Long Sharpened Stick", 
  "wood": "Wood", 
  "wooden_blade": "Wooden Blade", 
  "wooden_axehead": "Wooden Axehead", 
  "long_string": "Long String", 
  "wooden_pickaxe_head": "Wooden Pickaxe Head", 
  "rock": "Rock", 
  "pebble": "Pebble", 
  "stone_bricks": "Stone Bricks", 
  "stone_rod": "Stone Rod", 
  "sharp_stone_rod": "Sharp Stone Rod", 
  "stone_blade": "Stone Blade", 
  "iron_ingot": "Iron Ingot", 
  "iron_nugget": "Iron Nugget", 
  "cotton_strand": "Cotton Strand", 
  "wooden_sword": "Wooden Sword", 
  "wooden_axe": "Wooden Axe",  
  "wooden_pickaxe": "Wooden Pickaxe", 
  "bow": "Bow", 
  "stone_pickaxe": "Stone Pickaxe", 
  "stone_axe": "Stone Axe", 
  "stone_sword": "Stone Sword", 
  "stone_axehead": "Stone Axehead", 
  "stone_pickaxe_head": "Stone Pickaxe Head", 
  "iron_pickaxe": "Iron Pickaxe", 
  "iron_axe": "Iron Axe", 
  "iron_sword": "Iron Sword", 
  "iron_axehead": "Iron Axehead", 
  "iron_pickaxe_head": "Iron Pickaxe Head", 
  "golden_pickaxe": "Golden Pickaxe", 
  "golden_axe": "Golden Axe", 
  "golden_sword": "Golden Sword", 
  "golden_axehead": "Golden Axehead", 
  "golden_pickaxe_head": "Golden Pickaxe Head", 
  "iron_rod": "Iron Rod", 
  "sharp_iron_rod": "Sharp Iron Rod", 
  "iron_blade": "Iron Blade", 
  "golden_rod": "Golden Rod", 
  "sharp_golden_rod": "Sharp Golden Rod", 
  "golden_blade": "Golden Blade", 
  "golden_ingot": "Golden Ingot", 
  "golden_nugget": "Golden Nugget", 
  "furnace": "Furnace", 
  "anvil": "Anvil", 
  "woodchip": "Woodchip", 
  "sharpening": "Sharpened", 
  "chest": "Chest"
}

//Structures
let structures = {
  "dungeon": {
    name: "dungeon", 
    blockmap: {
      "O": "stone_bricks", 
      "_": "none", 
      "X": "chest"
    }, 
    lootPool: {
      "O": {
        "iron_ingot": [0, 1, 1, 1, 1, 2, 2, 2, 2, 3], 
        "golden_ingot": [0, 0, 0, 0, 0, 1, 1, 1, 2, 3], 
        "log": [1, 1, 1, 2, 2, 3], 
        "stone_bricks": [0, 1, 2, 3, 4, 5]
      }
    }, 
    width: 4, 
    height: 4, 
    shape: [
      ["O", "O", "O", "O"], 
      ["O", "_", "_", "O"], 
      ["O", "_", "X", "O"], 
      ["O", "O", "O", "O"]
    ], 
    lootShape: [
      ["", "", "", ""], 
      ["", "", "", ""], 
      ["", "", "O", ""], 
      ["", "", "", ""]
    ], 
    biomes: ["plains", "forest", "desert"], 
    distFromSurface: 6, 
    rarity: 40
  }, 
  "water_well": {
    name: "water_well", 
    blockmap: {
      "O": "stone_bricks", 
      "_": "none", 
      "=": "log", 
      "w": "water"
    }, 
    lootPool: {}, 
    width: 3, 
    height: 7, 
    shape: [
      ["=", "=", "="], 
      ["_", "_", "_"], 
      ["O", "w", "O"], 
      ["O", "w", "O"], 
      ["O", "w", "O"], 
      ["O", "w", "O"], 
      ["O", "w", "O"]
    ], 
    lootShape: [
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""]
    ], 
    biomes: ["plains", "forest", "desert"], 
    distFromSurface: -1, 
    rarity: 50
  }
}
let surfaceYMap = [];

//Block Track
let block = {};
let blockElements = {};

//Misc
let craftProgress = 0;
let isQPressed = false;
let inventoryShown = false;
let furnaceOpen = false;
let anvilOpen = false;
let chestOpen = false;
let blockEntityOpened = undefined;
let blockEntityOpenedRow = "";
let blockEntityOpenedColumn = "";
let lastAttack = 0;
let isDebug = false;

document.querySelector(".inventory").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
document.querySelector(".hotbar").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));
document.querySelector(".mouse-holding-item").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
document.querySelector(".selected-slot").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));
document.querySelector(".furnace").setAttribute("data-fur", (furnaceOpen ? "true" : "false"));
document.querySelector(".anvil").setAttribute("data-anv", (anvilOpen ? "true" : "false"));
document.querySelector(".chest").setAttribute("data-chest", (chestOpen ? "true" : "false"));

const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

function randomFromArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}
function getKeyString(x, y) {
	return `${x}x${y}`;
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
function isSolid(x, y) {
  return false;
}
function getRandomSafeSpot() {
  let x = Math.floor(Math.random() * 13);
  let y = Math.floor(Math.random() * 11);
  while(isSolid(x, y))
  {
    x = Math.floor(Math.random() * 13);
    y = Math.floor(Math.random() * 11);
  }
  return {x, y};
}

var M = 4294967296, 
A = 1664525, 
C = 1;
var Z = Math.floor(seed * M);
function rand(){
  Z = (A * Z + C) % M;
  return Z / M - 0.5;
};

function interpolate(pa, pb, px){
  var ft = px * Math.PI,
  f = (1 - Math.cos(ft)) * 0.5;
  return pa * (1 - f) + pb * f;
}

function onClickItem(slotID) {
  if(inventoryShown || anvilOpen || chestOpen)
  {
    if(Inventory[slotID].item == "none" && slotID != 22)
    {
      if(!isQPressed) {
        Inventory[slotID].item = inventoryMouseSlot.item;
        Inventory[slotID].amount = inventoryMouseSlot.amount;
        Inventory[slotID].refinements = inventoryMouseSlot.refinements;
        Inventory[slotID].durability = inventoryMouseSlot.durability;
        inventoryMouseSlot.item = "none";
        inventoryMouseSlot.amount = 0;
        inventoryMouseSlot.refinements = {};
        inventoryMouseSlot.durability = 1;
      } else if(Inventory[slotID].amount < 16){
        Inventory[slotID].item = inventoryMouseSlot.item;
        Inventory[slotID].amount += 1;
        Inventory[slotID].refinements = inventoryMouseSlot.refinements;
        Inventory[slotID].durability = inventoryMouseSlot.durability;
        inventoryMouseSlot.amount--;
        if(inventoryMouseSlot.amount <= 0)
        {
          inventoryMouseSlot.item = "none";
          inventoryMouseSlot.refinements = {};
          inventoryMouseSlot.durability = 1;
        }
      }
    } else if(inventoryMouseSlot.item == "none"){
      inventoryMouseSlot.item = Inventory[slotID].item;
      inventoryMouseSlot.amount = Inventory[slotID].amount;
      inventoryMouseSlot.refinements = Inventory[slotID].refinements;
      inventoryMouseSlot.durability = Inventory[slotID].durability;
      Inventory[slotID].item = "none";
      Inventory[slotID].amount = 0;
      Inventory[slotID].refinements = {};
      Inventory[slotID].durability = 1;
    } else if((inventoryMouseSlot.item != Inventory[slotID].item || (ItemProperties[inventoryMouseSlot.item].stackSize == 1 && ItemProperties[Inventory[slotID].item].stackSize == 1)) && slotID != 22) {
      let saveSlot = {
        item: inventoryMouseSlot.item, 
        amount: inventoryMouseSlot.amount, 
        refinements: inventoryMouseSlot.refinements, 
        durability: inventoryMouseSlot.durability
      };
      inventoryMouseSlot.item = Inventory[slotID].item;
      inventoryMouseSlot.amount = Inventory[slotID].amount;
      inventoryMouseSlot.refinements = Inventory[slotID].refinements;
      inventoryMouseSlot.durability = Inventory[slotID].durability;
      Inventory[slotID].item = saveSlot.item;
      Inventory[slotID].amount = saveSlot.amount;
      Inventory[slotID].refinements = saveSlot.refinements;
      Inventory[slotID].durability = saveSlot.durability;
    } else if(slotID != 22){
      if(!isQPressed)
      {
        while(Inventory[slotID].amount < ItemProperties[Inventory[slotID].item].stackSize)
        {
          Inventory[slotID].amount++;
          inventoryMouseSlot.amount--;
          if (inventoryMouseSlot.amount <= 0)
          {
            inventoryMouseSlot.item = "none";
            inventoryMouseSlot.refinements = {};
            inventoryMouseSlot.durability = 1;
            break;
          }
        }
      } else if(Inventory[slotID].amount < ItemProperties[inventoryMouseSlot.item].stackSize){
        Inventory[slotID].item = inventoryMouseSlot.item;
        Inventory[slotID].amount += 1;
        inventoryMouseSlot.amount--;
        if(inventoryMouseSlot.amount <= 0)
        {
          inventoryMouseSlot.item = "none";
          inventoryMouseSlot.refinements = {};
          inventoryMouseSlot.durability = 1;
        }
      }
    }
  }
}
function onClickItemInWorkplace(slotID) {
  if(anvilOpen || chestOpen)
  {
    if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].item == "none")
    {
      if(!isQPressed) {
        firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/" + slotID).update({
          item: inventoryMouseSlot.item, 
          amount: inventoryMouseSlot.amount, 
          refinements: inventoryMouseSlot.refinements, 
          durability: inventoryMouseSlot.durability
        })
        inventoryMouseSlot.item = "none";
        inventoryMouseSlot.amount = 0;
        inventoryMouseSlot.refinements = {};
        inventoryMouseSlot.durability = 1;
      } else if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].amount < 16){
        firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/" + slotID).update({
          item: inventoryMouseSlot.item, 
          amount: block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].amount + 1, 
          refinements: inventoryMouseSlot.refinements, 
          durability: inventoryMouseSlot.durability
        })
        inventoryMouseSlot.amount--;
        if(inventoryMouseSlot.amount <= 0)
        {
          inventoryMouseSlot.item = "none";
          inventoryMouseSlot.refinements = {};
          inventoryMouseSlot.durability = 1;
        }
      }
    } else if(inventoryMouseSlot.item == "none"){
      inventoryMouseSlot.item = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].item;
      inventoryMouseSlot.amount = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].amount;
      if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].refinements != undefined) inventoryMouseSlot.refinements = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].refinements;
      inventoryMouseSlot.durability = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].durability;
      firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/" + slotID).update({
        item: "none", 
        amount: 0, 
        refinements: {}, 
        durability: 1
      })
    } else if((inventoryMouseSlot.item != block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].item || (ItemProperties[inventoryMouseSlot.item].stackSize == 1 && ItemProperties[block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].item].stackSize == 1)) && slotID != 22) {
      let saveSlot = {
        item: inventoryMouseSlot.item, 
        amount: inventoryMouseSlot.amount, 
        refinements: inventoryMouseSlot.refinements, 
        durability: inventoryMouseSlot.durability
      };
      inventoryMouseSlot.item = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].item;
      inventoryMouseSlot.amount = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].amount;
      if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].refinements != undefined) inventoryMouseSlot.refinements = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].refinements;
      inventoryMouseSlot.durability = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].durability;
      firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/" + slotID).update({
        item: saveSlot.item, 
        amount: saveSlot.amount, 
        refinements: saveSlot.refinements, 
        durability: saveSlot.durability
      })
    } else {
      if(!isQPressed)
      {
        while(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].amount < ItemProperties[block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].item].stackSize)
        {
          firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/" + slotID).update({
            amount: block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].amount + 1
          })
          inventoryMouseSlot.amount--;
          if (inventoryMouseSlot.amount <= 0)
          {
            inventoryMouseSlot.item = "none";
            inventoryMouseSlot.refinements = {};
            inventoryMouseSlot.durability = 1;
            break;
          }
        }
      } else if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].amount < ItemProperties[inventoryMouseSlot.item].stackSize){
        firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/" + slotID).update({
          item: inventoryMouseSlot.item, 
          amount: block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[slotID].amount + 1
        })
        inventoryMouseSlot.amount--;
        if(inventoryMouseSlot.amount <= 0)
        {
          inventoryMouseSlot.item = "none";
          inventoryMouseSlot.refinements = {};
          inventoryMouseSlot.durability = 1;
        }
      }
    }
  }
}

function craftItem() {
  if(inventoryShown && craftProgress == 0)
  {
    let itemCrafted = "none";
    let craftInterval = 5;
    let craftAmount = 1;
    for (var i = 0; i < craftingRecipes.length; i++) {
      if((craftingRecipes[i].recipe[0] == Inventory[20].item && craftingRecipes[i].recipe[1] == Inventory[21].item) || (craftingRecipes[i].recipe[0] == Inventory[21].item && craftingRecipes[i].recipe[1] == Inventory[20].item && craftingRecipes[i].pattern == false) && craftingRecipes[i].workplace == "hand")
      {
        itemCrafted = craftingRecipes[i].item;
        craftInterval = (craftingRecipes[i].duration * 1000) / 10;
        craftAmount = craftingRecipes[i].amount;
        break;
      }
    }
    if(itemCrafted != "none")
    {
      setTimeout(() => {
        craftProgress++;
        setTimeout(() => {
          craftProgress++;
          setTimeout(() => {
            craftProgress++;
            setTimeout(() => {
              craftProgress++;
              setTimeout(() => {
                craftProgress++;
                setTimeout(() => {
                  craftProgress++;
                  setTimeout(() => {
                    craftProgress++;
                    setTimeout(() => {
                      craftProgress++;
                      setTimeout(() => {
                        craftProgress++;
                        setTimeout(() => {
                          craftProgress++;
                          itemCrafted = "none";
                          for (var i = 0; i < craftingRecipes.length; i++) {
                            if((craftingRecipes[i].recipe[0] == Inventory[20].item && craftingRecipes[i].recipe[1] == Inventory[21].item) || (craftingRecipes[i].recipe[0] == Inventory[21].item && craftingRecipes[i].recipe[1] == Inventory[20].item && craftingRecipes[i].pattern == false) && craftingRecipes[i].workplace == "hand")
                            {
                              itemCrafted = craftingRecipes[i].item;
                              break;
                            }
                          }
                          if(itemCrafted != "none")
                          {
                            Inventory[20].amount--;
                            if(Inventory[20].amount <= 0)
                            {
                              Inventory[20].item = "none";
                              Inventory[20].amount = 0;
                              Inventory[20].refinements = {};
                              Inventory[20].durability = 1;
                            }
                            Inventory[21].amount--;
                            if(Inventory[21].amount <= 0)
                            {
                              Inventory[21].item = "none";
                              Inventory[21].amount = 0;
                              Inventory[21].refinements = {};
                              Inventory[21].durability = 1;
                            }
                            Inventory[22].item = itemCrafted;
                            Inventory[22].amount += craftAmount;
                            Inventory[22].durability = ItemProperties[itemCrafted].durability;
                          }
                          craftProgress = 0;
                        }, craftInterval)
                      }, craftInterval)
                    }, craftInterval)
                  }, craftInterval)
                }, craftInterval)
              }, craftInterval)
            }, craftInterval)
          }, craftInterval)
        }, craftInterval)
      }, craftInterval)
    }
  }
}

function anvilItem() {
  if(anvilOpen && craftProgress == 0)
  {
    let itemCrafted = "none";
    let craftInterval = 5;
    let craftAmount = 1;
    let canRefine = true;
    for (var i = 0; i < craftingRecipes.length; i++) {
      if((craftingRecipes[i].recipe[0] == block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[0].item && craftingRecipes[i].recipe[1] == block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[1].item) && craftingRecipes[i].workplace == "anvil")
      {
        if(craftingRecipes[i].data != undefined && craftingRecipes[i].data.refinements != undefined)
        {
          for (var k = 0; k < craftingRecipes[i].data.refinements.length; k++) {
            if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[0].refinements != null && block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[0].refinements[craftingRecipes[i].data.refinements[k].name] != null && block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[0].refinements[craftingRecipes[i].data.refinements[k].name].level + craftingRecipes[i].data.refinements[k].level > 4)
            {
              canRefine = false;
            }
          }
        }
        if(canRefine)
        {
          itemCrafted = craftingRecipes[i].item;
          craftInterval = (craftingRecipes[i].duration * 1000) / 10;
          craftAmount = craftingRecipes[i].amount;
        }
        break;
      }
    }
    if(itemCrafted != "none")
    {
      setTimeout(() => {
        craftProgress++;
        setTimeout(() => {
          craftProgress++;
          setTimeout(() => {
            craftProgress++;
            setTimeout(() => {
              craftProgress++;
              setTimeout(() => {
                craftProgress++;
                setTimeout(() => {
                  craftProgress++;
                  setTimeout(() => {
                    craftProgress++;
                    setTimeout(() => {
                      craftProgress++;
                      setTimeout(() => {
                        craftProgress++;
                        setTimeout(() => {
                          craftProgress++;
                          itemCrafted = "none";
                          let refinementsEdit = [];
                          for (var i = 0; i < craftingRecipes.length; i++) {
                            if(craftingRecipes[i].workplace == "anvil" && (craftingRecipes[i].recipe[0] == block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[0].item && craftingRecipes[i].recipe[1] == block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[1].item))
                            {
                              itemCrafted = craftingRecipes[i].item;
                              if(craftingRecipes[i].data != undefined && craftingRecipes[i].data.refinements != undefined)
                              {
                                for (var j = 0; j < craftingRecipes[i].data.refinements.length; j++) {
                                  refinementsEdit.push(craftingRecipes[i].data.refinements[j]);
                                }
                              }
                              break;
                            }
                          }
                          if(itemCrafted != "none")
                          {
                            firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/1").update({
                              amount: block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[1].amount - 1
                            })
                            if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[1].amount <= 0)
                            {
                              firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/1").update({
                                item: "none", 
                                amount: 0, 
                                refinements: {}, 
                                durability: 1
                              })
                            }
                            firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/0").update({
                              item: itemCrafted, 
                              amount: craftAmount, 
                              durability: ItemProperties[itemCrafted].durability
                            })
                            for (var i = 0; i < refinementsEdit.length; i++) {
                              if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[0].refinements != null && block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[0].refinements[refinementsEdit[i].name] != null)
                              {
                                firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/0/refinements/" + refinementsEdit[i].name).update({
                                  level: block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[0].refinements[refinementsEdit[i].name].level + refinementsEdit[i].level
                                })
                              } else {
                                firebase.database().ref("block/" + blockEntityOpenedRow + "/" + blockEntityOpenedColumn + "/data/blockInventory/0/refinements/" + refinementsEdit[i].name).set({
                                  name: refinementsEdit[i].name, 
                                  level: refinementsEdit[i].level
                                })
                              }
                            }
                          }
                          craftProgress = 0;
                        }, craftInterval)
                      }, craftInterval)
                    }, craftInterval)
                  }, craftInterval)
                }, craftInterval)
              }, craftInterval)
            }, craftInterval)
          }, craftInterval)
        }, craftInterval)
      }, craftInterval)
    }
  }
}

function calculateDelta(lastTick) {
  currentTick = timer / 50;
  deltaTime = Math.round(currentTick - lastTick);
}

function calculateDeltaForMovement(lastDelta) {
  deltaTimeForMovement = (deltaTime - lastDelta < 3 ? Math.round((deltaTime + lastDelta) / 2) : lastDelta);
  deltaCollection.shift();
  deltaCollection.push(deltaTimeForMovement);
  averageDelta = 0;
  for (var i = 0; i < deltaCollection.length; i++) {
    averageDelta += deltaCollection[i];
  }
  averageDelta = averageDelta / 10;
  if(averageDelta < 2) averageDelta = 2;
  //document.querySelector("#logger").innerText = averageDelta;
}

(function() {
	let playerId;
	let playerRef;
  let players = {};
  let playerElements = {};
  let isButton = false;
  let chatMsg = 0;

  const gameContainer = document.querySelector(".game-container");
  const respawnContainer = document.querySelector(".respawn-container");
  const playerNameInput = document.querySelector("#player-name");
  const playerColorButton = document.querySelector("#player-color");
  const chatSend = document.querySelector("#send-chat");
  const chatInput = document.querySelector("#chat-input");
  const chatDisplay = document.querySelector("#chat-display");

  function addToInventory(item, amount) {
    for (var i = 0; i < amount; i++) {
      let foundExistingItemStack = false;
      for (var j = 0; j < 20; j++) {
        if(Inventory[j].item == item && Inventory[j].amount < ItemProperties[Inventory[j].item].stackSize)
        {
          foundExistingItemStack = true;
          Inventory[j].item = item;
          Inventory[j].amount++;
          Inventory[j].durability = ItemProperties[item].durability;
          break;
        }
      }
      for (var j = 0; j < 20; j++) {
        if(Inventory[j].item == "none" && !foundExistingItemStack)
        {
          Inventory[j].item = item;
          Inventory[j].amount++;
          Inventory[j].durability = ItemProperties[item].durability;
          break;
        }
      }
    }
  }
  function oneSecondLoop() {
    if(players[playerId] != null) {
      if(inWater && timeSinceSpawn >= 5)
      {
        timeInWater++;
      } else {
        timeInWater = 0;
      }
      if(timeInWater >= 5 && !players[playerId].isDead)
      {
        playerRef.update({
          health: players[playerId].health - 1
        })
      }
      if(players[playerId].y > 15 && !players[playerId].isDead)
      {
        playerRef.update({
          health: players[playerId].health - 1
        })
      }
      timeSinceSpawn++;
      if(players[playerId].isDead > 0 && !isButton) {
        timeInWater = 0;
        const buttonElement = document.createElement("div");
        buttonElement.classList.add("respawnButton");
        buttonElement.innerHTML = (`
          <button id="respawn">Respawn</button>
        `)
        const respawnButton = buttonElement.querySelector("#respawn");
        respawnButton.addEventListener("click", () => {
          isButton = false;
          respawnContainer.querySelector(".respawnButton").remove();
          playerRef.update({
            isDead: false, 
            coins: 0, 
            health: 10, 
            x: 1, 
            y: -5, 
          })
          xVel = 0;
          yVel = 0;
          timeSinceSpawn = 0;
        })
        respawnContainer.appendChild(buttonElement);
        isButton = true;
      }
    }

    //repeat
    setTimeout(() => {
      oneSecondLoop();
    }, 1000);
  }
  function regenLoop() {
    if(players[playerId] != null) {
      if(players[playerId].health < 10)
      {
        playerRef.update({
          health: players[playerId].health + 1
        })
      }
    }

    //repeat
    setTimeout(() => {
      regenLoop();
    }, 30000);
  }
  function worldLoop() {
    Object.keys(block).forEach((outerkey) => {
      const layerState = block[outerkey];
      Object.keys(layerState).forEach((key) => {
        const blockState = layerState[key];
        if(blockState.type == "grass")
        {
          let blockAbove = false;
          Object.keys(block).forEach((outertkey) => {
            const layerStateT = block[outertkey];
            Object.keys(layerStateT).forEach((tkey) => {
              const blockStateT = layerStateT[tkey];
              if(blockStateT.y === blockState.y - 1 && blockStateT.x == blockState.x && Math.random() > 0.3 && blockStateT.sizeX > 0.0)
              {
                firebase.database().ref("block/layer" + blockState.y + "/" + blockState.id).update({
                  type: "dirt"
                });//blockState.type = "dirt";
              }
              if(blockStateT.y === blockState.y - 1 && blockStateT.x == blockState.x)
              {
                blockAbove = true;
              }
            })
          })
          if(Math.random() < 0.5 && !blockAbove)
          {
            let growGrass = firebase.database().ref(`block/layer` + Math.round(blockState.y-1) + `/pn` + Math.round(blockState.x) + "x" + Math.round(blockState.y-1));
            growGrass.set({
              x: Math.round(blockState.x), 
              y: Math.round(blockState.y-1), 
              id: "pn" + Math.round(blockState.x) + "x" + Math.round(blockState.y-1), 
              type: "tall_grass", 
              sizeX: BlockProperties["tall_grass"].sizeX, 
              sizeY: BlockProperties["tall_grass"].sizeY,
              centerX: BlockProperties["tall_grass"].centerX, 
              centerY: BlockProperties["tall_grass"].centerY,  
              hp: 5, 
              strength: BlockProperties["tall_grass"].strength, 
              data: {}
            })
          }
        }
        if(blockState.type == "dirt")
        {
          let found = false;
          Object.keys(block).forEach((outertkey) => {
            const layerStateT = block[outertkey];
            Object.keys(layerStateT).forEach((tkey) => {
              const blockStateT = layerStateT[tkey];
              if(blockStateT.y === blockState.y - 1 && blockStateT.x == blockState.x && blockStateT.sizeX > 0.0)
              {
                found = true;
              }
            })
          })
          if(!found)
          {
            firebase.database().ref("block/layer" + blockState.y + "/" + blockState.id).update({
              type: "grass"
            });//blockState.type = "dirt";
          }
        }
      })
    })
    //repeat
    setTimeout(() => {
      worldLoop();
    }, 60000);
  }
  function tickLoop() {
    thisTime = new Date();
    timer = thisTime.getTime() - startTime;
    calculateDelta(currentTick);
    calculateDeltaForMovement(deltaTimeForMovement);
    if(players[playerId] != null) {
      if(players[playerId].health <= 0) {
        playerRef.update({
          isDead: true
        })
      }
      document.querySelector(".ui-health-bar").style.background = "url(images/health-bar/health-bar-" + players[playerId].health + ".png) no-repeat no-repeat";
      for (var i = 0; i < 5; i++) {
        document.querySelector(".hotbar-item-ui-" + (i+1)).style.background = "url(images/" + Inventory[i].item + ".png) no-repeat no-repeat";
        for (const child of document.querySelector(".hotbar-item-ui-" + (i+1)).children) {
          if(child.className == "stack-number")
          {
            child.innerText = Inventory[i].amount;
            if(Inventory[i].amount <= 1) child.innerText = "";
          }
          if(child.className == "tooltips")
          {
            let RefinementText = "";
            Object.keys(Inventory[i].refinements).forEach((key) => {
              const thisrefinement = Inventory[i].refinements[key];
              RefinementText += "<br>- " + lang[key] + " " + thisrefinement.level + " times";
            })
            let DurabilityText = "";
            if(Inventory[i].durability < 1000000000) DurabilityText = "<br>Durability: " + Inventory[i].durability + " / " + ItemProperties[Inventory[i].item].durability;
            child.innerHTML = lang[Inventory[i].item] + RefinementText + DurabilityText;
            if(Inventory[i].item == "none") child.innerText = "";
            child.setAttribute("data-content", Inventory[i].item);
          }
        }
      }
      for (var i = 5; i < 20; i++) {
        document.querySelector(".inventory-item-ui-" + (i-4)).style.background = "url(images/" + Inventory[i].item + ".png) no-repeat no-repeat";
        for (const child of document.querySelector(".inventory-item-ui-" + (i-4)).children) {
          if(child.className == "stack-number")
          {
            child.innerText = Inventory[i].amount;
            if(Inventory[i].amount <= 1) child.innerText = "";
          }
          if(child.className == "tooltips")
          {
            let RefinementText = "";
            Object.keys(Inventory[i].refinements).forEach((key) => {
              const thisrefinement = Inventory[i].refinements[key];
              RefinementText += "<br>- " + lang[key] + " " + thisrefinement.level + " times";
            })
            let DurabilityText = "";
            if(Inventory[i].durability < 1000000000) DurabilityText = "<br>Durability: " + Inventory[i].durability + " / " + ItemProperties[Inventory[i].item].durability;
            child.innerHTML = lang[Inventory[i].item] + RefinementText + DurabilityText;
            if(Inventory[i].item == "none") child.innerText = "";
            child.setAttribute("data-content", Inventory[i].item);
          }
        }
      }
      for (var i = 20; i < 23; i++) {
        document.querySelector(".hand-crafting-item-ui-" + (i-19)).style.background = "url(images/" + Inventory[i].item + ".png) no-repeat no-repeat";
        for (const child of document.querySelector(".hand-crafting-item-ui-" + (i-19)).children) {
          if(child.className == "stack-number")
          {
            child.innerText = Inventory[i].amount;
            if(Inventory[i].amount <= 1) child.innerText = "";
          }
          if(child.className == "tooltips")
          {
            let RefinementText = "";
            Object.keys(Inventory[i].refinements).forEach((key) => {
              const thisrefinement = Inventory[i].refinements[key];
              RefinementText += "<br>- " + lang[key] + " " + thisrefinement.level + " times";
            })
            let DurabilityText = "";
            if(Inventory[i].durability < 1000000000) DurabilityText = "<br>Durability: " + Inventory[i].durability + " / " + ItemProperties[Inventory[i].item].durability;
            child.innerHTML = lang[Inventory[i].item] + RefinementText + DurabilityText;
            if(Inventory[i].item == "none") child.innerText = "";
            child.setAttribute("data-content", Inventory[i].item);
          }
        }
      }
      if(blockEntityOpened != undefined && block[blockEntityOpenedRow][blockEntityOpenedColumn] != undefined)
      {
        if(block[blockEntityOpenedRow][blockEntityOpenedColumn].type == "anvil")
        {
          for (var i = 0; i < 2; i++) {
            document.querySelector(".anvil-item-ui-" + (i+1)).style.background = "url(images/" + block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item + ".png) no-repeat no-repeat";
            for (const child of document.querySelector(".anvil-item-ui-" + (i+1)).children) {
              if(child.className == "stack-number")
              {
                child.innerText = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].amount;
                if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].amount <= 1) child.innerText = "";
              }
              if(child.className == "tooltips")
              {
                let RefinementText = "";
                if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].refinements != null)
                {
                  Object.keys(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].refinements).forEach((key) => {
                    const thisrefinement = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].refinements[key];
                    RefinementText += "<br>- " + lang[key] + " " + thisrefinement.level + " times";
                  })
                }
                let DurabilityText = "";
                if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].durability < 1000000000) DurabilityText = "<br>Durability: " + block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].durability + " / " + ItemProperties[block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item].durability;
                child.innerHTML = lang[block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item] + RefinementText + DurabilityText;
                if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item == "none") child.innerText = "";
                child.setAttribute("data-content", block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item);
              }
            }
          }
        }
        if(block[blockEntityOpenedRow][blockEntityOpenedColumn].type == "chest")
        {
          for (var i = 0; i < 15; i++) {
            document.querySelector(".chest-item-ui-" + (i+1)).style.background = "url(images/" + block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item + ".png) no-repeat no-repeat";
            for (const child of document.querySelector(".chest-item-ui-" + (i+1)).children) {
              if(child.className == "stack-number")
              {
                child.innerText = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].amount;
                if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].amount <= 1) child.innerText = "";
              }
              if(child.className == "tooltips")
              {
                let RefinementText = "";
                if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].refinements != null)
                {
                  Object.keys(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].refinements).forEach((key) => {
                    const thisrefinement = block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].refinements[key];
                    RefinementText += "<br>- " + lang[key] + " " + thisrefinement.level + " times";
                  })
                }
                let DurabilityText = "";
                if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].durability < 1000000000) DurabilityText = "<br>Durability: " + block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].durability + " / " + ItemProperties[block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item].durability;
                child.innerHTML = lang[block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item] + RefinementText + DurabilityText;
                if(block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item == "none") child.innerText = "";
                child.setAttribute("data-content", block[blockEntityOpenedRow][blockEntityOpenedColumn].data.blockInventory[i].item);
              }
            }
          }
        }
      }
      document.querySelector(".mouse-holding-item").style.background = "url(images/" + inventoryMouseSlot.item + ".png) no-repeat no-repeat";
      document.querySelector(".selected-slot").style.left = (45 + (currentSlot * 32)) + "px";
      document.querySelector(".crafting-progress-bar").style.background = "url(images/crafting-progress/crafting-" + craftProgress + ".png)"
      document.querySelector(".anvil-progress-bar").style.background = "url(images/crafting-progress/crafting-" + craftProgress + ".png)"

      document.querySelector("#left-move").setAttribute("data-pressed", mobileMovement.x[0]);
      document.querySelector("#right-move").setAttribute("data-pressed", mobileMovement.x[1]);

      if(isJump && (isOnGround || inWater) && !(inventoryShown || anvilOpen || chestOpen) && document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT')
      {
        yVel = -0.12 * Math.floor(averageDelta);
        deltaBeforeJump = Math.floor(averageDelta);
      }
      xVel = 0;
      if((isD || isRight) && !(inventoryShown || anvilOpen || chestOpen) && document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT')
      {
        xVel += 0.06 * Math.min(3, averageDelta);
      }
      if((isA || isLeft) && !(inventoryShown || anvilOpen || chestOpen) && document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT')
      {
        xVel -= 0.06 * Math.min(3, averageDelta);
      }
      if(isMobile == "true")
      {
        xVel = (mobileMovement.x[1] - mobileMovement.x[0]) * 0.06 * Math.min(3, averageDelta);
      }
      yVel += 0.01 * deltaBeforeJump;
      //handleMovement(0, yVel);
      handleMovement(xVel, 0);
      handleMovement(0, yVel);
    }
    localStorage.setItem("myOldBlockId", myBlockId);

    //repeat
    setTimeout(() => {
      tickLoop();
    }, 50);
  }
  function renderLoop() {
    Object.keys(block).forEach((key) => {
      const rows = block[key];
      if(!(key.slice(5) - myY > renderDistance || key.slice(5) - myY < -renderDistance))
      {
        if(blockElements[key] != undefined) blockElements[key][Object.keys(blockElements[key])[0]].parentNode.setAttribute("data-far", "false");
        Object.keys(rows).forEach((row) => {
          const blockState = rows[row];
          if(!(blockState.x - myX > renderDistance || blockState.x - myX < -renderDistance))
          {
            let el = blockElements["layer" + blockState.y][blockState.id];
            const left = 16 * ((blockState.x - myX) + 7) + "px";
            const top = 16 * ((blockState.y - myY) + 7) + "px";
            const zlayer = blockState.type == "water" ? "2px" : "0px";
            el.style.transform = `translate3d(${left}, ${top}, ${zlayer})`;
            el.querySelector(".Block_sprite").setAttribute("data-far", "false");
            el.querySelector(".Block_break_sprite_overlay").setAttribute("data-far", "false");
            el.querySelector(".Block_sprite").setAttribute("data-type", blockState.type);
          } else {
            let el = blockElements["layer" + blockState.y][blockState.id];
            el.querySelector(".Block_sprite").setAttribute("data-far", "true");
            el.querySelector(".Block_break_sprite_overlay").setAttribute("data-far", "true");
          }
        })
      } else {
        if(blockElements[key] != undefined) blockElements[key][Object.keys(blockElements[key])[0]].parentNode.setAttribute("data-far", "true");
      }
    })

    //repeat
    setTimeout(() => {
      renderLoop();
    }, 20);
  }
  function mineLoop() {
    if(mouseDown && !(inventoryShown || furnaceOpen || anvilOpen || chestOpen))
    {
      let margin = {x: (screenDim.x - 720) / 2, y: (screenDim.y - 624) / 2};
      mouseTile = {x: Math.floor((((mousePos.x + ((myX - 7) * 48)) - margin.x)) / 48), y: Math.floor(((mousePos.y + ((myY - 7) * 48)) - margin.y) / 48)};
      let isBlock = false;
      Object.keys(block).forEach((key) => {
        const rows = block[key];
        Object.keys(rows).forEach((row) => {
          const blockState = rows[row];
          if(blockState.x === mouseTile.x && blockState.y === mouseTile.y)
          {
            isBlock = true;
          }
          if(blockState.x === mouseTile.x && blockState.y === mouseTile.y && action != 2)
          {
            let hpRed = 0;
            if(mineIdx % blockState.strength == 0)
            {
              hpRed = 1;
            }
            if(ItemProperties[Inventory[currentSlot].item].toolType == BlockTraits[blockState.type].breakWith && mineIdx % Math.round(blockState.strength * toolTierBreakSpeed[ItemProperties[Inventory[currentSlot].item].toolTier]) == 0)
            {
              hpRed = 1;
            }
            if(hpRed > 0 && BlockProperties[blockState.type].wasteDurability && Math.random() > 0.5 && Inventory[currentSlot].durability < 1000000000)
            {
              Inventory[currentSlot].durability--;
              if(Inventory[currentSlot].durability <= 0)
              {
                Inventory[currentSlot].item = "none";
                Inventory[currentSlot].amount = 0;
                Inventory[currentSlot].refinements = {};
                Inventory[currentSlot].durability = 1;
              }
            }
            firebase.database().ref("block/layer" + blockState.y + "/" + row).update({
              hp: blockState.hp - hpRed
            })
            if(blockState.hp - 1 < 0)
            {
              addToInventory(randomFromArray(BlockTraits[blockState.type].drop), randomFromArray(BlockTraits[blockState.type].amount));
              firebase.database().ref("block/layer" + blockState.y + "/" + row).remove();
            }
            action = 1;
          }
        })
      })
      let beside = false;
      Object.keys(block).forEach((key) => {
        const rows = block[key];
        Object.keys(rows).forEach((row) => {
          const blockState = rows[row];
          if(blockState.x === mouseTile.x - 1 && blockState.y === mouseTile.y)
          {
            beside = true;
          }
          if(blockState.x === mouseTile.x + 1 && blockState.y === mouseTile.y)
          {
            beside = true;
          }
          if(blockState.x === mouseTile.x && blockState.y === mouseTile.y - 1)
          {
            beside = true;
          }
          if(blockState.x === mouseTile.x && blockState.y === mouseTile.y + 1)
          {
            beside = true;
          }
        })
      })
      if(!isBlock && action != 1 && beside && Inventory[currentSlot].amount > 0 && ItemProperties[Inventory[currentSlot].item].isPlaceable)
      {
        blockRef = firebase.database().ref(`block/layer` + mouseTile.y + `/` + playerId + myBlockId);
        blockRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          id: playerId + myBlockId, 
          type: Inventory[currentSlot].item, 
          sizeX: BlockProperties[Inventory[currentSlot].item].sizeX, 
          sizeY: BlockProperties[Inventory[currentSlot].item].sizeY,
          centerX: BlockProperties[Inventory[currentSlot].item].centerX, 
          centerY: BlockProperties[Inventory[currentSlot].item].centerY,  
          hp: 5, 
          strength: BlockProperties[Inventory[currentSlot].item].strength, 
          data: BlockTraits[Inventory[currentSlot].item].dataRequired
        })
        myBlockId++;
        action = 2;
        Inventory[currentSlot].amount--;
        if(Inventory[currentSlot].amount == 0)
        {
          Inventory[currentSlot].item = "none";
        }
      }
    }
    mineIdx += 1;

    //repeat
    setTimeout(() => {
      mineLoop();
    }, 10);
  }
  function handleMovement(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    const oldX = players[playerId].x;
    const oldY = players[playerId].y;
    if (!players[playerId].isDead) {
      //move to the next space
      players[playerId].x = newX;
      players[playerId].y = newY;
      if(yChange < 0)
      {
        yVel = yChange;
      }
      if (xChange > 0) {
        players[playerId].direction = "right";
      }
      if (xChange < 0) {
        players[playerId].direction = "left";
      }
      myX = players[playerId].x;
      myY = players[playerId].y;
      let isCollision = false;
      inWater = false;
      Object.keys(block).forEach((key) => {
        const rows = block[key];
        Object.keys(rows).forEach((row) => {
          const blockState = rows[row];
          if(myX + 0.25 > (blockState.x + blockState.centerX) - (blockState.sizeX/2) && myX - 0.25 < (blockState.x + blockState.centerX) + (blockState.sizeX/2) && (myY - 0.275) + 0.5 > (blockState.y + blockState.centerY) - (blockState.sizeY/2) && (myY - 0.15) - 0.5 < (blockState.y + blockState.centerY) + (blockState.sizeY/2) && !(blockState.sizeX == 0) && !(blockState.type == "water"))
          {
            isCollision = true;
          }
          if(oldX + 0.25 > (blockState.x + blockState.centerX) - (blockState.sizeX/2) && oldX - 0.25 < (blockState.x + blockState.centerX) + (blockState.sizeX/2) && (oldY - 0.275) + 0.5 > (blockState.y + blockState.centerY) - (blockState.sizeY/2) && (oldY - 0.15) - 0.5 < (blockState.y + blockState.centerY) + (blockState.sizeY/2) && !(blockState.sizeX == 0) && !(blockState.type == "water"))
          {
            isCollision = false;
          }
          if(myX + 0.25 > (blockState.x + blockState.centerX) - (blockState.sizeX/2) && myX - 0.25 < (blockState.x + blockState.centerX) + (blockState.sizeX/2) && (myY - 0.275) + 0.5 > (blockState.y + blockState.centerY) - (blockState.sizeY/2) && (myY - 0.15) - 0.5 < (blockState.y + blockState.centerY) + (blockState.sizeY/2) && blockState.type == "water")
          {
            inWater = true;
          }
        })
      })
      isOnGround = false;
      if(isCollision && yChange > 0)
      {
        if(yVel / deltaBeforeJump > 0.18 && !inWater && timeSinceSpawn >= 5)
        {
          playerRef.update({
            health: players[playerId].health - Math.round((yVel / deltaBeforeJump - 0.18) * 80)
          })
        }
        yVel = 0;
        isOnGround = true;
      }
      if(isCollision && yChange < 0)
      {
        yVel = 0.002;
      }
      if(isCollision)
      {
        players[playerId].x = oldX;
        players[playerId].y = oldY;
        myX = players[playerId].x;
        myY = players[playerId].y;
      }
      playerRef.update({
        x: players[playerId].x, 
        y: players[playerId].y, 
        direction: players[playerId].direction, 
      });
    }
    Object.keys(block).forEach((key) => {
      const rows = block[key];
      if(!(key.slice(5) - myY > renderDistance || key.slice(5) - myY < -renderDistance))
      {
        if(blockElements.key != undefined) blockElements[key][Object.keys(blockElements[key])[0]].parentNode.setAttribute("data-far", "false");
        Object.keys(rows).forEach((row) => {
          const blockState = rows[row];
          if(!(blockState.x - myX > renderDistance || blockState.x - myX < -renderDistance))
          {
            let el = blockElements["layer" + blockState.y][blockState.id];
            const left = 16 * ((blockState.x - myX) + 7) + "px";
            const top = 16 * ((blockState.y - myY) + 7) + "px";
            const zlayer = blockState.type == "water" ? "2px" : "0px";
            el.style.transform = `translate3d(${left}, ${top}, ${zlayer})`;
            el.querySelector(".Block_sprite").setAttribute("data-far", "false");
            el.querySelector(".Block_break_sprite_overlay").setAttribute("data-far", "false");
            el.querySelector(".Block_sprite").setAttribute("data-type", blockState.type);
          } else {
            let el = blockElements["layer" + blockState.y][blockState.id];
            el.querySelector(".Block_sprite").setAttribute("data-far", "true");
            el.querySelector(".Block_break_sprite_overlay").setAttribute("data-far", "true");
          }
        })
      } else {
        if(blockElements.key != undefined) blockElements[key][Object.keys(blockElements[key])[0]].parentNode.setAttribute("data-far", "true");
      }
    })
  }
  function generateStoneLayer(y)
  {
    for(let i = -worldRad; i < worldRad; i++) {
      blockRef = firebase.database().ref(`block/layer` + y + `/init` + i + "x" + y);
      blockRef.set({
        x: i, 
        y, 
        id: "init" + i + "x" + y, 
        type: "stone", 
        sizeX: 1.0, 
        sizeY: 1.0,
        centerX: 0.0, 
        centerY: 0.0,  
        hp: 5, 
        strength: 500, 
        data:{}
      })
    }
  }
  function placeBlock(type, x, y, Xs, Ys, str, uniquifier) 
  {
    let blockRef = firebase.database().ref(`block/layer` + y +`/` + uniquifier + x + "x" + y);
    blockRef.set({
      x, 
      y, 
      id: uniquifier + x + "x" + y,  
      type, 
      sizeX: Xs, 
      sizeY: Ys, 
      centerX: 0.0, 
      centerY: 0.0, 
      hp: 5, 
      strength: str, 
      data:{}
    })
  }
  function generateMap()
  {
    let blockRef;
    for(let i = -worldRad; i < worldRad; i++) {
      blockRef = firebase.database().ref(`block/layer10/init` + i + "x" + "10");
      blockRef.set({
        x: i, 
        y: 10, 
        id: "init" + i + "x" + "10", 
        type: "bedrock", 
        sizeX: 1.0, 
        sizeY: 1.0,
        centerX: 0.0, 
        centerY: 0.0,  
        hp: 5, 
        strength: 9000000000000000000000000000000000000000000000000, 
        data:{}
      })
    }
    generateStoneLayer(9);
    generateStoneLayer(8);
    generateStoneLayer(7);
    generateStoneLayer(6);
    generateStoneLayer(5);
    generateStoneLayer(4);
    generateStoneLayer(3);
    generateStoneLayer(2);
    generateStoneLayer(1);

    let changeCount = 0;
    let initBiome = randomFromArray(["plains", "forest", "desert"]);
    let currentBiome = initBiome;
    for (var i = 0; i <= worldRad*2; i++) {
      biomeMap[i] = currentBiome;
      changeCount++;
      if(Math.random() * 20 < changeCount - 6)
      {
        currentBiome = randomFromArray(BiomeRules[currentBiome]);
        changeCount = 0;
      }
    }
    for(let i = -worldRad; i < worldRad; i++) {
      blockRef = firebase.database().ref(`block/layer0/init` + i + "x" + "0");
      let thisGroundBlock = BiomeBlock[biomeMap[i+worldRad]];
      blockRef.set({
        x: i, 
        y: 0, 
        id: "init" + i + "x" + "0", 
        type: thisGroundBlock, 
        sizeX: BlockProperties[thisGroundBlock].sizeX, 
        sizeY: BlockProperties[thisGroundBlock].sizeY,
        centerX: BlockProperties[thisGroundBlock].centerX, 
        centerY: BlockProperties[thisGroundBlock].centerY,  
        hp: 5, 
        strength: BlockProperties[thisGroundBlock].strength, 
        data:{}
      })
    }
    console.log(biomeMap);

    var x = -worldRad,
    y = 10,
    amp = -3, //amplitude
    wl = 5, //wavelength
    a = rand(),
    b = rand(), 
    worldSurface = -2;

    let treePos = [];
    while(x < worldRad){
      if(x % wl === 0){
        a = b;
        b = rand();
        y = worldSurface + a * amp;
      }else{
        y = worldSurface + interpolate(a, b, (x % wl) / wl) * amp;
      }
      surfaceYMap[x+worldRad] = Math.round(y);
      if(biomeMap[x+worldRad] == "ocean")
      {
        y = worldSurface;
      }
      blockRef = firebase.database().ref(`block/layer` + Math.round(y) + `/pn` + Math.round(x) + "x" + Math.round(y));
      let thisGroundBlock = BiomeBlock[biomeMap[x+worldRad]];
      blockRef.set({
        x: Math.round(x), 
        y: Math.round(y), 
        id: "pn" + Math.round(x) + "x" + Math.round(y), 
        type: thisGroundBlock, 
        sizeX: BlockProperties[thisGroundBlock].sizeX, 
        sizeY: BlockProperties[thisGroundBlock].sizeY,
        centerX: BlockProperties[thisGroundBlock].centerX, 
        centerY: BlockProperties[thisGroundBlock].centerY,  
        hp: 5, 
        strength: BlockProperties[thisGroundBlock].strength, 
        data:{}
      })
      if(Math.random() < 0.4 && biomeMap[x+worldRad] != "desert" && biomeMap[x+worldRad] != "ocean")
      {
        blockRef = firebase.database().ref(`block/layer` + Math.round(y-1) + `/pn` + Math.round(x) + "x" + Math.round(y-1));
        blockRef.set({
          x: Math.round(x), 
          y: Math.round(y-1), 
          id: "pn" + Math.round(x) + "x" + Math.round(y-1), 
          type: "tall_grass", 
          sizeX: BlockProperties["tall_grass"].sizeX, 
          sizeY: BlockProperties["tall_grass"].sizeY,
          centerX: BlockProperties["tall_grass"].centerX, 
          centerY: BlockProperties["tall_grass"].centerY,  
          hp: 5, 
          strength: BlockProperties["tall_grass"].strength, 
          data:{}
        })
      }
      if(Math.random() < 0.1 && biomeMap[x+worldRad] != "desert" && biomeMap[x+worldRad] != "ocean")
      {
        treePos.push([Math.round(x), Math.round(y-1)]);
      }
      if(Math.random() < 0.2 && biomeMap[x+worldRad] == "forest")
      {
        treePos.push([Math.round(x), Math.round(y-1)]);
      }
      for(let i = 0; i < Math.abs(Math.round(y)); i++)
      {
        blockRef = firebase.database().ref(`block/layer` + Math.round(y+i) + `/pn` + Math.round(x) + "x" + Math.round(y+i));
        blockRef.set({
          x: Math.round(x), 
          y: Math.round(y+i), 
          id: "pn" + Math.round(x) + "x" + Math.round(y+i), 
          type: thisGroundBlock, 
          sizeX: BlockProperties[thisGroundBlock].sizeX, 
          sizeY: BlockProperties[thisGroundBlock].sizeY,
          centerX: BlockProperties[thisGroundBlock].centerX, 
          centerY: BlockProperties[thisGroundBlock].centerY,  
          hp: 5, 
          strength: BlockProperties[thisGroundBlock].strength, 
          data:{}
        })
        if(Math.round(y+1+i) == 0)
        {
          if(biomeMap[Math.round(x-2)+worldRad] != null && biomeMap[Math.round(x-2)+worldRad] == "ocean" && biomeMap[Math.round(x+worldRad)] == "ocean" && biomeMap[Math.round(x+2)+worldRad] != null && biomeMap[Math.round(x+2)+worldRad] == "ocean")
          {
            firebase.database().ref("block/layer" + (Math.round(y+i)+2) + "/init" + Math.round(x) + "x" + (Math.round(y+i)+2)).update({
              type: "water", 
              sizeX: BlockProperties["water"].sizeX, 
              sizeY: BlockProperties["water"].sizeY, 
              centerX: BlockProperties["water"].centerX, 
              centerY: BlockProperties["water"].centerY, 
              strength: BlockProperties["water"].strength
            });
          }
        }
      }
      x += 1;
    }
    for(var i = 0; i < treePos.length; i++) {
      for (var Hi = 0; Hi < 5; Hi++) {
        if(Math.random() < (1 - (Hi/5)) || Hi < 2)
        {
          blockRef = firebase.database().ref(`block/layer` + (treePos[i][1] - Hi) + `/pn` + treePos[i][0] + "x" + (treePos[i][1] - Hi));
          blockRef.set({
            x: treePos[i][0], 
            y: (treePos[i][1] - Hi), 
            id: "pn" + treePos[i][0] + "x" + (treePos[i][1] - Hi), 
            type: "log", 
            sizeX: 0.0, 
            sizeY: 0.0,
            centerX: 0.0, 
            centerY: 0.0,  
            hp: 5, 
            strength: 30, 
            data:{}
          })
        } else {
          placeBlock("leaves", treePos[i][0], (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
          placeBlock("leaves", treePos[i][0] + 1, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
          placeBlock("leaves", treePos[i][0] - 1, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
          if(Math.random() < 0.6)
          {
            placeBlock("leaves", treePos[i][0] + 2, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0] + 3, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] + 4, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
              }
            }
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0] + 1, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] + 2, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
                if(Math.random() < 0.1)
                {
                  placeBlock("leaves", treePos[i][0] + 3, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
                }
              }
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] + 1, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                if(Math.random() < 0.1)
                {
                  placeBlock("leaves", treePos[i][0] + 2, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                  if(Math.random() < 0.05)
                  {
                    placeBlock("leaves", treePos[i][0] + 3, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                  }
                }
              }
            }
          }
          if(Math.random() < 0.6)
          {
            placeBlock("leaves", treePos[i][0] - 2, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0] - 3, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] - 4, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
              }
            }
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0] - 1, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] - 2, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
                if(Math.random() < 0.1)
                {
                  placeBlock("leaves", treePos[i][0] - 3, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
                }
              }
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] - 1, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                if(Math.random() < 0.1)
                {
                  placeBlock("leaves", treePos[i][0] - 2, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                  if(Math.random() < 0.05)
                  {
                    placeBlock("leaves", treePos[i][0] - 3, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                  }
                }
              }
            }
          }
          if(Math.random() < 0.6)
          {
            placeBlock("leaves", treePos[i][0], (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0], (treePos[i][1] - Hi) - 2, 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0], (treePos[i][1] - Hi) - 3, 0.0, 0.0, 15, "pn");
              }
            }
          }
          break;
        }
      }
    }
    for(let i = -worldRad; i < worldRad; i++) {
      let oreChance = Math.random();
      if(oreChance < 0.2)
      {
        let veinSize = Math.round(Math.random() * 3) + 2;
        let thisY = Math.round((Math.random() * 8) + 1);
        let oreSpawnPos = {
          x: i, 
          y: thisY
        };
        for (var h = 0; h < veinSize; h++) {
          if(oreSpawnPos.y <= 9)
          {
            blockRef = firebase.database().ref("block/layer" + oreSpawnPos.y + "/init" + oreSpawnPos.x + "x" + oreSpawnPos.y);
            blockRef.set({
              x: oreSpawnPos.x, 
              y: oreSpawnPos.y, 
              id: "init" + oreSpawnPos.x + "x" + oreSpawnPos.y, 
              type: "coal_ore", 
              sizeX: BlockProperties["coal_ore"].sizeX, 
              sizeY: BlockProperties["coal_ore"].sizeY,
              centerX: BlockProperties["coal_ore"].centerX, 
              centerY: BlockProperties["coal_ore"].centerY,  
              hp: 5, 
              strength: BlockProperties["coal_ore"].strength, 
              data:{}
            })
            if(Math.random() < 0.5)
            {
              oreSpawnPos.x += (Math.round(Math.random()) * 2) - 1;
            }
            if(Math.random() < 0.5)
            {
              oreSpawnPos.y += (Math.round(Math.random()) * 2) - 1;
            }
          }
        }
      } else if(oreChance < 0.4)
      {
        let veinSize = Math.round(Math.random() * 2) + 2;
        let thisY = Math.round((Math.random() * 6) + 3);
        let oreSpawnPos = {
          x: i, 
          y: thisY
        };
        for (var h = 0; h < veinSize; h++) {
          if(oreSpawnPos.y <= 9)
          {
            blockRef = firebase.database().ref("block/layer" + oreSpawnPos.y + "/init" + oreSpawnPos.x + "x" + oreSpawnPos.y);
            blockRef.set({
              x: oreSpawnPos.x, 
              y: oreSpawnPos.y, 
              id: "init" + oreSpawnPos.x + "x" + oreSpawnPos.y, 
              type: "iron_ore", 
              sizeX: BlockProperties["iron_ore"].sizeX, 
              sizeY: BlockProperties["iron_ore"].sizeY,
              centerX: BlockProperties["iron_ore"].centerX, 
              centerY: BlockProperties["iron_ore"].centerY,  
              hp: 5, 
              strength: BlockProperties["iron_ore"].strength, 
              data:{}
            })
            if(Math.random() < 0.5)
            {
              oreSpawnPos.x += (Math.round(Math.random()) * 2) - 1;
            }
            if(Math.random() < 0.5)
            {
              oreSpawnPos.y += (Math.round(Math.random()) * 2) - 1;
            }
          }
        }
      } else if(oreChance < 0.5)
      {
        let veinSize = Math.round(Math.random() * 3) + 1;
        let thisY = Math.round((Math.random() * 5) + 4);
        let oreSpawnPos = {
          x: i, 
          y: thisY
        };
        for (var h = 0; h < veinSize; h++) {
          if(oreSpawnPos.y <= 9)
          {
            blockRef = firebase.database().ref("block/layer" + oreSpawnPos.y + "/init" + oreSpawnPos.x + "x" + oreSpawnPos.y);
            blockRef.set({
              x: oreSpawnPos.x, 
              y: oreSpawnPos.y, 
              id: "init" + oreSpawnPos.x + "x" + oreSpawnPos.y, 
              type: "gold_ore", 
              sizeX: BlockProperties["gold_ore"].sizeX, 
              sizeY: BlockProperties["gold_ore"].sizeY,
              centerX: BlockProperties["gold_ore"].centerX, 
              centerY: BlockProperties["gold_ore"].centerY,  
              hp: 5, 
              strength: BlockProperties["gold_ore"].strength, 
              data:{}
            })
            if(Math.random() < 0.5)
            {
              oreSpawnPos.x += (Math.round(Math.random()) * 2) - 1;
            }
            if(Math.random() < 0.5)
            {
              oreSpawnPos.y += (Math.round(Math.random()) * 2) - 1;
            }
          }
        }
      }
    }
    let cavePositions = [
      {
        x: Math.round(Math.random() * worldRad * 2) - worldRad, 
        y: Math.round(Math.random() * 2) - 2
      }, 
      {
        x: Math.round(Math.random() * worldRad * 2) - worldRad, 
        y: Math.round(Math.random() * 2) - 2
      }, 
      {
        x: Math.round(Math.random() * worldRad * 2) - worldRad, 
        y: Math.round(Math.random() * 2) - 2
      }
    ]
    for(let i = 0; i < cavePositions.length; i++) {
      let caveSize = Math.round(Math.random() * 15) + 5;
      for (var k = 0; k < caveSize; k++) {
        if(cavePositions[i].y < 9) firebase.database().ref("block/layer" + cavePositions[i].y + "/init" + cavePositions[i].x + "x" + cavePositions[i].y).remove();
        if(cavePositions[i].y < 9) firebase.database().ref("block/layer" + (cavePositions[i].y + 1) + "/init" + cavePositions[i].x + "x" + (cavePositions[i].y + 1)).remove();
        if(cavePositions[i].y < 9) firebase.database().ref("block/layer" + (cavePositions[i].y - 1) + "/init" + cavePositions[i].x + "x" + (cavePositions[i].y - 1)).remove();
        if(cavePositions[i].y < 9) firebase.database().ref("block/layer" + cavePositions[i].y + "/init" + (cavePositions[i].x - 1) + "x" + (cavePositions[i].y + 1)).remove();
        if(cavePositions[i].y < 9) firebase.database().ref("block/layer" + cavePositions[i].y + "/init" + (cavePositions[i].x + 1) + "x" + (cavePositions[i].y - 1)).remove();
        if(cavePositions[i].y < 9) firebase.database().ref("block/layer" + (cavePositions[i].y + 1) + "/init" + (cavePositions[i].x - 1) + "x" + (cavePositions[i].y + 1)).remove();
        if(cavePositions[i].y < 9) firebase.database().ref("block/layer" + (cavePositions[i].y - 1) + "/init" + (cavePositions[i].x + 1) + "x" + (cavePositions[i].y - 1)).remove();
        if(cavePositions[i].y < 9) firebase.database().ref("block/layer" + (cavePositions[i].y + 1) + "/init" + (cavePositions[i].x + 1) + "x" + (cavePositions[i].y + 1)).remove();
        if(cavePositions[i].y < 9) firebase.database().ref("block/layer" + (cavePositions[i].y - 1) + "/init" + (cavePositions[i].x - 1) + "x" + (cavePositions[i].y - 1)).remove();
        if(Math.random() < 0.5)
        {
          cavePositions[i].x += (Math.round(Math.random()) * 2) - 1;
        }
        if(Math.random() < 0.8)
        {
          cavePositions[i].y += (Math.round(Math.random()) * 2) - 1;
        }
      }
    }
    for(let i = -worldRad; i < worldRad; i++) {
      Object.keys(structures).forEach((structIdx) => {
        let s = structures[structIdx];
        let structX = i + worldRad;
        if(Math.random() * s.rarity < 1 && s.biomes.includes(biomeMap[structX]))
        {
          console.log("Generating " + structIdx + " at X: " + i)
          Object.keys(block).forEach((key) => {
            const rows = block[key];
            Object.keys(rows).forEach((row) => {
              const blockState = rows[row];
              if(blockState.x >= i && blockState.x < i + s.width && blockState.y >= surfaceYMap[structX] + s.distFromSurface && blockState.y < surfaceYMap[structX] + s.distFromSurface + s.height)
              {
                firebase.database().ref("block/layer" + blockState.y + "/" + row).remove();
              }
            })
          })
          for (var k = 0; k < s.height; k++) {
            for (var t = 0; t < s.width; t++) {
              let structSetX = i + t;
              let structSetY = surfaceYMap[structX] + k + s.distFromSurface;
              if(s.blockmap[s.shape[k][t]] != "none")
              {
                blockRef = firebase.database().ref(`block/layer` + structSetY + `/struct` + structSetX);
                blockRef.set({
                  x: structSetX, 
                  y: structSetY, 
                  id: "struct" + structSetX, 
                  type: s.blockmap[s.shape[k][t]], 
                  sizeX: BlockProperties[s.blockmap[s.shape[k][t]]].sizeX, 
                  sizeY: BlockProperties[s.blockmap[s.shape[k][t]]].sizeY,
                  centerX: BlockProperties[s.blockmap[s.shape[k][t]]].centerX, 
                  centerY: BlockProperties[s.blockmap[s.shape[k][t]]].centerY,  
                  hp: 5, 
                  strength: BlockProperties[s.blockmap[s.shape[k][t]]].strength, 
                  data: BlockTraits[s.blockmap[s.shape[k][t]]].dataRequired
                })
                let thisLootIDX = 0;
                let alreadySet = [];
                console.log(s.lootPool)
                if(s.lootPool[s.lootShape[k][t]] != null)
                {
                  Object.keys(s.lootPool[s.lootShape[k][t]]).forEach((lootPoolIdx) => {
                    let loot = s.lootPool[s.lootShape[k][t]][lootPoolIdx];
                    let amountToLoot = randomFromArray(loot);
                    thisLootIDX = Math.round(Math.random() * (BlockTraits[s.blockmap[s.shape[k][t]]].dataRequired.blockInventory.length - 1));
                    while(alreadySet.includes(thisLootIDX))
                    {
                      thisLootIDX = Math.round(Math.random() * (BlockTraits[s.blockmap[s.shape[k][t]]].dataRequired.blockInventory.length - 1));
                    }
                    alreadySet.push(thisLootIDX);
                    if(amountToLoot > 0)
                    {
                      firebase.database().ref(`block/layer` + structSetY + `/struct` + structSetX + `/data/blockInventory/` + thisLootIDX).update({
                        item: lootPoolIdx, 
                        amount: amountToLoot, 
                        durability: 1000000000
                      })
                    }
                  })
                }
              }
            }
          }
        }
      })
    }
  }

  function initGame() {
    //Key Registers
    new KeyPressListener("ArrowUp", () => {isJump = true;}, () => {isJump = false;})
    new KeyPressListener("ArrowLeft", () => {isLeft = true;}, () => {isLeft = false;})
    new KeyPressListener("ArrowRight", () => {isRight = true;}, () => {isRight = false})
    new KeyPressListener("KeyW", () => {isJump = true;}, () => {isJump = false;})
    new KeyPressListener("KeyA", () => {isA = true;}, () => {isA = false;})
    new KeyPressListener("KeyD", () => {isD = true;}, () => {isD = false;})

    //Inventory Opening
    new KeyPressListener("KeyE", () => {
      let margin = {x: (screenDim.x - 720) / 2, y: (screenDim.y - 624) / 2};
      mouseTile = {x: Math.floor((((mousePos.x + ((myX - 7) * 48)) - margin.x)) / 48), y: Math.floor(((mousePos.y + ((myY - 7) * 48)) - margin.y) / 48)};
      let isFurnace = false;
      let isAnvil = false;
      let isChest = false;
      Object.keys(block).forEach((key) => {
        const rows = block[key];
        Object.keys(rows).forEach((row) => {
          const blockState = rows[row];
          if(blockState.x === mouseTile.x && blockState.y === mouseTile.y && blockState.type == "furnace")
          {
            isFurnace = true;
            blockEntityOpened = firebase.database().ref("block/" + key + "/" + row);
          }
          if(blockState.x === mouseTile.x && blockState.y === mouseTile.y && blockState.type == "anvil")
          {
            isAnvil = true;
            blockEntityOpened = firebase.database().ref("block/" + key + "/" + row);
            blockEntityOpenedRow = key;
            blockEntityOpenedColumn = row;
            console.log(firebase.database().ref("block/" + key + "/" + row))
          }
          if(blockState.x === mouseTile.x && blockState.y === mouseTile.y && blockState.type == "chest")
          {
            isChest = true;
            blockEntityOpened = firebase.database().ref("block/" + key + "/" + row);
            blockEntityOpenedRow = key;
            blockEntityOpenedColumn = row;
          }
        })
      })
      if((isFurnace || furnaceOpen) && !(inventoryShown || anvilOpen || chestOpen))
      {
        if(document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT')
        {
          furnaceOpen = !furnaceOpen;
          document.querySelector(".furnace").setAttribute("data-fur", (furnaceOpen ? "true" : "false"));
          document.querySelector(".hotbar").setAttribute("data-inv", (!furnaceOpen ? "true" : "false"));
          document.querySelector(".mouse-holding-item").setAttribute("data-inv", (furnaceOpen ? "true" : "false"));
          document.querySelector(".selected-slot").setAttribute("data-inv", (!furnaceOpen ? "true" : "false"));
        }
      } else if((isAnvil || (anvilOpen && craftProgress == 0)) && !(inventoryShown || furnaceOpen || chestOpen)) {
        if(document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT')
        {
          anvilOpen = !anvilOpen;
          document.querySelector(".anvil").setAttribute("data-anv", (anvilOpen ? "true" : "false"));
          document.querySelector(".hotbar").setAttribute("data-inv", (!anvilOpen ? "true" : "false"));
          document.querySelector(".mouse-holding-item").setAttribute("data-inv", (anvilOpen ? "true" : "false"));
          document.querySelector(".selected-slot").setAttribute("data-inv", (!anvilOpen ? "true" : "false"));
        }
      } else if((isChest || chestOpen) && !(inventoryShown || furnaceOpen || anvilOpen)) {
        if(document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT')
        {
          chestOpen = !chestOpen;
          document.querySelector(".chest").setAttribute("data-chest", (chestOpen ? "true" : "false"));
          document.querySelector(".hotbar").setAttribute("data-inv", (!chestOpen ? "true" : "false"));
          document.querySelector(".mouse-holding-item").setAttribute("data-inv", (chestOpen ? "true" : "false"));
          document.querySelector(".selected-slot").setAttribute("data-inv", (!chestOpen ? "true" : "false"));
        }
      } else {
        if(craftProgress == 0 && document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT')
        {
          inventoryShown = !inventoryShown;
          document.querySelector(".inventory").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
          document.querySelector(".hotbar").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));
          document.querySelector(".mouse-holding-item").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
          document.querySelector(".selected-slot").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));
        }
      }
    }, () => {})
    new KeyPressListener("Digit1", () => {currentSlot = 0}, () => {})
    new KeyPressListener("Digit2", () => {currentSlot = 1}, () => {})
    new KeyPressListener("Digit3", () => {currentSlot = 2}, () => {})
    new KeyPressListener("Digit4", () => {currentSlot = 3}, () => {})
    new KeyPressListener("Digit5", () => {currentSlot = 4}, () => {})
    new KeyPressListener("KeyQ", () => {isQPressed = true}, () => {isQPressed = false})
    new KeyPressListener("KeyH", () => {isDebug = true}, () => {isDebug = false})

    const allPlayersRef = firebase.database().ref(`players`);
    const allBlockRef = firebase.database().ref(`block`);
    const isMap = firebase.database().ref(`isMapGen`);

    allPlayersRef.on("value", (snapshot) => {
      //change
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        el.querySelector(".Character_name").innerText = characterState.name;
        el.setAttribute("data-color", characterState.color);
        el.setAttribute("data-direction", characterState.direction);
        el.querySelector(".Character_health_bar").setAttribute("data-health", characterState.health);
        let left = 16 * ((characterState.x - myX) + 7) + "px";
        let top = 16 * ((characterState.y - myY) + 7) + "px";
        if(characterState.id === playerId)
        {
          left = "112px";
          top = "112px";
        }
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    })
    allPlayersRef.on("child_added", (snapshot) => {
      //new nodes
      const addedPlayer = snapshot.val();
      const characterElement = document.createElement("div");
      characterElement.classList.add("Character", "grid-cell");
      if(addedPlayer.id === playerId)
      {
        characterElement.classList.add("you");
      }
      characterElement.innerHTML = (`
        <div class="Character_sprite grid-cell"></div>
        <div class="Character_name-container">
          <span class="Character_name"></span>
        </div>
        <div class="Character_you-arrow"></div>
        <div class="Character_health_bar"></div>
      `);


      playerElements[addedPlayer.id] = characterElement;
      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      characterElement.setAttribute("data-color", addedPlayer.color);
      characterElement.setAttribute("data-direction", addedPlayer.direction);
      const left = 16 * addedPlayer.x + "px";
      const top = 16 * addedPlayer.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      gameContainer.appendChild(characterElement);
      setTimeout(() => {
        if(isMapG === false)
        {
          generateMap();
          firebase.database().ref().update({
            isMapGen: true
          })
        }
      }, 1000)
    })
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })

    allBlockRef.on("child_added", (outershot) => {
      const layer = outershot.val();
      const key = outershot.key;

      // Create the DOM Element
      const layerElement = document.createElement("div");
      layerElement.classList.add(outershot.key, "Layer");

      // Keep a reference for removal later and add to DOM
      gameContainer.appendChild(layerElement);

      firebase.database().ref("block/" + outershot.key).on("value", (snapshot) => {
        block[outershot.key] = snapshot.val() || {};
        Object.keys(block).forEach((outerkey) => {
          const layerState = block[outerkey];
          Object.keys(layerState).forEach((key) => {
            const blockState = layerState[key];
            if(blockElements["layer" + blockState.y] == undefined) blockElements["layer" + blockState.y] = {};
            let el = blockElements["layer" + blockState.y][blockState.id];
            if(el != undefined) el.querySelector(".Block_break_sprite_overlay").setAttribute("data-hp", blockState.hp);
          })
        })
      });
      firebase.database().ref("block/" + outershot.key).on("child_added", (snapshot) => {
        const thisblock = snapshot.val();
        const key = thisblock.id;
        //affects generalized block dictionary
        block[outershot.key][key] = snapshot.val();

        // Create the DOM Element
        const blockElement = document.createElement("div");
        blockElement.classList.add("Block", "grid-cell");
        blockElement.innerHTML = `
          <div class="Block_sprite grid-cell"></div>
          <div class="Block_break_sprite_overlay grid-cell"></div>
        `;
        // Style the Element
        blockElement.querySelector(".Block_sprite").setAttribute("data-type", thisblock.type);
        const left = 16 * ((thisblock.x - myX) + 7) + "px";
        const top = 16 * ((thisblock.y - myY) + 7) + "px";
        const zlayer = thisblock.type == "water" ? "1px" : "0px";
        blockElement.style.transform = `translate3d(${left}, ${top}, ${zlayer})`;

        // Keep a reference for removal later and add to DOM
        if(blockElements["layer" + thisblock.y] == undefined) blockElements["layer" + thisblock.y] = {};
        blockElements["layer" + thisblock.y][key] = blockElement;
        //console.log(gameContainer.querySelector(".layer" + thisblock.y))
        gameContainer.querySelector(".layer" + thisblock.y).appendChild(blockElement);
      })
      firebase.database().ref("block/" + outershot.key).on("child_removed", (snapshot) => {
        const block = snapshot.val();
        const keyToRemove = block.id;
        gameContainer.querySelector(".layer" + block.y).removeChild(blockElements["layer" + block.y][keyToRemove]);
        delete blockElements["layer" + block.y][keyToRemove];
      })
    })
    allBlockRef.on("child_removed", (outershot) => {
      const layer = outershot.val();
      const keyToRemove = layer.id;
      gameContainer.removeChild(document.querySelector("." + outershot.key));
      delete blockElements[outershot.key];
    })

    isMap.on("value", (snapshot) => {
      isMapG = snapshot.val();
    });

    playerNameInput.addEventListener("change", (e) => {
      const newName = e.target.value || createName();
      const chatRef = firebase.database().ref(`chat/` + Math.floor(Math.random() * 1000000000000000));
      const date = new Date();
      chatRef.set({
        message: players[playerId].name + " has renamed to " + newName, 
        time: date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds(), 
        day:  date.getDate()
      })
      playerNameInput.value = newName;
      playerRef.update({
        name: newName
      });
      localStorage.setItem("Name", newName);
    })
    playerColorButton.addEventListener("click", () => {
      const mySkinIndex = playerColors.indexOf(players[playerId].color);
      const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
      playerRef.update({
        color: nextColor
      });
    })
    chatSend.addEventListener("click", () => {
      const chatRef = firebase.database().ref(`chat/` + Math.floor(Math.random() * 1000000000000000));
      const date = new Date();
      var inputMessage = chatInput.value;
      chatRef.set({
        message: inputMessage + " | " + players[playerId].name, 
        time: date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds(), 
        day: date.getDate()
      })
      if(inputMessage[0] == "/" && players[playerId].op)
      {
        if(inputMessage.includes("/tp ") && Math.round(inputMessage.split(" ")[1]) != undefined && Math.round(inputMessage.split(" ")[2]) != undefined)
        {
          playerRef.update({
            x: Math.round(inputMessage.split(" ")[1]), 
            y: Math.round(inputMessage.split(" ")[2])
          })
        }
        if(inputMessage.includes("/setblock ") && Math.round(inputMessage.split(" ")[1]) != undefined && Math.round(inputMessage.split(" ")[2]) != undefined && BlockProperties[inputMessage.split(" ")[3]].sizeX != null)
        {
          blockRef = firebase.database().ref(`block/layer` + inputMessage.split(" ")[2] + `/` + playerId + myBlockId);
          blockRef.set({
            x: Math.round(inputMessage.split(" ")[1]), 
            y: Math.round(inputMessage.split(" ")[2]), 
            id: playerId + myBlockId, 
            type: inputMessage.split(" ")[3], 
            sizeX: BlockProperties[inputMessage.split(" ")[3]].sizeX, 
            sizeY: BlockProperties[inputMessage.split(" ")[3]].sizeY,
            centerX: BlockProperties[inputMessage.split(" ")[3]].centerX, 
            centerY: BlockProperties[inputMessage.split(" ")[3]].centerY,  
            hp: 5, 
            strength: BlockProperties[inputMessage.split(" ")[3]].strength, 
            data:{}
          })
          myBlockId++;
        }
        if(inputMessage.includes("/kill "))
        {
          let playerIdToKill = "";
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.name == inputMessage.split(" ")[1])
            {
              playerIdToKill = key;
            }
          })
          if(playerIdToKill != "")
          {
            firebase.database().ref("players/" + playerIdToKill).update({
              health: 0
            })
          }
        }
      }
      chatInput.value = "";
    })
    const chatRef = firebase.database().ref(`chat`);

    chatRef.on("child_added", (snapshot) => {
      //new nodes
      const addedMessage = snapshot.val();
      const date = new Date();
      if(addedMessage.time >= date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds() && addedMessage.day == date.getDate())
      {
        const messageElement = document.createElement("div");
        messageElement.classList.add("Chat-message");
        messageElement.innerHTML = addedMessage.message;

        chatDisplay.appendChild(messageElement);
      }
    })

    document.querySelector("#up-move").addEventListener("click", () => {
      if((yVel == 0.002 || inWater) && !inventoryShown)
      {
        yVel = -0.07;
      }
    })
    document.querySelector("#left-move").addEventListener("click", () => {
      mobileMovement.x[0] = 1 - mobileMovement.x[0];
    })
    document.querySelector("#right-move").addEventListener("click", () => {
      mobileMovement.x[1] = 1 - mobileMovement.x[1];
    })
    document.querySelector("#down-move").addEventListener("click", () => {
      if(craftProgress == 0)
      {
        inventoryShown = !inventoryShown;
        document.querySelector(".inventory").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
        document.querySelector(".hotbar").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));
        document.querySelector(".mouse-holding-item").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
        document.querySelector(".selected-slot").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));
      }
    })

    window.addEventListener('mousemove', (event) => {
      mousePos = {x: event.clientX, y: event.clientY};
      screenDim = {x: window.innerWidth, y: window.innerHeight};
      let margin = {x: (screenDim.x - 720) / 2, y: (screenDim.y - 624) / 2};
      mouseTile = {x: Math.floor((((mousePos.x + ((myX - 7) * 48)) - margin.x)) / 48), y: Math.floor(((mousePos.y + ((myY - 7) * 48)) - margin.y) / 48)};
      let mouseBlock = document.querySelector(".mouse-holding-item");
      const left = mousePos.x - (screenDim.x/2);
      const top = mousePos.y - (screenDim.y/2);
      mouseBlock.style.transform = `translate3d(${left}px, ${top}px, 0) scale(3)`;
      //1919, 977
    });
    window.onmousedown = () => {
      mouseDown = true;
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        if(Math.abs(mouseTile.x - characterState.x) < 0.7 && Math.abs(mouseTile.y - characterState.y) < 0.7 && !characterState.isDead && characterState.id != playerId && !players[playerId].isDead)
        {
          //console.log(characterState.health - Math.round(2 - ((ItemProperties[Inventory[currentSlot].item].toolTier != null ? toolTierBreakSpeed[ItemProperties[Inventory[currentSlot].item].toolTier] : 0.5) * 2)))
          let baseDamage = ItemProperties[Inventory[currentSlot].item].damage;
          if(Inventory[currentSlot].refinements["sharpening"] != null) 
          {
            let sharpness = Inventory[currentSlot].refinements["sharpening"].level;
            baseDamage *= 1 + (sharpness * 0.5)
          }
          const currentDate = new Date();
          let currentAttackTick = currentDate.getTime();
          if(!(currentAttackTick - lastAttack > ItemProperties[Inventory[currentSlot].item].attackSpeed * 1000))
          {
            baseDamage *= 0.5;
          }
          let finalDamage = baseDamage;
          firebase.database().ref("players/" + characterState.id).update({
            health: characterState.health - (Math.floor(finalDamage) + (Math.random() <= finalDamage - Math.floor(finalDamage) ? 1 : 0))
          })
          Inventory[currentSlot].durability--;
          if(Inventory[currentSlot].durability <= 0)
          {
            Inventory[currentSlot].item = "none";
            Inventory[currentSlot].amount = 0;
            Inventory[currentSlot].refinements = {};
            Inventory[currentSlot].durability = 1;
          }
          lastAttack = currentAttackTick;
        }
      })
    }
    window.onmouseup = () => {
      mouseDown = false;
      action = 0;
    }

    oneSecondLoop();
    regenLoop();
    setTimeout(() => tickLoop(), 2000);
    setTimeout(() => renderLoop(), 2000);
    setTimeout(() => mineLoop(), 2000);
    setTimeout(() => worldLoop(), 2000);
  }
	firebase.auth().onAuthStateChanged((user) =>{
    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      let name;
      if(localStorage.getItem("Name") == null)
      {
        localStorage.setItem("Name", createName());
      }
      name = localStorage.getItem("Name");
      playerNameInput.value = name;

      const {x, y} = getRandomSafeSpot();


      playerRef.set({
        id: playerId,
        name, 
        direction: "right",
        color: randomFromArray(playerColors),
        x: 1,
        y: -5,
        coins: 0,
        potionDuration: 0,
        health: 10, 
        isDead: false, 
        weapon: "none", 
        op: false
      })

      const date = new Date();

      const chatRef = firebase.database().ref(`chat/` + Math.floor(Math.random() * 1000000000000000));
      chatRef.set({
        message: name + " has joined the game", 
        time: date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds(), 
        day: date.getDate()
      })

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
//x+w>x2-w2 && x-w<x2+w2 && y+h>y2-h2 && y-h<y2+h2
//1686