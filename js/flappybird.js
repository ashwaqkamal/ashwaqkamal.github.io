const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highscore");

let highScore =
localStorage.getItem("flappyHighScore") || 0;

highScoreElement.textContent = highScore;

let bird;
let pipes;
let score;
let gameOver;

function initializeGame(){

bird = {
    x:100,
    y:250,
    width:35,
    height:35,
    velocity:0
};

pipes = [];

score = 0;
gameOver = false;

scoreElement.textContent = score;

document.getElementById("gameOverScreen")
.style.display = "none";

createPipe();
}

function createPipe(){

const gap = 180;

const topHeight =
Math.random()*250 + 50;

pipes.push({
    x:500,
    width:70,
    topHeight:topHeight,
    bottomY:topHeight+gap,
    counted:false
});

}

function flap(){

if(gameOver) return;

bird.velocity = -8;

}

document.addEventListener("keydown",(e)=>{

if(e.code==="Space"){
flap();
}

});

canvas.addEventListener("click",flap);
canvas.addEventListener("touchstart",flap);

function drawBird(){

ctx.fillStyle="yellow";

ctx.beginPath();

ctx.arc(
bird.x,
bird.y,
18,
0,
Math.PI*2
);

ctx.fill();

ctx.fillStyle="black";

ctx.beginPath();

ctx.arc(
bird.x+6,
bird.y-4,
3,
0,
Math.PI*2
);

ctx.fill();

ctx.fillStyle="orange";

ctx.beginPath();

ctx.moveTo(bird.x+15,bird.y);
ctx.lineTo(bird.x+30,bird.y+5);
ctx.lineTo(bird.x+15,bird.y+10);

ctx.fill();

}

function drawPipes(){

ctx.fillStyle="green";

pipes.forEach(pipe=>{

ctx.fillRect(
pipe.x,
0,
pipe.width,
pipe.topHeight
);

ctx.fillRect(
pipe.x,
pipe.bottomY,
pipe.width,
700-pipe.bottomY
);

});

}

function update(){

if(gameOver) return;

bird.velocity += 0.35;
bird.y += bird.velocity;

pipes.forEach(pipe=>{

pipe.x -= 3;

if(
!pipe.counted &&
pipe.x + pipe.width < bird.x
){
score++;

scoreElement.textContent = score;

pipe.counted = true;
}

if(
bird.x + 18 > pipe.x &&
bird.x - 18 < pipe.x + pipe.width &&
(
bird.y - 18 < pipe.topHeight ||
bird.y + 18 > pipe.bottomY
)
){
endGame();
}

});

if(
bird.y < 0 ||
bird.y > 700
){
endGame();
}

if(
pipes.length &&
pipes[pipes.length-1].x < 250
){
createPipe();
}

if(
pipes.length &&
pipes[0].x < -100
){
pipes.shift();
}

}

function draw(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

drawPipes();
drawBird();

}

function gameLoop(){

update();
draw();

requestAnimationFrame(gameLoop);

}

function endGame(){

gameOver = true;

if(score > highScore){

highScore = score;

localStorage.setItem(
"flappyHighScore",
highScore
);

highScoreElement.textContent =
highScore;

}

document.getElementById("finalScore")
.textContent = score;

document.getElementById("gameOverScreen")
.style.display = "flex";

}

function restartGame(){

initializeGame();

}

initializeGame();
gameLoop();
