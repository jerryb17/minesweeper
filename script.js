//UI
import {
  createBoard,
  markTile,
  Tile_Status,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js";

const board_Size = 10;
const number_Of_Mines = 10;

const board = createBoard(board_Size, number_Of_Mines);
const boardElement = document.querySelector(".board");
const mineCount = document.querySelector("[data-mine-count]");
const messageShow = document.querySelector(".subtext");

board.forEach((row) =>
  row.forEach((tile) => {
    boardElement.append(tile.element);
    // 2. Left click on tiles
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd(tile);
    });
    // 3. Right click on tiles
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      // a. Reveal tiles
      // a. Mark tiles
      markTile(tile);
      listMineLeft();
    });
  })
);
mineCount.textContent = number_Of_Mines;

boardElement.style.setProperty("--size", board_Size);

function listMineLeft() {
  const markListCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === Tile_Status.Marked).length
    );
  }, 0);
  mineCount.textContent = number_Of_Mines - markListCount;
}

// 4. Check for win/ lose
function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);
  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }
  if (win) {
    messageShow.textContent = "You Win";
  }
  if (lose) {
    messageShow.textContent = "You Lose";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === Tile_Status.Marked) {
          markTile(tile);
        }
        if (tile.mine) {
          revealTile(board, tile);
        }
      });
    });
  }
}
function stopProp(e) {
  e.stopImmediatePropagation();
}
