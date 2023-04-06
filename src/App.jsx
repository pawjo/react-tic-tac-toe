import React, { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(null);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const moves = history.slice(0, history.length - 1)
    .map((squares, move) => {
      const description = move > 0
        ? 'Go to move #' + (move + 1)
        : 'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    });

  function handlePlay(index) {
    const current = xIsNext ? 'X' : 'O';
    const nextSquares = currentSquares.slice();
    nextSquares[index] = current;
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    if (currentMove >= 4 && checkIfWinner(nextSquares, current))
      setWinner(current);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} winner={winner} xIsNext={xIsNext} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        You are at move #{currentMove + 1}
      </div>
    </div>
  );
}

export function Board({ squares, winner, xIsNext, onPlay }) {
  const status = winner
    ? 'Winner is ' + winner
    : 'Next player: ' + (xIsNext ? 'X' : 'O');

  const squaresInRow = 3;
  const arr = arrayRange(0, 3, squaresInRow);
  const rows = arr.map((r, index) => (
    <BoardRow key={'row-' + index} squares={squares} startIndex={r} handleSquareClick={handleSquareClick} />
  ));

  function handleSquareClick(index) {
    if (!squares[index] && !winner)
      onPlay(index);
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div>
        {rows}
      </div>
    </div>
  );
}

function Square({ value, onSquareClick }) {
  return (<button className="square" onClick={onSquareClick}>{value}</button>);
}

function arrayRange(start, length, step = 1) {
  return Array.from(
    { length: length },
    (value, index) => start + index * step
  );
}

function BoardRow({ squares, startIndex, handleSquareClick }) {
  return (
    <div className="board-row">
      <Square value={squares[startIndex]} onSquareClick={() => handleSquareClick(startIndex)} />
      <Square value={squares[startIndex + 1]} onSquareClick={() => handleSquareClick(startIndex + 1)} />
      <Square value={squares[startIndex + 2]} onSquareClick={() => handleSquareClick(startIndex + 2)} />
    </div>
  );
}

function checkIfWinner(squares, current) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] === current && squares[b] === current && squares[c] === current)
      return true;
  }
  return false;
}