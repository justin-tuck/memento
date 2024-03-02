import React, { useState, useEffect } from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import "./App.css";
import shuffle from "./utilities/shuffle";
import useAppBadge from "./hooks/useAppBadge";
function App() {
  const [cards, setCards] = useState(shuffle); // Cards array from assets
  const [pickOne, setPickOne] = useState(null);
  const [pickTwo, setPickTwo] = useState(null);
  const [disabled, setDisabled] = useState(false); // Delay handler
  const [wins, setWins] = useState(0);
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
    handleTurn();
    setCards(shuffle);
  };

  useEffect(() => {
    let pickTimer;

    // two card have been clicked
    if (pickOne && pickTwo) {
      //check if match
      if (pickOne.image === pickTwo.image) {
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

      setWinMessage("Congrats you win Celeste!");
      setTimeout(() => {
        setWins(wins + 1);
        setWinMessage("");
        handleTurn();
        setBadge();
        setCards(shuffle);
      }, 2000);
    }
  }, [cards, wins, setBadge]);

  return (
    <>
      <Header handleNewGame={handleNewGame} wins={wins} />
      {winMessage && <h4> {winMessage}</h4>}
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
