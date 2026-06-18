const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

let score = 0;
let lines = 0;
let level = 1;

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

const scoreElement = document.getElementById("score");
const linesElement = document.getElementById("lines");
const levelElement = document.getElementById("level");
const highScoreElement = document.getElementById("highscore");

let highScore =
localStorage.getItem("tetrisHighScore") || 0;

highScoreElement.textContent = highScore;

function createBoard(){
    return Array.from(
        {length: ROWS},
        () => Array(COLS).fill(0)
    );
}

const board = createBoard();

const colors = [
    null,
    "#00FFFF",
    "#0000FF",
    "#FFA500",
    "#FFFF00",
    "#00FF00",
    "#800080",
    "#FF0000"
];

const pieces = {
    I:[
        [1,1,1,1]
    ],

    J:[
        [2,0,0],
        [2,2,2],
        [0,0,0]
    ],

    L:[
        [0,0,3],
        [3,3,3],
        [0,0,0]
    ],

    O:[
        [4,4],
        [4,4]
    ],

    S:[
        [0,5,5],
        [5,5,0],
        [0,0,0]
    ],

    T:[
        [0,6,0],
        [6,6,6],
        [0,0,0]
    ],

    Z:[
        [7,7,0],
        [0,7,7],
        [0,0,0]
    ]
};

function randomPiece(){

    const types =
    "IJLOSTZ";

    const type =
    types[Math.floor(Math.random()*types.length)];

    return pieces[type];
}

const player = {
    pos:{x:0,y:0},
    matrix:null
};

function resetPlayer(){

    player.matrix = randomPiece();

    player.pos.y = 0;

    player.pos.x =
    Math.floor(COLS/2) -
    Math.floor(player.matrix[0].length/2);

    if(collide()){

        gameOver();

    }

}

function collide(){

    for(let y=0;y<player.matrix.length;y++){

        for(let x=0;x<player.matrix[y].length;x++){

            if(
                player.matrix[y][x] !== 0 &&
                (
                    board[y + player.pos.y] &&
                    board[y + player.pos.y][x + player.pos.x]
                ) !== 0
            ){
                return true;
            }

        }

    }

    return false;

}

function merge(){

    player.matrix.forEach((row,y)=>{

        row.forEach((value,x)=>{

            if(value !== 0){

                board[y + player.pos.y]
                [x + player.pos.x] = value;

            }

        });

    });

}

function playerMove(dir){

    player.pos.x += dir;

    if(collide()){

        player.pos.x -= dir;

    }

}

function rotate(matrix){

    return matrix[0].map(
        (_,i)=>
        matrix.map(
            row=>row[i]
        ).reverse()
    );

}

function playerRotate(){

    const old =
    player.matrix;

    player.matrix =
    rotate(player.matrix);

    if(collide()){

        player.matrix =
        old;

    }

}

document.addEventListener("keydown",e=>{

    if(e.key==="ArrowLeft"){

        playerMove(-1);

    }

    if(e.key==="ArrowRight"){

        playerMove(1);

    }

    if(e.key==="ArrowDown"){

        playerDrop();

    }

    if(e.key==="ArrowUp"){

        playerRotate();

    }

});
function playerDrop(){

    player.pos.y++;

    if(collide()){

        player.pos.y--;

        merge();

        clearLines();

        resetPlayer();

    }

    dropCounter = 0;

}

function clearLines(){

    let rowCount = 0;

    outer:

    for(let y=ROWS-1;y>=0;y--){

        for(let x=0;x<COLS;x++){

            if(board[y][x]===0){

                continue outer;

            }

        }

        const row =
        board.splice(y,1)[0].fill(0);

        board.unshift(row);

        y++;

        rowCount++;

    }

    if(rowCount>0){

        score += rowCount*100;

        lines += rowCount;

        level =
        Math.floor(lines/10)+1;

        dropInterval =
        Math.max(
            200,
            1000-(level-1)*80
        );

        updateStats();

    }

}

function updateStats(){

    scoreElement.textContent =
    score;

    linesElement.textContent =
    lines;

    levelElement.textContent =
    level;

}

function drawMatrix(matrix,offset){

    matrix.forEach((row,y)=>{

        row.forEach((value,x)=>{

            if(value!==0){

                ctx.fillStyle =
                colors[value];

                ctx.fillRect(
                    (x+offset.x)*BLOCK,
                    (y+offset.y)*BLOCK,
                    BLOCK,
                    BLOCK
                );

                ctx.strokeStyle =
                "#111";

                ctx.strokeRect(
                    (x+offset.x)*BLOCK,
                    (y+offset.y)*BLOCK,
                    BLOCK,
                    BLOCK
                );

            }

        });

    });

}

function draw(){

    ctx.fillStyle =
    "#111";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawMatrix(
        board,
        {x:0,y:0}
    );

    drawMatrix(
        player.matrix,
        player.pos
    );

}

function update(time=0){

    const delta =
    time-lastTime;

    lastTime=time;

    dropCounter += delta;

    if(
        dropCounter >
        dropInterval
    ){

        playerDrop();

    }

    draw();

    requestAnimationFrame(
        update
    );

}

function gameOver(){

    if(score>highScore){

        highScore=score;

        localStorage.setItem(
            "tetrisHighScore",
            highScore
        );

        highScoreElement.textContent =
        highScore;

    }

    document.getElementById(
        "finalScore"
    ).textContent =
    score;

    document.getElementById(
        "gameOverScreen"
    ).style.display =
    "flex";

}

function restartGame(){

    location.reload();

}

resetPlayer();
updateStats();
update();
