const express = require("express");
const bodyParser = require("body-parser");
const Ws = require("ws");
const url = require("url");
const Game = require("./game");

const PORT = 3000;

const app = express();

app.use(bodyParser.json());

let game;

app.post("/game", (req, res) => {
  game = new Game();
  res.status(201).json({ id: game.id });
});

app.get("/game", (req, res) => {
  res.status(200).json(game.id);
});

app.post(`/move`, (req, res) => {
  const { from, to } = req.body;
  game.makeMove({ from, to });
  game.broadcastBoard();
  res.status(201).end();
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

const wss = new Ws.Server({ server });

wss.on("connection", (conn, req) => {
  game.listeners.push(conn);
  conn.send(JSON.stringify(game.board));
});
