// add javascript here
let fieldWidth = 8;
let fieldLength = 8;
const snakePos = [];

//gets cell by position to avoid typing long pieces of code
function getCell(x,y){
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
            cell.id = "cell" + String((i-1) * fieldLength + j);
            row.appendChild(cell);
            //coordinates of the cell are stored as (x,y)
            cell.setAttribute("position", "[" + String(j) + "," + String(i) + "]");
        }
    }
}
function startGame(){
}
//generates the game field when the page is loaded
createField();
document.getElementById("start").addEventListener("click", startGame);