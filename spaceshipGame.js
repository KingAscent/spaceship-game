/*
 *TODO:
 * clearScreen method audio turned off to mute while testing
 * Clean code before implementing more changes
 * -Work on implementing multiple meteors/walls to add more obstacles for
 * -the player to dodge
 */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var audio = new Audio("src/Stay Alive Flying.mp3");

let x = 100;
let y = 100;

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const unitSpeed = new Map();
const environmentCoords = new Map();
resetObstacle('Wall');        // environmentCoords.set('Wall', [1000, Math.floor(Math.random() * 600)]);
resetObstacle('Meteor');      // environmentCoords.set('Meteor', [1000, Math.floor(Math.random() * 600)]);
unitSpeed.set('Ship', 5);

// Spaceship drawing
var spaceship = new Image();
spaceship.src = "src/spaceship.png";

function drawGame(){
    requestAnimationFrame(drawGame);
    clearScreen();
    inputs();
    collision();
    drawMeteor();
    drawWall();
    drawSpaceship();
}

function drawMeteor(){
    ctx.fillStyle = "green";
    this.x = environmentCoords.get('Meteor')[0];
    this.y = environmentCoords.get('Meteor')[1];
    ctx.beginPath();
    ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
    ctx.fill();
    this.x -= unitSpeed.get('Meteor');
    environmentCoords.set('Meteor', [this.x, this.y]);
    if(this.x <= 0){
        resetObstacle('Meteor');
    }
}

function drawWall(){
    ctx.fillStyle = '#ffbb00';
    this.x = environmentCoords.get('Wall')[0];
    this.y = environmentCoords.get('Wall')[1];
    ctx.fillRect(this.x, this.y, 70, 70);
    this.x -= unitSpeed.get('Wall');
    environmentCoords.set('Wall', [this.x, this.y]);
    if(this.x <= 0){
        resetObstacle('Wall');
    }
}

function resetObstacle(obstacle){
    environmentCoords.set(obstacle, [1000, Math.floor(Math.random() * 600) + 70]);
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
    wallCollision();
    meteorCollision();
}

function meteorCollision(){
    this.x = environmentCoords.get('Meteor')[0];
    this.y = environmentCoords.get('Meteor')[1];
    // Collision between meteor & ship
    if(this.x - (20 + 81) <= x && x <= this.x + 20 &&
       this.y <= y + 60 && y <= this.y + 10){
        resetObstacle('Meteor');
    }
}

function wallCollision(){
    this.x = environmentCoords.get('Wall')[0];
    this.y = environmentCoords.get('Wall')[1];
    // Collision between wall & ship
    if(this.x - 81 <= x && x <= this.x + 60 &&
       this.y <= y + 30 && y <= this.y + 60){
        resetObstacle('Wall');
    }
}

function drawSpaceship(){
    ctx.drawImage(spaceship, x, y); 
}

function clearScreen(){
//    audio.play(); // Plays the music from the top of the code
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
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