import React, { useState, useEffect } from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import ScoreBoard from "./components/ScoreBoard";
import "./App.css";
import shuffle from "./utilities/shuffle";
import useAppBadge from "./hooks/useAppBadge";
function App() {
  const Turn = Object.freeze({
    PLAYER_ONE: 1,
    PLAYER_TWO: 2,
  });
  
  const [cards, setCards] = useState(shuffle); // Cards array from assets
  const [pickOne, setPickOne] = useState(null);
  const [pickTwo, setPickTwo] = useState(null);
  const [disabled, setDisabled] = useState(false); // Delay handler
  const [wins, setWins] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(Turn.PLAYER_ONE)
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);
  const [setBadge, clearBadge] = useAppBadge();
  const [winMessage, setWinMessage] = useState("");

  const handleClick = (card) => {
    if (!disabled) {
      pickOne ? setPickTwo(card) : setPickOne(card);
    }
  };

  const handleTurn = () => {
    setPickOne(null);
    setPickTwo(null);
    setDisabled(false);
  };

  // Start Over
  const handleNewGame = () => {
    clearBadge();
    setWins(0);
    setPlayerOneScore(0);
    setPlayerTwoScore(0);
    if (playerOneScore >= playerTwoScore) {
      setCurrentTurn(Turn.PLAYER_ONE);
    } else {
      setCurrentTurn(Turn.PLAYER_TWO);
    }
    
    handleTurn();
    setCards(shuffle);
  };

  useEffect(() => {
    let pickTimer;

    // two card have been clicked
    if (pickOne && pickTwo) {
      //check if match
      if (pickOne.image === pickTwo.image) {
        if(currentTurn === Turn.PLAYER_ONE) {
          setPlayerOneScore(playerOneScore + 2);
        } else {
          setPlayerTwoScore(playerTwoScore + 2);
        }

        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.image === pickOne.image) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        handleTurn();
      } else {
        if(currentTurn === Turn.PLAYER_ONE) {
          setCurrentTurn(Turn.PLAYER_TWO);
        } else {
          setCurrentTurn(Turn.PLAYER_ONE);
        }
        setDisabled(true);
        pickTimer = setTimeout(() => {
          handleTurn();
        }, 1000);
      }
    }

    return () => {
      clearTimeout(pickTimer);
    };
  }, [cards, pickOne, pickTwo]);

  //if player has found all matches
  useEffect(() => {
    const checkWin = cards.filter((card) => !card.matched);
    if (cards.length && checkWin.length < 1) {
      console.log("You win!");
      if ( playerOneScore !== playerTwoScore) {
        setWinMessage(`Congrats you win ${ playerOneScore > playerTwoScore ? `Player One! ${ playerOneScore } to ${playerTwoScore}`: ` Player Two!  ${ playerTwoScore } to ${playerOneScore}`}!`);
      } else {
        setWinMessage(`It's a Tie! ${ playerOneScore } to ${playerTwoScore}`)
      }

      setTimeout(() => {
        setWins(wins + 1);
        setPlayerOneScore(0);
        setPlayerTwoScore(0);
        setCurrentTurn(Turn.PLAYER_ONE);
        setWinMessage("");
        handleTurn();
        setBadge();
        setCards(shuffle);
      }, 3000);
    }
  }, [cards, wins, setBadge]);

  return (
    <>
      <Header handleNewGame={handleNewGame} wins={wins} />
      <ScoreBoard currentTurn={currentTurn} playerOneScore={playerOneScore} playerTwoScore={playerTwoScore} />
      {winMessage && <header className="header"> <h4> {winMessage}</h4> </header>}
      <div className="grid">
        {cards.map((card) => {
          const { image, id, matched } = card;

          return (
            <Card
              key={id}
              image={image}
              selected={card === pickOne || card === pickTwo || matched}
              onClick={() => {
                handleClick(card);
              }}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
