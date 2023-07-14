import { useEffect, useState } from "react";

import { Pool } from "./Pool.js";

const me = {
  name: "Tebbo",
  id: 2,
};

export default function App() {
  // init state using hooks
  const [users, setUsers] = useState([]);
  const [pools, setPools] = useState([]);
  const [myBets, setMyBets] = useState([]);

  // def functions to fetch data
  const fetchAllUsers = async () => {
    const response = await fetch("http://localhost:8080/users");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const json = await response.json();
      setUsers(json);
    }
  };

  const fetchAllPools = async () => {
    const response = await fetch("http://localhost:8080/pools/active");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const json = await response.json();

      setPools(json);
    }
  };

  const fetchAllMyBets = async () => {
    const response = await fetch(`http://localhost:8080/users/${me.id}/bets`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const json = await response.json();
      setMyBets(json);
    }
  };

  // Fetch everything on first render
  useEffect(() => {
    fetchAllUsers();
    fetchAllPools();
    fetchAllMyBets();
  }, []);

  // function to submit bet from to backend form info
  const handleSubmit = async (event) => {
    // prevent default form behaviour (refresh page)
    event.preventDefault();

    // unpack form data
    const { amount, poolID, bet, better } = event.target.elements;

    // send bet to backend
    const response = await fetch("http://localhost:8080/bets", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        amount: parseInt(amount.value),
        poolID: parseInt(poolID.value),
        bet: bet.value,
        better: better.value,
      }),
    });

    // check response
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const json = await response.json();

      // TODO: update user balance and pool amount on frontend for UI snappiness

      // refresh bet data
      fetchAllMyBets();
    }
  };

  // html to be rendered in browser
  return (
    // mobile optimized tailwind css
    <div className="w-96 mx-auto border-x border-gray-400 min-h-screen">
      <header className="p-4 text-2xl font-bold">Gambol!</header>

      {/* user list */}
      <div className="border-b border-gray-400 p-4">
        <div className="font-bold">All Users</div>
        {
          // loop through users and render them
          users.map((user) => (
            <div key={user.id}>
              {user.name} {user.balance}
            </div>
          ))
        }
      </div>

      {/* list of my bets TODO: change this to active bets*/}
      <div className="border-b border-gray-400 p-4">
        <div className="font-bold">My Bets</div>
        {
          // loop through bets and render them
          myBets.map((bet) => (
            <div key={bet.id}>
              {bet.poolID} {bet.amount} {bet.bet}
            </div>
          ))
        }
      </div>

      {/* list of all active pools */}
      <div className="border-b border-gray-400 p-4">
        <div className="font-bold">All Pools</div>
        {
          // loop through pools and render them
          pools.map((pool) => (
            <div key={pool.id}>
              {pool.desc} <b>{pool.point}</b> Under: {pool.underPool} Over: {pool.overPool}
              {/* generate form for betting on each pool */}
              {/* <form onSubmit={handleSubmit} className="mb-8">
                <div className="border-b border-gray-400 mb-2">
                  <input type="number" name="amount" placeholder="Amount" />
                </div>

                <div className="border-b border-gray-400 mb-2">
                  <select name="bet">
                    <option value="OVER">Over</option>
                    <option value="UNDER">Under</option>
                  </select>
                </div>

                <input type="hidden" name="poolID" value={pool.id} />
                <input type="hidden" name="better" value={me.name} />

                <button type="submit" className="bg-blue-700 rounded-sm px-4 py-2 text-white" value="Submit">
                  Submit
                </button>
              </form> */}
            </div>
          ))
        }
      </div>

      {/* preview Pool component */}
      {pools[0] && <Pool pool={pools[0]} users={users} />}
    </div>
  );
}
