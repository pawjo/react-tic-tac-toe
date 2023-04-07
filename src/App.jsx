import React, { useState } from "react";

const winningPositions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [positionHistory, setPositionHistory] = useState([{}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [finishedGameStatus, setFinishedGameStatus] = useState(null);
  const [descSortOrder, setDescSortOrder] = useState(false);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  let historyToDisplay = finishedGameStatus ? history : history.slice(0, history.length - 1);

  let moves = historyToDisplay.map((squares, move) => {
    const currentPosition = positionHistory[move];
    const description = move > 0
      ? `Go to move #${move + 1} (${currentPosition.x}, ${currentPosition.y})`
      : 'Go to game start';

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (descSortOrder)
    moves = moves.reverse();

  const currentMoveText = finishedGameStatus
    ? 'Game over!'
    : 'You are at move #' + (currentMove + 1);

  const displayWinnerPositions = finishedGameStatus
    && finishedGameStatus.symbol !== 'd'
    && currentMove === history.length - 1;

  function handlePlay(index) {
    const current = xIsNext ? 'X' : 'O';
    const nextSquares = currentSquares.slice();
    nextSquares[index] = current;
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);

    const nextPosition = { x: ~~(index / 3), y: index % 3 };
    const nextHistoryPosition = [...positionHistory.slice(0, currentMove + 1), nextPosition];
    setPositionHistory(nextHistoryPosition);

    setCurrentMove(nextHistory.length - 1);

    if (currentMove >= 4) {
      const checkResult = checkIfWinner(nextSquares, current);
      if (checkResult === -1)
        setFinishedGameStatus({ symbol: 'd' });
      else if (checkResult > 0)
        setFinishedGameStatus({ symbol: current, positions: checkResult });
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
        <Board squares={currentSquares} finishedGameStatus={finishedGameStatus} xIsNext={xIsNext} displayWinnerPositions={displayWinnerPositions} onPlay={handlePlay} />
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

export function Board({ squares, finishedGameStatus, xIsNext, displayWinnerPositions, onPlay }) {
  const status = finishedGameStatus
    ? (finishedGameStatus.symbol === 'd')
      ? 'Game is a draw!'
      : 'Winner is ' + finishedGameStatus.symbol
    : 'Next player: ' + (xIsNext ? 'X' : 'O');

  const squaresInRow = 3;
  const arr = arrayRange(0, 3, squaresInRow);
  const rows = arr.map((r, index) => (
    <BoardRow key={'row-' + index} squares={squares} startIndex={r} winner={finishedGameStatus} displayWinnerPositions={displayWinnerPositions} handleSquareClick={handleSquareClick} />
  ));

  function handleSquareClick(index) {
    if (!squares[index] && !finishedGameStatus)
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
      const highlighted = displayWinnerPositions && winningPositions[winner.positions].includes(currentIndex);
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
  let lockedCount = 0;
  let freeCount = 0;

  for (let i = 0; i < winningPositions.length; i++) {
    // const [a, b, c] = lines[i];
    // if (squares[a] === current && squares[b] === current && squares[c] === current)
    //   return lines[i];

    let currentCount = 0;
    let oppositeCount = 0;

    winningPositions[i].forEach(x => {
      if (squares[x] === current)
        currentCount++;
      else if (squares[x])
        oppositeCount++;
      else
        freeCount++;
    });

    if (currentCount === 3)
      // return index of winner position
      return i;

    if (currentCount > 0 && oppositeCount > 0)
      lockedCount++;
  }

  // return -1 if game is a draw or return 0 if anyone can win
  const isDraw = lockedCount === 8 || (lockedCount === 7 && freeCount === 2);
  return isDraw ? -1 : 0;
}


function getOccurence(array, searchValue) {
  let count = 0;
  array.forEach(x => x === searchValue && count++);
  return count;
}