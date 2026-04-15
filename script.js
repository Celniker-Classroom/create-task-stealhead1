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
const moveMapping = [['w', 'ArrowUp', 0, -1, 's', 'ArrowDown'], ['s', 'ArrowDown', 0, 1, 'w', 'ArrowUp'], ['a', 'ArrowLeft', -1, 0, 'd', 'ArrowRight'], ['d', 'ArrowRight', 1, 0, 'a', 'ArrowLeft']];
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
function gameOver() {
    clearInterval(gameRunning);
    for (let k = 0; k < snakeLength; k++) {
        getCell(snakePos[k][0], snakePos[k][1]).style.backgroundColor = 'white';
    }
    getCell(applePos[0], applePos[1]).style.backgroundColor = 'white';
    document.getElementById("start").disabled = false;
    if (highScore === undefined || snakeLength > highScore) {
        highScore = snakeLength - 5;
        document.getElementById("highScore").textContent = "High Score: " + String(highScore);
    }
    gameOverCheck = true;
}
function checkAhead(ahead) {
    if (ahead[0] < 1 || ahead[0] > fieldLength || ahead[1] < 1 || ahead[1] > fieldWidth) {
        gameOver();
        return false;
    }
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
    document.getElementById("score").textContent = "Score: " + String(snakeLength - 5);
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
    if (gameOverCheck) {
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
        snakePos[i] = [2, 6];
    }
    applePos[0] = 10;
    applePos[1] = 6;
    updateField();
    document.getElementById("start").disabled = true;
    currentDirection = 'd';
    lastDirection = 'd';
    gameRunning = setInterval(function () { moveSnake(currentDirection) }, 100);
}

//generates the game field when the page is loaded
createField();
document.getElementById("start").addEventListener("click", startGame);
window.addEventListener('keydown', function (event) { currentDirection = event.key; });
