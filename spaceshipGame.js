/*
 *TODO:
 * clearScreen method audio turned off to mute while testing
 * Clean code before implementing more changes
 */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var audio = new Audio("src/Stay Alive Flying.mp3");

let x = 100;
let y = 375;

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const unitSpeed = new Map();
const environmentCoords = new Map();

let spawnObstacles = 6;
for(let i = 0; i < spawnObstacles; i++){
    resetObstacle('Meteor' + i);
    resetObstacle('Wall' + i);
}
unitSpeed.set('Ship', 5);

// Spaceship drawing
var spaceship = new Image();
spaceship.src = "src/spaceship.png";

var meteor = new Image();
meteor.src = "src/meteor.png";

var worldBackground = new Image();
worldBackground.src = "src/testWorldImage2.png";
let worldx = 1000;


function drawGame(){
    requestAnimationFrame(drawGame);
    clearScreen();
    //ctx.drawImage(worldBackground, worldx, 0);
    worldx -= 0.75;
    inputs();
    collision();
    for(let i = 0; i < spawnObstacles; i++){
        drawMeteor(i);
        drawWall(i);
    }
    drawSpaceship();
}

function drawMeteor(i){
    this.x = environmentCoords.get('Meteor' + i)[0];
    this.y = environmentCoords.get('Meteor' + i)[1];
    ctx.drawImage(meteor, this.x, this.y);
    this.x -= unitSpeed.get('Meteor' + i);
    environmentCoords.set('Meteor' + i, [this.x, this.y]);
    if(this.x <= -200){
        resetObstacle('Meteor' + i);
    }
}

function drawWall(i){
    ctx.fillStyle = '#ffbb00';
    this.x = environmentCoords.get('Wall' + i)[0];
    this.y = environmentCoords.get('Wall' + i)[1];
    ctx.fillRect(this.x, this.y, 70, 70);
    this.x -= unitSpeed.get('Wall' + i);
    environmentCoords.set('Wall' + i, [this.x, this.y]);
    if(this.x <= -200){
        resetObstacle('Wall' + i);
    }
}

function resetObstacle(obstacle){
    environmentCoords.set(obstacle, [1200, Math.floor(Math.random() * 600) + 70]);
    unitSpeed.set(obstacle, Math.floor(Math.random() * 5) + 1);
}

function collision(){
    // Check boundaries of canvas first
    if(y < 0)
        y = 0;
    if(canvas.height - 50 < y)
        y = canvas.height - 50;
    if(x < 0)
        x = 0;
    if(canvas.width - 91 < x)
        x = canvas.width - 91;
    
    // Environmental collisions
    for(let i = 0; i < spawnObstacles; i++){
        meteorCollision(i);
        wallCollision(i);
    }
}

function meteorCollision(i){
    this.x = environmentCoords.get('Meteor' + i)[0];
    this.y = environmentCoords.get('Meteor' + i)[1];
    // Collision between meteor & ship
    if(this.x - (20 + 81) <= x && x <= this.x + 20 &&
       this.y <= y + 60 && y <= this.y + 10){
        resetObstacle('Meteor' + i);
    }
}

function wallCollision(i){
    this.x = environmentCoords.get('Wall' + i)[0];
    this.y = environmentCoords.get('Wall' + i)[1];
    // Collision between wall & ship
    if(this.x - 81 <= x && x <= this.x + 60 &&
       this.y <= y + 30 && y <= this.y + 60){
        resetObstacle('Wall' + i);
    }
}

function drawSpaceship(){
    ctx.drawImage(spaceship, x, y); 
}

function clearScreen(){
//    audio.play(); // Plays the music from the top of the code
//    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    var outerSpace = new Image();
    outerSpace.src = "src/outerSpace.png";
    ctx.drawImage(outerSpace, 0, 0);
}

// Check key inputs
function inputs(){
    if(upPressed){
        y -= unitSpeed.get('Ship');
    }
    if(downPressed){
        y += unitSpeed.get('Ship');
    }
    if(leftPressed){
        x -= unitSpeed.get('Ship');
    }
    if(rightPressed){
        x += unitSpeed.get('Ship');
    }
}

document.body.addEventListener('keydown', keydown);
document.body.addEventListener('keyup', keyup);

function keydown(event){
    // Up
    if(event.keyCode == 38 || event.keyCode == 87)
        upPressed = true;

    // Down
    if(event.keyCode == 40 || event.keyCode == 83)
        downPressed = true;
    
    // Left
    if(event.keyCode == 37 || event.keyCode == 65)
        leftPressed = true;

    // Right
    if(event.keyCode == 39 || event.keyCode == 68)
        rightPressed = true;
    
    // V Key
    if(event.keyCode == 86)
        unitSpeed.set('Ship', 2);
}

function keyup(event){
    // Up
    if(event.keyCode == 38 || event.keyCode == 87)
        upPressed = false;

    // Down
    if(event.keyCode == 40 || event.keyCode == 83)
        downPressed = false;
    
    // Left
    if(event.keyCode == 37 || event.keyCode == 65)
        leftPressed = false;
        
    // Right
    if(event.keyCode == 39 || event.keyCode == 68)
        rightPressed = false;
    
    // V Key
    if(event.keyCode == 86)
        unitSpeed.set('Ship', 5);
}

drawGame();