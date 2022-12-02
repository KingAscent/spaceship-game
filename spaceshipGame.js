/*
 *TODO:
 * clearScreen method audio turned off to mute while testing
 * Clean code before implementing more changes
 */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
var audio = new Audio("src/Stay Alive Flying.mp3");

// Ship coordinates
let x = 100;
let y = 375;

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const unitSpeed = new Map();
const environmentCoords = new Map();

let spawnObstacles = 6;
SetUpGame();
unitSpeed.set('Ship', 5);

// Spaceship drawing
var spaceship = new Image();
spaceship.src = "src/spaceship.png";

var meteor = new Image();
meteor.src = "src/meteor.png";

var panel = new Image();
panel.src = "src/satellite panel.png";

var worldBackground = new Image();
worldBackground.src = "src/testWorldImage2.png";
let worldx = 1000;

// Player stats at the bottom of the screen
var lives = 3;
var meteorsDodged = 0;
var panelsDodged = 0;
var timeStart = Date.now();
var timeAlive = 0;

function SetUpGame(){
    ctx.textAlign = "left";     // Reset the Text Alignment after gameOver() center
    x = 100;
    y = 375;
    lives = 3;
    meteorsDodged = 0;
    panelsDodged = 0;
    timeStart = Date.now();
    for(let i = 0; i < spawnObstacles; i++){
        resetObstacle('Meteor' + i);
        resetObstacle('Panel' + i);
    }
}

function drawGame(){
    requestAnimationFrame(drawGame);
    clearScreen();
    //ctx.drawImage(worldBackground, worldx, 0);
    //worldx -= 0.75;
    if(0 < lives){
        inputs();
        collision();
        for(let i = 0; i < spawnObstacles; i++){
            drawMeteor(i);
            drawPanel(i);
        }
        drawSpaceship();
        playerHUD();
    }else{      // The player has ran out of lives
        gameOverScreen();
    }
}

function playerHUD(){
    this.x = 0;     // To adjust all x values on the HUD at once
    this.y = 780;   // To adjust all y avlues on the HUD at once
    ctx.fillStyle = "white";
    ctx.fillText("Lives: " + lives, this.x + 15, this.y);
    timeAlive = (Date.now() - timeStart) / 1000;
    ctx.fillText("Time Alive: " + timeAlive.toFixed(2), this.x + 150, this.y);
    ctx.fillText("Meteors Dodged: " + meteorsDodged, this.x + 400, this.y);
    ctx.fillText("Satellite Panels Dodged: " + panelsDodged, this.x + 690, this.y);
}

function gameOverScreen(){
    this.y = 290;
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 4);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 4;
    ctx.strokeRect(289, 239, 502, 302);
    ctx.fillStyle = "black";
    ctx.fillRect(290, 240, 500, 300);
    ctx.fillStyle = "white";
    ctx.fillText("Time Alive: " + timeAlive.toFixed(2) + " Seconds", canvas.width / 2, this.y);
    ctx.fillText("Meteors dodged: " + meteorsDodged, canvas.width / 2, this.y + 50);
    ctx.fillText("Satellite panels dodged: " + panelsDodged, canvas.width / 2, this.y + 100);
    ctx.fillText("Want to play again?", canvas.width / 2, this.y + 180)
    ctx.fillText("Hit the spacebar!", canvas.width / 2, this.y + 230);
    inputs();
}

function drawMeteor(i){
    this.x = environmentCoords.get('Meteor' + i)[0];
    this.y = environmentCoords.get('Meteor' + i)[1];
    ctx.drawImage(meteor, this.x, this.y);
    this.x -= unitSpeed.get('Meteor' + i);
    environmentCoords.set('Meteor' + i, [this.x, this.y]);
    if(this.x <= -200){
        meteorsDodged++;
        resetObstacle('Meteor' + i);
    }
}

function drawPanel(i){
    ctx.fillStyle = '#ffbb00';
    this.x = environmentCoords.get('Panel' + i)[0];
    this.y = environmentCoords.get('Panel' + i)[1];
    ctx.drawImage(panel, this.x, this.y);
    this.x -= unitSpeed.get('Panel' + i);
    environmentCoords.set('Panel' + i, [this.x, this.y]);
    if(this.x <= -200){
        panelsDodged++;
        resetObstacle('Panel' + i);
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
    if(canvas.height - 50 < y + 40)
        y = canvas.height - 90;
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
    if(this.x - (20 + 81) <= x && x <= this.x + 20 &&   // Front of ship && Back of ship
       this.y <= y + 70 && y <= this.y + 30){           // Below ship && Above ship
        resetObstacle('Meteor' + i);
        lives--;
    }
}

function wallCollision(i){
    this.x = environmentCoords.get('Panel' + i)[0];
    this.y = environmentCoords.get('Panel' + i)[1];
    // Collision between wall & ship
    if(this.x - 81 <= x && x <= this.x + 60 &&      // Front of ship && Back of ship
       this.y <= y + 30 && y <= this.y + 60){       // Below ship && Above ship
        resetObstacle('Panel' + i);
        lives--;
    }
}

function drawSpaceship(){
    ctx.drawImage(spaceship, x, y); 
}

function clearScreen(){
   // audio.play(); // Plays the music from the top of the code
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

    // Spacebar
    if(lives <= 0 && event.keyCode == 32)
        SetUpGame();
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