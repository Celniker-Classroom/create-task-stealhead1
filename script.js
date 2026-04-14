// add javascript here
let fieldWidth = 8;
let fieldLength = 8;
const snakePos = [];
const applePos = [];
let snakeLength;
let currentDirection = 'd';

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

function updateField(removedSnake) {
    if (removedSnake) {
        getCell(removedSnake[0], removedSnake[1]).style.backgroundColor = 'white';
    }
    for (i = 0; i < snakeLength; i++) {
        getCell(snakePos[i][0], snakePos[i][1]).style.backgroundColor = 'green';
    }
    getCell(applePos[0], applePos[1]).style.backgroundColor = 'red';
}
function moveSnake(direction) {
    let newX = snakePos[snakeLength - 1][0];
    let newY = snakePos[snakeLength - 1][1];
    if (direction == 'w' || direction == 'arrowUp') {
        newY -= 1;
    }
    else if (direction == 'd' || direction == 'arrowRight') {
        newX += 1;
    }
    else if (direction == 's' || direction == 'arrowDown') {
        newY += 1;
    }
    else if (direction == 'a' || direction == 'arrowLeft') {
        newX -= 1;
    }
    snakePos[snakeLength] = [newX, newY];
    var removed = snakePos[0];
    snakePos.splice(0, 1);
    updateField(removed);
}
function startGame() {
    snakeLength = 5;
    for (i = 0; i < snakeLength; i++) {
        snakePos[i] = [2, 4];
    }
    applePos[0] = 8;
    applePos[1] = 4;
    updateField();
    setInterval(function () { moveSnake(currentDirection) }, 1000);
}

//generates the game field when the page is loaded
createField();
document.getElementById("start").addEventListener("click", startGame);
window.addEventListener('keydown', function (event) { currentDirection = event.key })
