"use strict";

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

const size64 = 8;

const createSquares = (block) => {
  let light = 0;
  for (let i = 0; i < size64; i++) {
    light ^= 1;
    for (let j = 0; j < size64; j++) {
      const div = document.createElement("div");
      div.id = `sq_${i}_${j}`;
      div.className = `square rank${i} file${j}`;
      if (light) div.className += " light";
      else div.className += " dark";
      block.append(div);
      light ^= 1;
    }
  }
};

const clearFigures = (block) => {
  const figures = block.querySelectorAll(".figure");
  if (!figures.length) return;
  for (const figure of figures) {
    block.removeChild(figure);
  }
};

const fillFigures = (block, board) => {
  clearFigures(block);
  for (let i = 0; i < size64; i++) {
    for (let j = 0; j < size64; j++) {
      if (board[i][j] >= figs.wP && board[i][j] <= figs.bK) {
        const img = new Image();
        img.src = `icons/${board[i][j]}.png`;
        img.className = `figure rank${i} file${j}`;
        block.append(img);
      }
    }
  }
};

const boardBlock = document.querySelector("#container");
createSquares(boardBlock);

const ws = new WebSocket("ws://16.171.147.213:4000");
ws.onmessage = (mes) => {
  const board = JSON.parse(mes.data);
  console.log(board);
  fillFigures(boardBlock, board);
};
