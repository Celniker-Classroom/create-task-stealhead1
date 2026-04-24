//Originally had fieldy and fieldx be fieldwidth and fieldlength, I asked the
//github copilot ai to replace all instances of the 2nd ones with the 1st ones
let fieldY;
let fieldX;
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
let startTime;
//maps movement to directions, used later
const moveMapping = [['w', 'ArrowUp', 0, -1, 's', 'ArrowDown'],
['s', 'ArrowDown', 0, 1, 'w', 'ArrowUp'],
['a', 'ArrowLeft', -1, 0, 'd', 'ArrowRight'],
['d', 'ArrowRight', 1, 0, 'a', 'ArrowLeft']];
const difficultyMapping = [['easy', 8, 8], ['medium', 13, 13], ['hard', 20, 20]];
//gets cell by position to avoid typing long pieces of code
function getCell(x, y) {
    return document.querySelector('div.cell[position="[' + String(x) + ',' + String(y) + ']"]');
}

//apple generation system to handle multiple apples
function generateApples(ahead){
    //checks if all apples have been generates
    while (applePos.length < appleNumber && applePos.length < (fieldX * fieldY - snakeLength - 1)){
        //generates new coordinates
        let appleX = Math.floor(Math.random() * fieldX) + 1;
        let appleY = Math.floor(Math.random() * fieldY) + 1;
        //checks for invalid position, sees if apple is on apple, snake, or ahead
        const onSnake = snakePos.some((pos) => pos[0] == appleX && pos[1] == appleY);
        const onAhead = (ahead[0] == appleX && ahead[1] == appleY);
        const onApple = applePos.some((pos) => pos[0] == appleX && pos[1] == appleY);
        if (!onSnake && !onAhead && !onApple){
            applePos[applePos.length] = [appleX, appleY];
        }
    }
}

//ai was used to debug this function when I accidently used i in the j for loop
function createField() {
    //clears field
    document.getElementById("field").innerHTML = "";
    //generates rows and makes them children of field
    for (let i = 1; i <= fieldY; i++) {
        const row = document.createElement("div");
        row.id = "row" + String(i);
        row.classList.add("rows");
        row.style.height = String(100 / fieldY) + "%";
        document.getElementById("field").appendChild(row);
        //generates cells and makes them children of rows
        for (let j = 1; j <= fieldX; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = "cell" + String((i - 1) * fieldX + j);
            cell.style.width = String(100 / fieldX) + "%";
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
    if (ahead[0] < 1 || ahead[0] > fieldX || ahead[1] < 1 || ahead[1] > fieldY) {
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
        snakePos.forEach((pos) => getCell(pos[0],pos[1]).style.backgroundColor = 'green');
        getCell(snakePos[snakeLength - 1][0], snakePos[snakeLength -1][1]).style.backgroundColor = 'darkgreen';
        //colors each apple red
        applePos.forEach((apple) => getCell(apple[0], apple[1]).style.backgroundColor = 'red');
        document.getElementById("score").textContent = "Score: " + String(snakeLength - 5);
        let currentTime = Date.now();
        let elapsedTime = ((currentTime - startTime) / 1000).toFixed(2);
        document.getElementById("timer").textContent = "Time: " + String(elapsedTime) + " seconds";
    }   
    //checks if the game is over
        if (isGameOver) {
            //stops the game from running
            clearInterval(gameRunning);
            //all snakes and apples are removed from the field
            snakePos.forEach((pos) => getCell(pos[0], pos[1]).style.backgroundColor = 'white');
            applePos.forEach((pos) => getCell(pos[0], pos[1]).style.backgroundColor = 'white');
            //clears the apple array
            applePos.length = 0;
            //reneables the start button
            document.getElementById("start").disabled = false;
            //updates the high score
            if (highScore === undefined || (snakeLength-5) > highScore) {
                highScore = snakeLength - 5;
                document.getElementById("highScore").textContent = "High Score: " + String(highScore);
            }
            //resets the snake array
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
    if (snakeLength == fieldX * fieldY) {
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
    //starts timer, sets snake length, then checks for valid apple number
    let selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').id;
    let dimensions = difficultyMapping.find((move) => move[0] == selectedDifficulty);
    fieldX = dimensions[1];
    fieldY = dimensions[2];
    createField();
    startTime = Date.now();
    snakeLength = 5;
    appleNumber = document.getElementById("appleSelector").value;
    if (appleNumber == '' || appleNumber <= 0 || appleNumber >= fieldX * fieldY - snakeLength){
        appleNumber = 1;
    }
    //generates starting snake position
    for (let i = 0; i < snakeLength; i++) {
        snakePos.push([1+i, Math.floor(fieldY / 2)]);
    }
    //disables start button and sets starting direction
    document.getElementById("start").disabled = true;
    currentDirection = 'd';
    lastDirection = 'd';
    //generates apples in valid positions then dispays the field, then starts game loop
    const head = snakePos[snakeLength - 1];
    generateApples([head[0] + 1, head[1]]);
    updateField(false);
    gameRunning = setInterval(function () { moveSnake(currentDirection) }, 100);
}

//sets up event liseners for buttons and controls

document.getElementById("start").addEventListener("click", startGame);
window.addEventListener('keydown', function (event) { currentDirection = event.key; });