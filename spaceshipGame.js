// Create the canvas, initialize a font, and initialize the game's music
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
var audio = new Audio("src/Stay Alive Flying.mp3"); // Original Song by me using BeepBox (www.beepbox.co)

// Ship coordinates
let x = 100;
let y = 375;

// Variables to check if a movement key is pressed
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// Maps to contain the speed and/or coordinates of the game's variables
const unitSpeed = new Map();
const environmentCoords = new Map();

// Game settings
let spawnObstacles = 6;
setUpGame();
unitSpeed.set('Ship', 5);

// Images preloaded for the game
var spaceship = new Image();
spaceship.src = "src/spaceship.png";
var meteor = new Image();
meteor.src = "src/meteor.png";
var panel = new Image();
panel.src = "src/satellite panel.png";

// Player stats at the bottom of the screen
var lives = 3;
var meteorsDodged = 0;
var panelsDodged = 0;
var timeStart = Date.now();
var timeAlive = 0;

// NAME: setUpGame()
// PURPOSE: Initializing the game's settings, reassigning variables if called by gameOver
function setUpGame(){
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
} // End setUpGame()

// NAME: drawGame()
// PURPOSE: Draw the game to the canvas
function drawGame(){
    requestAnimationFrame(drawGame);
    clearScreen();
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
} // End drawGame()

// NAME: playerHUD()
// PURPOSE: Draw the player's HUD at the bottom of the screen
function playerHUD(){
    this.x = 0;     // To adjust all x values on the HUD at once
    this.y = 780;   // To adjust all y avlues on the HUD at once
    ctx.fillStyle = "white";
    ctx.fillText("Lives: " + lives, this.x + 15, this.y);
    timeAlive = (Date.now() - timeStart) / 1000;
    ctx.fillText("Time Alive: " + timeAlive.toFixed(2), this.x + 150, this.y);
    ctx.fillText("Meteors Dodged: " + meteorsDodged, this.x + 400, this.y);
    ctx.fillText("Satellite Panels Dodged: " + panelsDodged, this.x + 690, this.y);
} // End playerHUD()

// NAME: gameOverScreen()
// PURPOSE: If the player reaches a Game Over, display the gameover screen
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
} // End gameOverScreen()

// NAME: drawMeteor(i)
// PURPOSE: Draw a meteor to the canvas
// PARAMETER: i - Used to differentiate the different meteors
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
} // End drawMeteor(i)

// NAME: drawPanel(i)
// PURPOSE: Draw a satellite panel to the canvas
// PARAMETER: i - Used to differentiate the different panels
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
} // End drawPanel(i)

// NAME: resetObstacle(obstacle)
// PURPOSE: Takes an obstacle or object, and gives it a new initial position and speed
// PARAMETER: obstacle - Key of the obstacle being changed/reinitialized
function resetObstacle(obstacle){
    environmentCoords.set(obstacle, [1200, Math.floor(Math.random() * 600) + 70]);
    unitSpeed.set(obstacle, Math.floor(Math.random() * 5) + 1);
} // End resetObstacle(obstacle)

// NAME: collision()
// PURPOSE: Check to see if the ship has collided with an object or the game border
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
        panelCollision(i);
    }
} // End collision()

// NAME: meteorCollision(i)
// PURPOSE: Check to see if the player's spaceship has collided with a meteor
// PARAMETER: i - Used to differentiate the different meteors
function meteorCollision(i){
    this.x = environmentCoords.get('Meteor' + i)[0];
    this.y = environmentCoords.get('Meteor' + i)[1];
    // Collision between meteor & ship
    if(this.x - (20 + 81) <= x && x <= this.x + 20 &&   // Front of ship && Back of ship
       this.y <= y + 70 && y <= this.y + 30){           // Below ship && Above ship
        resetObstacle('Meteor' + i);
        lives--;
    }
} // End meteorCollision(i)

// NAME: panelCollision(i)
// PURPOSE: Check to see if the player's spaceship has collided with a panel
// PARAMETER: i - Used to differentiate the different panels
function panelCollision(i){
    this.x = environmentCoords.get('Panel' + i)[0];
    this.y = environmentCoords.get('Panel' + i)[1];
    // Collision between panel & ship
    if(this.x - 81 <= x && x <= this.x + 60 &&      // Front of ship && Back of ship
       this.y <= y + 30 && y <= this.y + 60){       // Below ship && Above ship
        resetObstacle('Panel' + i);
        lives--;
    }
} // End panelCollision(i)

// NAME: drawSpaceship()
// PURPOSE: Draw the spaceship to the canvas at coordinates x, y
function drawSpaceship(){
    ctx.drawImage(spaceship, x, y); 
} // End drawSpaceship()

// NAME: clearScreen()
// PURPOSE: Begins playing the audio of the game, creates a blue background for the HUD, and
//          loads the outerspace background
function clearScreen(){
    audio.play(); // Plays the music from the top of the code
    ctx.fillStyle = "blue";                     // HUD Color
    ctx.fillRect(0, 750, canvas.width, 40);     // HUD Dimensions
    var outerSpace = new Image();
    outerSpace.src = "src/outerSpace.png";
    ctx.drawImage(outerSpace, 0, 0);
} // End clearScreen()

// NAME: inputs()
// PURPOSE: If a movement key is pressed, adjust ship's position using its speed
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
} // End inputs()

// Allow keyboard inputs
document.body.addEventListener('keydown', keydown);
document.body.addEventListener('keyup', keyup);

// NAME: keydown(event)
// PURPOSE: Check if a key is pressed
// Parameter: event - The key that is being pressed
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
    
    // V Key or Shift key
    if(event.keyCode == 86 || event.keyCode == 16)
        unitSpeed.set('Ship', 2);

    // Spacebar
    if(lives <= 0 && event.keyCode == 32)
        setUpGame();
} // End keydown(event)

// NAME: keyup(event)
// PURPOSE: Check if a key has been let go of
// Parameter: event - The key that has been let go of
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
    
    // V Key or Shift key
    if(event.keyCode == 86 || event.keyCode == 16)
        unitSpeed.set('Ship', 5);
} // End keyup(event)


// Begin the game as the page is loaded
drawGame();