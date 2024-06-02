const uuid = require("uuid");

const figs = {
  empty: 0,
  wP: 1,
  wN: 2,
  wB: 3,
  wR: 4,
  wQ: 5,
  wK: 6,
  bP: 7,
  bN: 8,
  bB: 9,
  bR: 10,
  bQ: 11,
  bK: 12,
};

const squareToIndexes = (square) => {
  const fileToColumnIndex = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
  };
  const [file, row] = square.split("");
  return [8 - Number(row), fileToColumnIndex[file]];
};

const initBoard = () => {
  const board = [];
  board.push([
    figs.bR,
    figs.bN,
    figs.bB,
    figs.bQ,
    figs.bK,
    figs.bB,
    figs.bN,
    figs.bR,
  ]);
  const blackPawns = [];
  for (let i = 0; i < 8; i++) blackPawns.push(figs.bP);
  board.push(blackPawns);
  for (let i = 2; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 8; j++) row.push(figs.empty);
    board.push(row);
  }
  const whitePawns = [];
  for (let i = 0; i < 8; i++) whitePawns.push(figs.wP);
  board.push(whitePawns);
  board.push([
    figs.wR,
    figs.wN,
    figs.wB,
    figs.wQ,
    figs.wK,
    figs.wB,
    figs.wN,
    figs.wR,
  ]);
  return board;
};

module.exports = class Game {
  constructor() {
    this.id = uuid.v4();
    this.board = initBoard();
    this.listeners = [];
  }

  makeMove({ from, to }) {
    const [fromI, fromJ] = squareToIndexes(from);
    const [toI, toJ] = squareToIndexes(to);
    const figure = this.board[fromI][fromJ];
    this.board[fromI][fromJ] = figs.empty;
    this.board[toI][toJ] = figure;
  }

  broadcastBoard() {
    for (const listener of this.listeners) {
      listener.send(JSON.stringify(this.board));
    }
  }
};
