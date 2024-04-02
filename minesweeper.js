//logic

export const Tile_Status = {
  Hidden: "hidden",
  Mine: "mine",
  Marked: "marked",
  NUMBER: "number",
};

export function createBoard(boardSize, numberOfMines) {
  const board = [];
  // 1. Populate a board with tiles/mines
  const minePosition = getMinePosition(boardSize, numberOfMines);
  console.log(minePosition);
  for (let x = 0; boardSize > x; x++) {
    const row = [];
    for (let y = 0; boardSize > y; y++) {
      const element = document.createElement("div");
      element.dataset.status = Tile_Status.Hidden;
      const tile = {
        element,
        x,
        y,
        mine: minePosition.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

export function markTile(tile) {
  if (
    tile.status !== Tile_Status.Hidden &&
    tile.status !== Tile_Status.Marked
  ) {
    return;
  }
  if (tile.status === Tile_Status.Marked) {
    tile.status = Tile_Status.Hidden;
  } else {
    tile.status = Tile_Status.Marked;
  }
}

export function revealTile(board, tile) {
  if (tile.status !== Tile_Status.Hidden) return;

  if (tile.mine) {
    tile.status = Tile_Status.Mine;
  } else {
    tile.status = Tile_Status.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile);
    const mines = adjacentTiles.filter((t) => t.mine);
    if (mines.length === 0) {
      adjacentTiles.forEach(revealTile.bind(null, board));
    } else {
      tile.element.textContent = mines.length;
    }
  }
}

function getMinePosition(boardSize, numberOfMines) {
  const minePositions = [];

  while (minePositions.length < numberOfMines) {
    const position = {
      x: randomPosition(boardSize),
      y: randomPosition(boardSize),
    };
    if (!minePositions.some((p) => positionMatch(p, position))) {
      minePositions.push(position);
    }
    // if (!minePositions.some(positionMatch.bind(null, position))) {
    //   minePositions.push(position);
    // }
  }

  return minePositions;
}

function randomPosition(size) {
  return Math.floor(Math.random() * size);
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function nearbyTiles(board, { x, y }) {
  const tiles = [];
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }
  return tiles;
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === Tile_Status.NUMBER ||
        (tile.mine &&
          (tile.status === Tile_Status.Hidden ||
            tile.status === Tile_Status.Marked))
      );
    });
  });
}
export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === Tile_Status.Mine;
    });
  });
}
