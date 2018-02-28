//proof of animation test
// some code inspired by atomicrobotdesign.com shooter game

var canvas, ctx, sprites,
    width = 500,
    height = 400,
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    sprite_x = (width / 2) - 25, sprite_y = height - 85, sprite_w = 65, sprite_h = 85,
    srcX = 10, srcY = 0;

//GOAL: Ball by ball display of descriptive text, centre screen with score update...
//dynamic, time-step updating of text could be useful...
//TO DO: Second canvas to display text, underneath first canvas
//TO DO: Update text for each tick of a 'clock' (ball by ball)
//Some sort of update function.  This is static: https://www.w3schools.com/graphics/canvas_text.asp

function clearCanvas() {
  ctx.clearRect(0,0,500,400);
}
//if the right key is pressed it moves the sprite image 83 pixels
function drawSprite() {
  if (rightKey) {
    sprite_x += 5;
    srcX = 83;
  } else if (leftKey) {
    sprite_x -= 5;
    srcX = 156; //moves the sprite image to 156 pixels i.e. right side
  }
  ctx.drawImage(sprites,srcX,srcY,sprite_w,sprite_h,sprite_x,sprite_y,sprite_w,sprite_h);
  if (rightKey == false || leftKey == false) {
    srcX = 10;
  }
}
function loop() {
  clearCanvas();
  drawSprite();
}
function keyDown(e) {
  if (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey = true;
}
function keyUp(e) {
  if (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey = false;
}
(function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  sprites = new Image();
  //sprites.src = 'sprites2.png';
  sprites.src = 'cricketer.png';
  setInterval(loop, 1000/30);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
})();
//init();