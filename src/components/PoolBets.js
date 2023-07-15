import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

// auth spoof placeholder
const me = {
  name: "Tebbo",
  id: 1234,
};

// color wheel selected for contrast

const OVER_COLORS = ["#4d7c0f", "#84cc16", "#bef264", "#84cc16", "#4d7c0f", "#365314"];

const UNDER_COLORS = ["#b91c1c", "#ef4444", "#fca5a5", "#ef4444", "#b91c1c", "#7f1d1d"];

export const PoolBets = (props) => {
  const { pool, users, type, bets } = props;

  const COLORS = type === "over" ? OVER_COLORS : UNDER_COLORS;

  // check if pool is over or under
  let poolAmount = 0;
  if (type === "over") {
    poolAmount = pool.overPool;
  } else {
    poolAmount = pool.underPool;
  }

  // set state using hooks
  const [balance, setBalance] = useState([]);
  const [centerDisplayNumber, setCenterDisplayNumber] = useState(`Total of ${type} bets`);
  const [centerDisplayLabel, setCenterDisplayLabel] = useState(poolAmount);
  const user = useUser();

  const fetchBalance = async () => {
    // api call
    const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/users/${me.id}`);
    // response check
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const json = await response.json();
      // set balance to state var
      setBalance(json.balance);
    }
  };

  // display bet info on hover
  const handleTouchMove = (e) => {
    const element = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);

    if (!element) return;
    if (element.dataset.type !== type) return;

    // const user = users.filter((user) => user.id === bet.betterID)[0];

    setCenterDisplayLabel(element.dataset.name);
    setCenterDisplayNumber(element.dataset.amount);
  };

  // reset display to default on mouse leave
  const handleTouchEnd = (e) => {
    setCenterDisplayLabel(`Total of ${type} bets`);
    setCenterDisplayNumber(poolAmount);
  };

  // fetch bets and balance on first render
  useEffect(() => {
    // fetchBalance();
  }, []);

  return (
    <div className={`h-1/2 touch-none	flex ${type === "over" ? "bg-lime-100" : "bg-red-100"}`}>
      {/* center display that will show total by default and show individual bets on hover over the bar segments */}
      <div className="text-black text-center h-full grow flex flex-col items-center justify-center">
        {type === "over" ? (
          <>
            {/* bet over button */}
            <div className="text-3xl font-display font-light">{centerDisplayLabel}</div>
            <div>{centerDisplayNumber}</div>
          </>
        ) : (
          <>
            {/* bet under button */}
            <div>{centerDisplayNumber}</div>
            <div className="text-4xl font-display font-light">{centerDisplayLabel}</div>
          </>
        )}
      </div>

      {/* bet bar selector display */}
      <div
        className="w-4 h-full bg-gray-300 ml-auto flex flex-col align-end"
        onTouchEnd={handleTouchEnd}
        onTouchMove={(e) => handleTouchMove(e, type)}
      >
        {/* loop out all the bets for the given side of the pool */}
        {bets.map((bet, index) => {
          return (
            // makes a proportionate section of the bar for each bet
            <div
              key={bet.id}
              className="w-full border-transparent relative"
              data-name={bet.betterID}
              data-amount={bet.amount}
              data-type={type}
              style={{
                height: `${(bet.amount / poolAmount) * 100}%`, // proportionate height calculated as percentage of total pool
                backgroundColor: COLORS[index % COLORS.length], // cycle through colors selected for constrast adjacency
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
