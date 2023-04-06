import React, { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(null);
  const [descSortOrder, setDescSortOrder] = useState(false);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  let historyToDisplay = winner ? history : history.slice(0, history.length - 1);

  let moves = historyToDisplay.map((squares, move) => {
    const description = move > 0
      ? 'Go to move #' + (move + 1)
      : 'Go to game start';

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (descSortOrder)
    moves = moves.reverse();

  const currentMoveText = winner
    ? 'Game over!'
    : 'You are at move #' + (currentMove + 1);

  const displayWinnerPositions = winner && currentMove === history.length - 1;

  function handlePlay(index) {
    const current = xIsNext ? 'X' : 'O';
    const nextSquares = currentSquares.slice();
    nextSquares[index] = current;

    if (!winner) {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);

      if (currentMove >= 4) {
        const checkResult = checkIfWinner(nextSquares, current);
        if (checkResult)
          setWinner({ symbol: current, positions: checkResult });
      }
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function changeSortOrder() {
    setDescSortOrder(!descSortOrder);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} winner={winner} xIsNext={xIsNext} displayWinnerPositions={displayWinnerPositions} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="game-info-button" onClick={changeSortOrder}>Change sort</button>
        <div className="game-info-list">
          <ol>{moves}</ol>
          {currentMoveText}
        </div>
      </div>
    </div>
  );
}

export function Board({ squares, winner, xIsNext, displayWinnerPositions, onPlay }) {
  const status = winner
    ? 'Winner is ' + winner.symbol
    : 'Next player: ' + (xIsNext ? 'X' : 'O');

  const squaresInRow = 3;
  const arr = arrayRange(0, 3, squaresInRow);
  const rows = arr.map((r, index) => (
    <BoardRow key={'row-' + index} squares={squares} startIndex={r} winner={winner} displayWinnerPositions={displayWinnerPositions} handleSquareClick={handleSquareClick} />
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

function BoardRow({ squares, startIndex, winner, displayWinnerPositions, handleSquareClick }) {
  const rowSquares = squares.slice(startIndex, startIndex + 3)
    .map((square, offset) => {
      const currentIndex = startIndex + offset;
      const highlighted = displayWinnerPositions && winner && winner.positions.includes(currentIndex);
      return (
        <Square value={squares[currentIndex]} highlighted={highlighted} onSquareClick={() => handleSquareClick(currentIndex)} />
      );
    });

  return (
    <div className="board-row">
      {rowSquares}
    </div>
  );
}

function Square({ value, highlighted, onSquareClick }) {
  let className = 'square';
  if (highlighted)
    className += ' highlighted';
  return (<button className={className} onClick={onSquareClick}>{value}</button>);
}

function arrayRange(start, length, step = 1) {
  return Array.from(
    { length: length },
    (value, index) => start + index * step
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
      return lines[i];
  }
  return null;
}