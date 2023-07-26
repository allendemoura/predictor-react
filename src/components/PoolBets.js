import React, { useState } from "react";

import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

// color wheels selected for contrast
const OVER_COLORS = ["#4d7c0f", "#84cc16", "#bef264", "#84cc16", "#4d7c0f", "#365314"];
const UNDER_COLORS = ["#fca5a5", "#f87171", "#dc2626", "#991b1b", "#450a0a"];

export const PoolBets = (props) => {
  // destructure props into vars
  const { pool, type, user } = props;

  // set color wheel based on pool type
  const COLORS = type === "over" ? OVER_COLORS : UNDER_COLORS;

  // set state using hooks
  const [isBetting, setIsBetting] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredUserName, setHoveredUserName] = useState(``);
  const [hoveredUserBet, setHoveredUserBet] = useState(0);

  // check if pool is over or under set vars accordingly
  const poolAmount = (type === "over" ? pool.overPool : pool.underPool) + betAmount;
  const ratio = betAmount / (poolAmount + betAmount);
  const winnings = Math.round(ratio * (type === "over" ? pool.underPool : pool.overPool)) + betAmount;
  // filter for only bets of the given type and reverse the array order if under for design symmetry
  const bets =
    type === "over"
      ? pool.bets.filter((bet) => bet.bet === type.toUpperCase())
      : pool.bets.filter((bet) => bet.bet === type.toUpperCase()).toReversed();

  // display bet info on hover
  const handleTouchMove = (e) => {
    // get element at touch location
    const element = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);

    if (!element) return;
    if (element.dataset.type !== type) return;

    // set state to display bet info
    setIsHovering(true);
    setHoveredUserName(element.dataset.name);
    setHoveredUserBet(element.dataset.amount);
  };

  // reset display to default on mouse leave
  const handleTouchEnd = () => {
    setIsHovering(false);
  };

  // bet button click handlers
  function handleOpenBetForm() {
    if (user) {
      setIsBetting(true);
    } else {
      // redirect to sign in page if not logged in using react router
      // TODO: figure out how to do this with clerk?
      // TODO: do this properly with react router?
      window.location.href = "/sign-in";
    }
  }

  function handleCloseBetForm() {
    setIsBetting(false);
    setBetAmount(0);
  }

  // plus and minus button handlers
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
      <div className="text-black text-center h-full grow flex flex-col items-center justify-center">
        {/* display winnings info if bet form is open */}
        {isBetting && (
          <>
            <div>Pot Share: {Math.floor(ratio * 100)}%</div>
            <div>Minimum Winnings: {winnings}</div>
          </>
        )}

        {/* display individual bet info on bar hover */}
        {isHovering ? (
          <>
            <div className="text-4xl font-display font-light">{hoveredUserBet}</div>
            <div>{hoveredUserName}</div>
          </>
        ) : (
          // else default to total bets
          <>
            <div className="text-4xl font-display font-light">{poolAmount}</div>
            <div>Total of {type} bets</div>
          </>
        )}

        {/* transform to bet form buttons if bet button is clicked */}
        {isBetting ? (
          // green over version of transformed betting form buttons
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
            // red under version of transformed betting form buttons
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
        ) : // green over version of default bet button
        type === "over" ? (
          <button className="w-full px-4 py-3 bg-lime-500 text-white rounded-md flex gap-2" onClick={handleOpenBetForm}>
            <AiOutlineArrowUp className="relative top-1" />
            Bet the over
            <AiOutlineArrowUp className="relative top-1" />
          </button>
        ) : (
          // red under version of default bet button
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
        {
          // loop out all the bets for the given side of the pool and render them
          bets.map((bet, index) => {
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
          })
        }
        {/* user bet preview bar */}
        {user && (
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
        )}
      </div>
    </div>
  );
};
