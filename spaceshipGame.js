const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let x = 100;
let y = 100;
let speed = 10;
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// Spaceship drawing
var spaceship = new Image();
spaceship.src = "src/spaceship.png";

function drawGame(){
    requestAnimationFrame(drawGame);
    clearScreen();
    inputs();
    collision();
    drawSpaceship();
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
    
    //TODO: COLLISION BETWEEN SHIP AND ENVIRONMENT
}

function drawSpaceship(){
    ctx.drawImage(spaceship, x, y); 
}

function clearScreen(){
    ctx.fillStyle = "blue";
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