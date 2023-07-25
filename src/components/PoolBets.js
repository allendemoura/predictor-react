import React, { useState } from "react";

import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

// color wheel selected for contrast

const OVER_COLORS = ["#4d7c0f", "#84cc16", "#bef264", "#84cc16", "#4d7c0f", "#365314"];

const UNDER_COLORS = ["#b91c1c", "#ef4444", "#fca5a5", "#ef4444", "#b91c1c", "#7f1d1d"];

export const PoolBets = (props) => {
  const { pool, type, user } = props;

  const COLORS = type === "over" ? OVER_COLORS : UNDER_COLORS;

  // set state using hooks
  const [isBetting, setIsBetting] = useState(false);
  const [betAmount, setBetAmount] = useState(0);

  // check if pool is over or under
  const poolAmount = (type === "over" ? pool.overPool : pool.underPool) + betAmount;
  const ratio = betAmount / (poolAmount + betAmount);
  const winnings = Math.round(ratio * (type === "over" ? pool.underPool : pool.overPool)) + betAmount;

  const [isHovering, setIsHovering] = useState(false);
  const [hoveredUserName, setHoveredUserName] = useState(``);
  const [hoveredUserBet, setHoveredUserBet] = useState(0);

  // display bet info on hover
  const handleTouchMove = (e) => {
    const element = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);

    if (!element) return;
    if (element.dataset.type !== type) return;

    setIsHovering(true);
    setHoveredUserName(element.dataset.name);
    setHoveredUserBet(element.dataset.amount);
  };

  // reset display to default on mouse leave
  const handleTouchEnd = () => {
    setIsHovering(false);
  };

  function handleOpenBetForm() {
    setIsBetting(true);
  }

  function handleCloseBetForm() {
    setIsBetting(false);
    setBetAmount(0);
  }

  function handleIncrementBet() {
    if (betAmount < user.balance) {
      setBetAmount(betAmount + 1);
    }
  }

  function handleDecrementBet() {
    if (betAmount > 0) {
      setBetAmount(betAmount - 1);
    }
  }

  return (
    <div className={`h-1/2 touch-none	flex ${type === "over" ? "bg-lime-100" : "bg-red-100"}`}>
      {/* center display that will show total by default and show individual bets on hover over the bar segments */}
      <div className="text-black text-center h-full grow flex flex-col items-center justify-center">
        {isBetting && (
          <>
            <div>Pot Share: {Math.floor(ratio * 100)}%</div>
            <div>Minimum Winnings: {winnings}</div>
          </>
        )}

        {isHovering ? (
          <>
            <div className="text-4xl font-display font-light">{hoveredUserBet}</div>
            <div>{hoveredUserName}</div>
          </>
        ) : (
          <>
            <div className="text-4xl font-display font-light">{poolAmount}</div>
            <div>Total of {type} bets</div>
          </>
        )}

        {isBetting ? (
          type === "over" ? (
            <>
              <button className="w-full px-4 py-3 bg-orange-700 text-white rounded-lg gap-2 text-center my-1">
                SHIP IT
              </button>
              <div className="w-full px-4 py-3 bg-lime-500 text-white rounded-md flex gap-2">
                <button
                  className="w-1/4 border-2 border-black border-solid text-2xl mx-auto"
                  onClick={handleDecrementBet}
                >
                  -
                </button>
                <div onClick={handleCloseBetForm}>{betAmount}</div>
                <button
                  className="w-1/4 border-2 border-black border-solid text-2xl mx-auto"
                  onClick={handleIncrementBet}
                >
                  +
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-full px-4 py-3 bg-red-500 text-white rounded-md flex gap-2">
                <button
                  className="w-1/4 border-2 border-black border-solid text-2xl mx-auto"
                  onClick={handleDecrementBet}
                >
                  -
                </button>
                <div onClick={handleCloseBetForm}>{betAmount}</div>
                <button
                  className="w-1/4 border-2 border-black border-solid text-2xl mx-auto"
                  onClick={handleIncrementBet}
                >
                  +
                </button>
              </div>
              <button className="w-full px-4 py-3 bg-orange-700 text-white rounded-lg gap-2 text-center my-1">
                SHIP IT
              </button>
            </>
          )
        ) : type === "over" ? (
          <button className="w-full px-4 py-3 bg-lime-500 text-white rounded-md flex gap-2" onClick={handleOpenBetForm}>
            <AiOutlineArrowUp className="relative top-1" />
            Bet the over
            <AiOutlineArrowUp className="relative top-1" />
          </button>
        ) : (
          <button className="w-full px-4 py-3 bg-red-500 text-white rounded-md flex gap-2" onClick={handleOpenBetForm}>
            <AiOutlineArrowDown className="relative top-1" />
            Bet the under
            <AiOutlineArrowDown className="relative top-1" />
          </button>
        )}
      </div>

      {/* bet bar selector display */}
      <div
        className="w-5 h-full bg-gray-300 ml-auto flex flex-col align-end"
        onTouchEnd={handleTouchEnd}
        onTouchMove={(e) => handleTouchMove(e, type)}
      >
        {/* loop out all the bets for the given side of the pool */}
        {pool.bets
          .filter((bet) => bet.bet === type.toUpperCase())
          .map((bet, index) => {
            // {pool.bets.map((bet, index) => {
            return (
              // makes a proportionate section of the bar for each bet
              <div
                key={bet.id}
                className="w-full border-transparent relative"
                data-name={`${bet.better.firstName} ${bet.better.lastName}`}
                data-amount={bet.amount}
                data-type={type}
                style={{
                  height: `${(bet.amount / poolAmount) * 100}%`, // proportionate height calculated as percentage of total pool
                  backgroundColor: COLORS[index % COLORS.length], // cycle through colors selected for constrast adjacency
                }}
              ></div>
            );
          })}
        {/* user bet preview bar */}
        <div
          key={"user"}
          className="w-full border-transparent relative"
          data-name={`${user.firstName} ${user.lastName}`}
          data-amount={betAmount}
          data-type={type}
          style={{
            height: `${(betAmount / poolAmount) * 100}%`, // proportionate height calculated as percentage of total pool
            backgroundColor: "orange", // cycle through colors selected for constrast adjacency
          }}
        ></div>
      </div>
    </div>
  );
};
