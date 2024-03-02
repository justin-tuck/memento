import React from 'react';

const ScoreBoard = ({ currentTurn, playerOneScore, playerTwoScore }) => {
  return (
    <header className="header">
      <h2>Score</h2>
      <div>
        <h3>P1: {playerOneScore} {currentTurn === 1 && "(Your Turn)"}</h3>
      </div>
      <div>
        <h3>P2: {playerTwoScore} {currentTurn === 2 && "(Your Turn)"}</h3>
      </div>
    </header>
  );
};

export default ScoreBoard;
