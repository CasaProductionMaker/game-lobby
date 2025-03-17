const firebaseConfig = {
    apiKey: "AIzaSyARBi6bpk0Z0FCdBIE3ywBe2iPUbiGZZ9E",
    authDomain: "general-storage-a402e.firebaseapp.com",
    projectId: "general-storage-a402e",
    storageBucket: "general-storage-a402e.firebasestorage.app",
    messagingSenderId: "659108630557",
    appId: "1:659108630557:web:6aaa6c4d8275ce44d676f4"
};
const app = firebase.initializeApp(firebaseConfig);

let gridDiv = document.querySelector("#grid");
let gridList = [];
let gridElements = [];
let mousePos = {x: 0, y: 0};
let mouseTile = {x: 0, y: 0};
let screenDim = {x: window.innerWidth, y: window.innerHeight};
let mouseDown = false;
let drawMode = 0;
let canvasDim = 16;
let pixelSize = 128 / canvasDim;
let shape = randomFromArray(["circle", "triangle", "square"])
document.querySelector("#prompt").innerText = "Please draw a " + shape + ":"

function randomFromArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function withinBounds(coordsDict) {
	return coordsDict.x >= 0 && coordsDict.x < canvasDim && coordsDict.y >= 0 && coordsDict.y < canvasDim;
}

function drawOn(x, y) {
	if(withinBounds({x, y}))
	{
		gridList[y][x] = drawMode;
		gridElements[y][x].style.backgroundColor = (drawMode == 0 ? "white" : "black");
	}
}

function submitToDB() {
	inputs = "[";
	shapeOuputs = ""

	for (var i = 0; i < gridList.length; i++) {
		for (var j = 0; j < gridList.length; j++) {
			inputs += (gridList[i][j] + ".0, ")
		}
	}
	inputs += "]"
	if(shape == "circle")
	{
		shapeOuputs = "[1.0, 0.0, 0.0]";
	} else if(shape == "triangle") {
		shapeOuputs = "[0.0, 1.0, 0.0]";
	} else if(shape == "square") {
		shapeOuputs = "[0.0, 0.0, 1.0]";
	}

	firebase.database().ref("submissions/" + Math.floor(Math.random() * 100000000000000))
  .set(`dataPoint(${inputs}, ${shapeOuputs}, "${shape}")`)
  .then(() => {
    location.reload()
  })
}

for (var y = 0; y < canvasDim; y++) {
	gridList.push([])
	gridElements.push([])
	for (var x = 0; x < canvasDim; x++) {
		let cell = document.createElement("div");
		cell.classList.add(x.toString() + "," + y.toString());
		cell.classList.add("cell");
		cell.style.width = pixelSize + "px";
		cell.style.height = pixelSize + "px";
		gridDiv.appendChild(cell);
		gridElements[y].push(cell)
		gridList[y].push(0)
	}
}

window.addEventListener('mousemove', (event) => {
  mousePos = {x: event.clientX, y: event.clientY};
  let margin = {x: (screenDim.x - 128) / 2, y: (screenDim.y - 128) / 2};
  mouseTile = {x: Math.floor((mousePos.x - margin.x) / pixelSize), y: Math.floor((mousePos.y - margin.y) / pixelSize)};
  if(mouseDown)
  {
  	drawOn(mouseTile.x, mouseTile.y);
  }
});
window.onmousedown = () => {
  mouseDown = true;
  if(withinBounds(mouseTile)) drawMode = 1 - gridList[mouseTile.y][mouseTile.x];
  drawOn(mouseTile.x, mouseTile.y);
}
window.onmouseup = () => {
  mouseDown = false;
}