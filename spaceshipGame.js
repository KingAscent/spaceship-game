/*
 *TODO:
 * clearScreen method audio turned off to mute while testing
 * Clean code before implementing more changes
 * -Namely, focus on an array or set of some sort
 * -to make calling the coords for walls/meteors simpler
 */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var audio = new Audio("src/Stay Alive Flying.mp3");

let x = 100;
let y = 100;
let speed = 5;
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const wallCoords = new Map();
wallCoords.set('Wall', [1000, Math.floor(Math.random() * 600)]);
const meteorCoords = new Map();
meteorCoords.set('Meteor', [1000, Math.floor(Math.random() * 600)]);

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
    this.x = meteorCoords.get('Meteor')[0];
    this.y = meteorCoords.get('Meteor')[1];
    ctx.beginPath();
    ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
    ctx.fill();
    this.x -= 5;
    meteorCoords.set('Meteor', [this.x, this.y]);
    if(this.x <= 0){
        resetObstacle('Meteor');
    }
}

function drawWall(){
    ctx.fillStyle = '#ffbb00'
    this.x = wallCoords.get('Wall')[0];
    this.y = wallCoords.get('Wall')[1];
    ctx.fillRect(this.x, this.y, 70, 70);
    this.x -= 2;
    wallCoords.set('Wall', [this.x, this.y]);
    if(this.x <= 0){
        resetObstacle('Wall');
    }
}

function resetObstacle(obstacle){
    if(obstacle == 'Meteor')
        meteorCoords.set('Meteor', [1000, Math.floor(Math.random() * 600)]);
    if(obstacle == 'Wall')
        wallCoords.set('Wall', [1000, Math.floor(Math.random() * 600)]);
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
    wallCollision();
}

function wallCollision(){
    this.x = wallCoords.get('Wall')[0];
    this.y = wallCoords.get('Wall')[1];
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
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

// Check key inputs
function inputs(){
    if(upPressed){
        y -= speed;
    }
    if(downPressed){
        y += speed;
    }
    if(leftPressed){
        x -= speed;
    }
    if(rightPressed){
        x += speed;
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
}

drawGame();