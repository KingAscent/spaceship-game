/* The following is test code meant to represent a proof of concept.
 * The code found here has been implemented with the graphics of the
 * game and no longer serve any purpose in the final product.
 */

function drawMeteor(i){
    ctx.fillStyle = "green";
    this.x = environmentCoords.get('Meteor' + i)[0];
    this.y = environmentCoords.get('Meteor' + i)[1];
    ctx.beginPath();
    ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
    ctx.fill();
    this.x -= unitSpeed.get('Meteor' + i);
    environmentCoords.set('Meteor' + i, [this.x, this.y]);
    if(this.x <= 0){
        resetObstacle('Meteor' + i);
    }
}