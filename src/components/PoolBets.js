import React, { useState } from "react";

import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { BsGem } from "react-icons/bs";

// color wheels selected for contrast
const OVER_COLORS = ["#4d7c0f", "#84cc16", "#bef264", "#84cc16", "#4d7c0f", "#365314"];
const UNDER_COLORS = ["#fca5a5", "#f87171", "#dc2626", "#991b1b", "#450a0a"];

export const PoolBets = (props) => {
  // destructure props into vars
  const { pool, type, user } = props;

  const totalInBothPools = pool.overPool + pool.underPool;
  const thisPoolTotal = type === "over" ? pool.overPool : pool.underPool;

  const percentageOfTotal = thisPoolTotal / totalInBothPools;

  // set color wheel based on pool type
  const COLORS = type === "over" ? OVER_COLORS : UNDER_COLORS;

  // set state using hooks
  const [isBetting, setIsBetting] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredUserName, setHoveredUserName] = useState(``);
  const [hoveredUserBet, setHoveredUserBet] = useState(0);

  // check if pool is over or under set vars accordingly
  const poolAmount = thisPoolTotal + betAmount;
  const ratio = betAmount / (poolAmount + betAmount);
  const winnings = Math.round(ratio * thisPoolTotal) + betAmount;

  // filter for only bets of the given type and reverse the array order if under for design symmetry
  const bets =
    type === "over"
      ? pool.bets
          .filter((bet) => bet.bet === type.toUpperCase())
          .sort((a, b) => a.amount - b.amount)
          .toReversed()
      : pool.bets.filter((bet) => bet.bet === type.toUpperCase()).sort((a, b) => a.amount - b.amount);

  // determine if logged in user has bet on this pool
  let userBet = null;
  if (user) {
    userBet = pool.bets.filter((bet) => bet.better.id === user.id)[0];
  }

  // if pool is resolved, redirect to root
  // TODO: handle this better
  // TODO+: make a resolved pool page?
  if (pool.result !== "PENDING") {
    window.location.href = "/";
  }

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
    // only allow bets if logged in and user has not already bet on the other side
    if (user) {
      if (userBet && userBet.bet === type.toUpperCase()) {
        setIsBetting(true);
      } else if (!userBet) {
        setIsBetting(true);
      } else {
        const poolType = type === "over" ? "Under" : "Over";
        alert(`You have already bet on the ${poolType}! You can only bet on one side of the pool.`);
      }
    } else {
      // redirect to sign in page if not logged in using react router
      window.location.href = "/sign-in";
      // TODO: figure out how to do this with clerk?
      // TODO: do this properly with react router?
      // TODO: figure out how to redirect back to pool page after sign in
    }
  }

  function handleCloseBetForm() {
    setIsBetting(false);
    setBetAmount(0);
  }

  // plus and minus button handlers
  // TODO: make this work when held down
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

  // function to submit bet from to backend form info
  // TODO: is there a way to stop the http request from going in the browser address bar and back button history?
  const handleSubmit = async (event) => {
    // send bet to backend
    const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/bets`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        amount: parseInt(betAmount),
        poolID: parseInt(pool.id),
        bet: type.toUpperCase(),
        betterID: user.id,
      }),
    });

    // check response
    const json = await response.json();
    if (!response.ok) {
      console.log(json);
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      console.log(json);

      // TODO: update user balance and pool amount on frontend for UI snappiness

      // refresh bet data (note by tebbo: this function don't exist anymore. We
      // will figure it out later. Got removed when i switched to react-router)
      // fetchAllMyBets();
    }
  };

  // TODO: fix refresh issue on pool amount when submitting bet (pool total doesnt always update without manual refresh)
  return (
    <div
      style={{ height: `${percentageOfTotal * 100}%` }}
      className={`min-h-[256px] touch-none	flex ${
        type === "over" ? "bg-lime-100 flex-col-reverse pb-12" : "bg-red-100 flex-col pt-12"
      }`}
    >
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
            <div className="text-5xl font-display font-light flex items-center">
              {poolAmount}{" "}
              <span className="text-lg pl-1">
                <BsGem />
              </span>
            </div>
            <div className="uppercase">{type} pool total</div>
          </>
        )}

        {/* transform to bet form buttons if bet button is clicked */}
        {isBetting ? (
          // green over version of transformed betting form buttons
          type === "over" ? (
            <>
              <form className="w-2/3">
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-orange-700 text-white rounded-3xl gap-2 text-center my-1"
                  onClick={handleSubmit}
                >
                  SHIP IT
                </button>
              </form>
              <div className="w-2/3 px-4 py-3 bg-lime-500 text-white rounded-md flex gap-2">
                <button
                  className="w-1/4 border-2 border-black border-solid text-2xl mx-auto"
                  onClick={handleDecrementBet}
                >
                  -
                </button>
                <div onClick={handleCloseBetForm}>
                  {betAmount} <BsGem />
                </div>
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
              <div className="w-2/3 px-4 py-3 bg-red-500 text-white rounded-md flex gap-2">
                <button
                  className="w-1/4 border-2 border-black border-solid text-2xl mx-auto"
                  onClick={handleDecrementBet}
                >
                  -
                </button>
                <div onClick={handleCloseBetForm}>
                  {betAmount} <BsGem />
                </div>
                <button
                  className="w-1/4 border-2 border-black border-solid text-2xl mx-auto"
                  onClick={handleIncrementBet}
                >
                  +
                </button>
              </div>
              <form className="w-2/3">
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-orange-700 text-white rounded-3xl gap-2 text-center my-1"
                  onClick={handleSubmit}
                >
                  SHIP IT
                </button>
              </form>
            </>
          )
        ) : // green over version of default bet button
        type === "over" ? (
          <button className="px-4 py-3 mt-2 bg-lime-500 text-white rounded-md flex gap-2" onClick={handleOpenBetForm}>
            <AiOutlineArrowUp className="relative top-1" />
            Bet the over
            <AiOutlineArrowUp className="relative top-1" />
          </button>
        ) : (
          // red under version of default bet button
          // TODO: put the pot display etc under the button for symmetry. its fkd rn bc of jsx ternary madness
          <button className="px-4 py-3 mt-2 bg-red-500 text-white rounded-md flex gap-2" onClick={handleOpenBetForm}>
            <AiOutlineArrowDown className="relative top-1" />
            Bet the under
            <AiOutlineArrowDown className="relative top-1" />
          </button>
        )}
      </div>

      {/* bet bar selector display */}
      <div
        className="h-5 w-full bg-gray-300 ml-auto flex flex-row align-end"
        onTouchEnd={handleTouchEnd}
        onTouchMove={(e) => handleTouchMove(e, type)}
      >
        {
          // user bet preview bar for under bets
          type === "under" && user && !userBet && (
            <div
              key={"overUserBet"}
              className="w-full border-transparent relative"
              data-name={`${user.firstName} ${user.lastName}`}
              data-amount={betAmount}
              data-type={type}
              style={{
                width: `${(betAmount / poolAmount) * 100}%`, // proportionate width calculated as percentage of total pool
                backgroundColor: "orange", // cycle through colors selected for constrast adjacency
              }}
            ></div>
          )
        }

        {
          // loop out all the bets for the given side of the pool and render them
          bets.map((bet, index) => {
            return (
              // makes a proportionate section of the bar for each bet
              <div
                key={bet.id}
                className="w-full border-transparent relative"
                data-name={`${bet.better.firstName} ${bet.better.lastName}`}
                data-type={type}
                data-amount={user && bet.better.id === user.id ? bet.amount + betAmount : bet.amount} // add user's bet to their existing bet if they have one
                style={{
                  width: `${
                    ((user && bet.better.id === user.id ? bet.amount + betAmount : bet.amount) / poolAmount) * 100
                  }%`, // proportionate width calculated as percentage of total pool
                  backgroundColor: user && bet.better.id === user.id ? "orange" : COLORS[index % COLORS.length], // highlight user's bet || cycle through colors selected for constrast adjacency
                }}
              ></div>
            );
          })
        }
        {/* user bet preview bar for over bets*/}
        {type === "over" && user && !userBet && (
          <div
            key={"underUserBet"}
            className="w-full border-transparent relative"
            data-name={`${user.firstName} ${user.lastName}`}
            data-amount={betAmount}
            data-type={type}
            style={{
              width: `${(betAmount / poolAmount) * 100}%`, // proportionate width calculated as percentage of total pool
              backgroundColor: "orange", // cycle through colors selected for constrast adjacency
            }}
          ></div>
        )}
      </div>
    </div>
  );
};
