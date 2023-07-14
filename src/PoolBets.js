import React, { useState, useEffect } from "react";

// auth spoof placeholder
const me = {
  name: "Tebbo",
  id: 2,
};

// color wheel selected for contrast
const COLORS = [
  /* red */ "#dc2626",
  /* green */ "#65a30d",
  /* orange */ "#ea580c",
  /* blue */ "#0284c7",
  /* yellow */ "#facc15",
  /* purple */ "#7c3aed",
];

export const PoolBets = (props) => {
  const { pool, users, type } = props;

  // check if pool is over or under
  let poolAmount = 0;
  if (type === "over") {
    poolAmount = pool.overPool;
  } else {
    poolAmount = pool.underPool;
  }

  // set state using hooks
  const [bets, setBets] = useState([]);
  const [balance, setBalance] = useState([]);
  const [centerDisplayNumber, setCenterDisplayNumber] = useState(`Total ${type}`);
  const [centerDisplayLabel, setCenterDisplayLabel] = useState(poolAmount);

  const fetchBets = async () => {
    // api call
    const response = await fetch(`http://localhost:8080/pools/${pool.id}/bets`);
    // check response
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const json = await response.json();
      // take only the bets from the side of the pool we want
      const bets = json.filter((bet) => bet.bet === type.toUpperCase());
      // set it to state var
      setBets(bets);
    }
  };

  const fetchBalance = async () => {
    // api call
    const response = await fetch(`http://localhost:8080/users/${me.id}`);
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
  const handleMouseEnter = (e, bet) => {
    // find user's name from id
    const user = users.filter((user) => user.id === bet.betterID)[0];
    // set display to user's name and bet amount
    setCenterDisplayLabel(user.name);
    setCenterDisplayNumber(bet.amount);
  };

  // reset display to default on mouse leave
  const handleMouseLeave = (e) => {
    setCenterDisplayLabel(`Total ${type}`);
    setCenterDisplayNumber(poolAmount);
  };

  // fetch bets and balance on first render
  useEffect(() => {
    fetchBets();
    fetchBalance();
  }, []);

  return (
    <div className="h-1/3 bg-gray-200 flex">
      {/* center display that will show total by default and show individual bets on hover over the bar segments */}
      <div className="text-black text-center h-full grow flex flex-col items-center justify-center">
        <div>{centerDisplayLabel}</div>
        <div className="text-3xl">{centerDisplayNumber}</div>
      </div>

      {/* bet bar selector display */}
      <div className="w-10 h-full bg-gray-300 ml-auto">
        {/* loop out all the bets for the given side of the pool */}
        {bets.map((bet, index) => {
          return (
            <div
              onMouseEnter={(e) => handleMouseEnter(e, bet)}
              onMouseLeave={(e) => handleMouseLeave(e)}
              key={bet.id}
              className="w-full"
              style={{
                height: `${(bet.amount / poolAmount) * 100}%`, // show bets proportional to the total pool amount
                backgroundColor: COLORS[index % COLORS.length], // cycle through colors selected for constrast adjaceny
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};