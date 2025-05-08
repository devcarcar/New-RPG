import readline from "readline";

function outputGrid(data) {
  let current = "";
  for (let i = 0; i < 100; i++) {
    if (i % 10 == 0) {
      current += "\n";
    }
    if (data[i].isRevealed) {
      current += data[i].type;
    } else {
      current += "b";
    }
  }
  return current;
}

function determineSquare(grid, input) {
  if (input < 0 || input > 99) return;
  if (grid[input].isMine) return;
  grid[input] = {
    isMine: false,
    type: grid[input].type + 1,
    isRevealed: false,
  };
}

function createGrid() {
  const grid = [];

  for (let i = 0; i < 100; i++)
    grid.push({ isMine: false, type: 0, isRevealed: false });
  const listOfMines = [];
  for (let i = 0; i < 15; i++) {
    let random = Math.floor(Math.random() * 100);
    while (listOfMines.includes(random)) {
      random = Math.floor(Math.random() * 100);
    }
    listOfMines.push(random);
  }
  for (let i = 0; i < 15; i++) {
    grid[listOfMines[i]] = { isMine: true, type: "x" };
    if (listOfMines[i] > 9) determineSquare(grid, listOfMines[i] - 10);
    if (listOfMines[i] < 90) determineSquare(grid, listOfMines[i] + 10);
    if (listOfMines[i] % 10 != 0) determineSquare(grid, listOfMines[i] - 1);
    if (listOfMines[i] % 10 != 9) determineSquare(grid, listOfMines[i] + 1);
    if (listOfMines[i] > 9 && listOfMines[i] % 10 != 0)
      determineSquare(grid, listOfMines[i] - 11);
    if (listOfMines[i] > 9 && listOfMines[i] % 10 != 9)
      determineSquare(grid, listOfMines[i] - 9);
    if (listOfMines[i] < 90 && listOfMines[i] % 10 != 9)
      determineSquare(grid, listOfMines[i] + 11);
    if (listOfMines[i] < 90 && listOfMines[i] % 10 != 0)
      determineSquare(grid, listOfMines[i] + 9);
  }
  return grid;
}
const data = createGrid();

const rl = readline.createInterface(process.stdin, process.stdout);

async function question(data) {
  rl.question("Choose your x(1-10): ", (x) => {
    if (x > 10 || x < 1 || isNaN(parseInt(x)) || x.length > 1) {
      console.log("Invalid Number");
      question(data);
    }
    x = parseInt(x) - 1;
    rl.question("Choose your y(1-10): ", (y) => {
      if (y > 10 || y < 1 || isNaN(parseInt(y)) || y.length > 1) {
        console.log("Invalid Number");
        question(data);
      }
      y = parseInt(y) - 1;
      if (data[x * 10 + y].type === "x") {
        console.log("You stepped on a mine");
        rl.question("Restart?(y/n) ", (bool) => {
          if (bool == "y") {
            data = createGrid();
            question(data);
          } else {
            for (let i = 0; i < 100; i++) data[i].isRevealed = true;
            console.log(outputGrid(data));
            return rl.close();
          }
        });
      } else {
        data[x * 10 + y].isRevealed = true;
        console.log(outputGrid(data));
        question(data);
      }
    });
  });
}

question(data);
