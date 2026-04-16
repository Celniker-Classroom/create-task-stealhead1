// add javascript here
let fieldWidth = 11;
let fieldLength = 11;
const snakePos = [];
const applePos = [];
let snakeLength;
let currentDirection = 'd';
let lastDirection = 'd';
let appleRemoved = false;
var gameRunning;
var gameOverCheck = false;
let highScore;
let removed;
//maps movement to directions, used later
const moveMapping = [['w', 'ArrowUp', 0, -1, 's', 'ArrowDown'], ['s', 'ArrowDown', 0, 1, 'w', 'ArrowUp'], ['a', 'ArrowLeft', -1, 0, 'd', 'ArrowRight'], ['d', 'ArrowRight', 1, 0, 'a', 'ArrowLeft']];
//gets cell by position to avoid typing long pieces of code
function getCell(x, y) {
    return document.querySelector('div.cell[position="[' + String(x) + ',' + String(y) + ']"]');
}
//ai was used to debug this function when I accidently used i in the j for loop
function createField() {
    //generates rows and makes them children of field
    for (let i = 1; i <= fieldWidth; i++) {
        const row = document.createElement("div");
        row.id = "row" + String(i);
        row.classList.add("rows");
        row.style.height = String(100 / fieldWidth) + "%";
        document.getElementById("field").appendChild(row);
        //generates cells and makes them children of rows
        for (let j = 1; j <= fieldLength; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = "cell" + String((i - 1) * fieldLength + j);
            cell.style.width = String(100 / fieldLength) + "%";
            row.appendChild(cell);
            //coordinates of the cell are stored as (x,y)
            cell.setAttribute("position", "[" + String(j) + "," + String(i) + "]");
        }
    }

}
//ai used for debugging when the getCell function returned null when wall 
// and snake checks were one, so syntax error happened
function checkAhead(ahead) {
    removed = null;
    //checks if next move makes snake out of bounds, sets gameover if true
    if (ahead[0] < 1 || ahead[0] > fieldLength || ahead[1] < 1 || ahead[1] > fieldWidth) {
        gameOverCheck = true;
        return false;
    }
    //checks if next move is an apple, grows snake and regenerates apple if true
    if (getCell(ahead[0], ahead[1]).style.backgroundColor == 'red') {
        applePos.length = 0;
        let validPosition = false;
        while (!validPosition) {
            applePos[0] = Math.floor(Math.random() * fieldLength) + 1;
            applePos[1] = Math.floor(Math.random() * fieldWidth) + 1;
            if (!(snakePos.some((pos) => pos[0] == applePos[0] && pos[1] == applePos[1])) && (applePos[0] != ahead[0] || applePos[1] != ahead[1])) {
                validPosition = true;
            }
        }
        snakeLength++;
        snakePos.push(ahead);
        return true;
    }
    //checks if next move is back in the snake
    else if (getCell(ahead[0], ahead[1]).style.backgroundColor == 'green') {
        gameOverCheck = true;
    }
    else{
        removed = snakePos[0];
        snakePos.splice(0, 1);
    }
    snakePos.push(ahead);
    return false;
}
function updateField(isGameOver) {
    if (!isGameOver) {
        if (removed) {
            getCell(removed[0], removed[1]).style.backgroundColor = 'white';
        }
        for (let i = 0; i < snakeLength; i++) {
            getCell(snakePos[i][0], snakePos[i][1]).style.backgroundColor = 'green';
            if (i == snakeLength - 1) {
                getCell(snakePos[i][0], snakePos[i][1]).style.backgroundColor = 'darkgreen';
            }
        }
        getCell(applePos[0], applePos[1]).style.backgroundColor = 'red';
        document.getElementById("score").textContent = "Score: " + String(snakeLength - 5);
    }
    if (isGameOver) {
        clearInterval(gameRunning);
        for (let k = 0; k < snakePos.length; k++) {
            getCell(snakePos[k][0], snakePos[k][1]).style.backgroundColor = 'white';
        }
        getCell(applePos[0], applePos[1]).style.backgroundColor = 'white';
        document.getElementById("start").disabled = false;
        if (highScore === undefined || snakeLength > highScore) {
            highScore = snakeLength - 5;
            document.getElementById("highScore").textContent = "High Score: " + String(highScore);
        }
        snakePos.length = 0;
        gameOverCheck = true;
    }
}
function chooseDirection(input) {
    for (let i = 0; i < moveMapping.length; i++) {
        if ((input == moveMapping[i][0] || input == moveMapping[i][1]) && (lastDirection != moveMapping[i][4] && lastDirection != moveMapping[i][5])) {
            lastDirection = input;
            return [moveMapping[i][2], moveMapping[i][3]];
        }
    }
    return chooseDirection(lastDirection);
}
function moveSnake(direction) {
    var move = chooseDirection(direction);
    if (move === true) {
        move = chooseDirection(lastDirection);
    }
    const currentHead = snakePos[snakeLength - 1];
    const nextHead = [currentHead[0] + move[0], currentHead[1] + move[1]];
    const appleEaten = checkAhead(nextHead);
    updateField(gameOverCheck);
}
function startGame() {
    snakeLength = 5;
    gameOverCheck = false;
    for (let i = 0; i < snakeLength; i++) {
        snakePos[i] = [2, 6];
    }
    applePos[0] = 10;
    applePos[1] = 6;
    updateField(false);
    document.getElementById("start").disabled = true;
    currentDirection = 'd';
    lastDirection = 'd';
    gameRunning = setInterval(function () { moveSnake(currentDirection) }, 100);
}

//generates the game field when the page is loaded
createField();
document.getElementById("start").addEventListener("click", startGame);
window.addEventListener('keydown', function (event) { currentDirection = event.key; });
