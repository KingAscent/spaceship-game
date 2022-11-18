let wallX = 1000;
let wallY = 350;

function drawWall(){
    ctx.fillStyle = '#ffbb00'
    this.x = wallX;
    this.y = wallY;
    ctx.fillRect(this.x, this.y, 70, 70);
    wallX -= 2;
    if(wallX == 0){
        wallX = 1000;
        wallY = Math.floor(Math.random() * 600);
    }
}
export {drawWall}
