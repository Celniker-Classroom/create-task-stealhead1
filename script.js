// add javascript here
let fieldWidth = 8;
let fieldLength = 8;
const snakePos = [];
const applePos = [];
let snakeLength;
let currentDirection = 'd';
let lastDirection = 'd';
let appleRemoved = false;
var gameRunning;
var gameOverCheck = false;
//gets cell by position to avoid typing long pieces of code
function getCell(x, y) {
    return document.querySelector('div.cell[position="[' + String(x) + ',' + String(y) + ']"]');
}
function createField() {
    //generates rows and makes them children of field
    for (let i = 1; i <= fieldWidth; i++) {
        const row = document.createElement("div");
        row.id = "row" + String(i);
        row.classList.add("rows");
        document.getElementById("field").appendChild(row);
        //generates cells and makes them children of rows
        for (let j = 1; j <= fieldLength; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = "cell" + String((i - 1) * fieldLength + j);
            row.appendChild(cell);
            //coordinates of the cell are stored as (x,y)
            cell.setAttribute("position", "[" + String(j) + "," + String(i) + "]");
        }
    }
}
function gameOver(){
    clearInterval(gameRunning);
    for (let k=0; k<snakeLength; k++){
        getCell(snakePos[k][0], snakePos[k][1]).style.backgroundColor = 'white';
    }
    getCell(applePos[0], applePos[1]).style.backgroundColor = 'white';
    document.getElementById("start").disabled = false;
    gameOverCheck = true;
}
function checkAhead(ahead) {
    if (ahead[0] < 1 || ahead[0] > fieldLength || ahead[1] < 1 || ahead[1] > fieldWidth) {
        gameOver();
        return false;
    }
    if (getCell(ahead[0], ahead[1]).style.backgroundColor == 'red') {
        let validPosition = false;
        while (!validPosition) {
            applePos[0] = Math.floor(Math.random() * fieldLength) + 1;
            applePos[1] = Math.floor(Math.random() * fieldWidth) + 1;
            if (getCell(applePos[0], applePos[1]).style.backgroundColor != 'green') {
                validPosition = true;
            }
        }
        return true;
    }
    else if (getCell(ahead[0], ahead[1]).style.backgroundColor == 'green') {
        gameOver();
    }
    return false;
}
function updateField(removedSnake) {
    if (removedSnake) {
        getCell(removedSnake[0], removedSnake[1]).style.backgroundColor = 'white';
    }
    for (i = 0; i < snakeLength; i++) {
        getCell(snakePos[i][0], snakePos[i][1]).style.backgroundColor = 'green';
    }
    getCell(applePos[0], applePos[1]).style.backgroundColor = 'red';
}
function chooseDirection(input) {
    var move;
    if ((input == 'w' || input == 'ArrowUp') && (lastDirection != 's' && lastDirection != 'ArrowDown')) {
        lastDirection = input;
        move = [0, -1];
    }
    else if ((input == 'd' || input == 'ArrowRight') && (lastDirection != 'a' && lastDirection != 'ArrowLeft')) {
        lastDirection = input;
        move = [1, 0];
    }
    else if ((input == 's' || input == 'ArrowDown') && (lastDirection != 'w' && lastDirection != 'ArrowUp')) {
        lastDirection = input;
        move = [0, 1];
    }
    else if ((input == 'a' || input == 'ArrowLeft') && (lastDirection != 'd' && lastDirection != 'ArrowRight')) {
        lastDirection = input;
        move = [-1, 0];
    }
    else {
        return true;
    }
    return move;
}
function moveSnake(direction) {
    var move = chooseDirection(direction);
    if (move === true) {
        move = chooseDirection(lastDirection);
    }
    const currentHead = snakePos[snakeLength - 1];
    const nextHead = [currentHead[0] + move[0], currentHead[1] + move[1]];
    const appleEaten = checkAhead(nextHead);
    if (gameOverCheck){
        return;
    }
    snakePos[snakeLength] = nextHead;
    var removed = null;
    if (!appleEaten) {
        removed = snakePos[0];
        snakePos.splice(0, 1);
    } else {
        snakeLength++;
    }
    updateField(removed);
}
function startGame() {
    snakeLength = 5;
    gameOverCheck = false;
    for (i = 0; i < snakeLength; i++) {
        snakePos[i] = [2, 4];
    }
    applePos[0] = 8;
    applePos[1] = 4;
    updateField();
    document.getElementById("start").disabled = true;
    gameRunning = setInterval(function () { moveSnake(currentDirection) }, 100);
}

//generates the game field when the page is loaded
createField();
document.getElementById("start").addEventListener("click", startGame);
window.addEventListener('keydown', function (event) { currentDirection = event.key; });
