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
let highScore;
let removed;
let appleNumber;
//maps movement to directions, used later
const moveMapping = [['w', 'ArrowUp', 0, -1, 's', 'ArrowDown'], ['s', 'ArrowDown', 0, 1, 'w', 'ArrowUp'], ['a', 'ArrowLeft', -1, 0, 'd', 'ArrowRight'], ['d', 'ArrowRight', 1, 0, 'a', 'ArrowLeft']];
//gets cell by position to avoid typing long pieces of code
function getCell(x, y) {
    return document.querySelector('div.cell[position="[' + String(x) + ',' + String(y) + ']"]');
}
//apple generation system to handle multiple apples
function generateApples(ahead){
    //checks if all apples have been generates
    while (applePos.length < appleNumber){
        //generates new coordinates
        let appleX = Math.floor(Math.random() * fieldLength) + 1;
        let appleY = Math.floor(Math.random() * fieldWidth) + 1;
        //checks for invalid position, sees if apple is on apple, snake, or ahead
        const onSnake = snakePos.some((pos) => pos[0] == appleX && pos[1] == appleY);
        const onAhead = (ahead[0] == appleX && ahead[1] == appleY);
        const onApple = applePos.some((pos) => pos[0] == appleX && pos[1] == appleY)
        if (!onSnake && !onAhead && !onApple){
            applePos[applePos.length] = [appleX, appleY];
        }
    }
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
        updateField(true);
        return;
    }
    //checks if next move is an apple, grows snake and regenerates apple if true
    if (getCell(ahead[0], ahead[1]).style.backgroundColor == 'red') {
        //finds index of apple hit and removes it
        let appleRemove = applePos.findIndex((apple) => apple[0] == ahead[0] && apple[1] == ahead[1]);
        applePos.splice(appleRemove,1);
        //regenerates apples and increases length of snake
        generateApples(ahead);
        snakeLength++;
        snakePos.push(ahead);
        updateField(false);
        return;
    }
    //checks if next move is back in the snake, excluding the tail
    else if (snakePos.some((pos, index) => index !==0 && ahead[0] == pos[0] && ahead[1] == pos[1])) {
        updateField(true);
        return;
    }
    //if not game over or apple, just extends the snake and removes the end
    else {
        removed = snakePos[0];
        snakePos.splice(0, 1);
    }
    //moves snake forward if move is completely valid
    snakePos.push(ahead);
    updateField(false);
}

function updateField(isGameOver) {
    //checks if game isn't over, then continues game
    if (!isGameOver) {
        //recolors removed part of snake to white
        if (removed) {
            getCell(removed[0], removed[1]).style.backgroundColor = 'white';
        }
        //loops through each snake position, coloring them green and the head dark green
        snakePos.forEach((pos) => getCell(pos[0],pos[1]).style.backgroundColor = 'green')
        getCell(snakePos[snakeLength - 1][0], snakePos[snakeLength -1][1]).style.backgroundColor = 'darkgreen';
        //colors each apple red
        applePos.forEach((apple) => getCell(apple[0], apple[1]).style.backgroundColor = 'red');
        document.getElementById("score").textContent = "Score: " + String(snakeLength - 5);
    }
        if (isGameOver) {
            clearInterval(gameRunning);
            snakePos.forEach((pos) => getCell(pos[0], pos[1]).style.backgroundColor = 'white')
            applePos.forEach((pos) => getCell(pos[0], pos[1]).style.backgroundColor = 'white')
            applePos.length = 0;
            document.getElementById("start").disabled = false;
            if (highScore === undefined || (snakeLength-5) > highScore) {
                highScore = snakeLength - 5;
                document.getElementById("highScore").textContent = "High Score: " + String(highScore);
            }
            snakePos.length = 0;
        }
    }
//checks input and compares it to move mapping, uses last direction if move isn't valid
function chooseDirection(input) {
    if (moveMapping.some((move) => (input == move[0] || input == move[1]) && (lastDirection != move[4] && lastDirection != move[5]))) {
        lastDirection = input;
        return moveMapping.find((move) => input == move[0] || input == move[1]).slice(2, 4);
    }
    return chooseDirection(lastDirection);
}
//combination of all function, first finds the next move, then checks ahead of the move, then updates the field.
function moveSnake(direction) {
    if (snakeLength == fieldLength * fieldWidth) {
        updateField(true);
        document.getElementById("score").textContent = "You win! Final Score: " + String(snakeLength - 5);
        return;
    }
    var move = chooseDirection(direction);
    const currentHead = snakePos[snakeLength - 1];
    const nextHead = [currentHead[0] + move[0], currentHead[1] + move[1]];
    checkAhead(nextHead);
}
//starts the game by reseting snakeLength, game over, snake and apple positions, then starts game loop
function startGame() {
    snakeLength = 5;
    appleNumber = document.getElementById("appleSelector").value;
    for (let i = 0; i < snakeLength; i++) {
        snakePos.push([2 + i, 6]);
    }
    document.getElementById("start").disabled = true;
    currentDirection = 'd';
    lastDirection = 'd';
    const head = snakePos[snakeLength - 1];
    generateApples([head[0] + 1, head[1]]);
    updateField(false);
    gameRunning = setInterval(function () { moveSnake(currentDirection) }, 100);
}

//generates the game field when the page is loaded
createField();
document.getElementById("start").addEventListener("click", startGame);
window.addEventListener('keydown', function (event) { currentDirection = event.key; });