import { useEffect, useState } from "react";

const me = {
  name: "Tebbo",
  id: 2,
};

function App() {
  const [users, setUsers] = useState([]);
  const [pools, setPools] = useState([]);
  const [myBets, setMyBets] = useState([]);

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

  // Fetch all users on first render
  useEffect(() => {
    fetchAllUsers();
    fetchAllPools();
    fetchAllMyBets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { amount, poolID, bet, better } = event.target.elements;

    console.log(amount.value, poolID.value, bet.value, better.value);

    // const response = await fetch(`/api/character/save/${field}`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // });

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

    const json = await response.json();

    fetchAllMyBets();
  };

  return (
    <div className="w-96 mx-auto border-x border-gray-400 min-h-screen">
      <header className="p-4 text-2xl font-bold">Gambol!</header>

      <div class="border-b border-gray-400 p-4">
        <div className="font-bold">All Users</div>
        {users.map((user) => (
          <div key={user.id}>
            {user.id} {user.name} {user.balance}
          </div>
        ))}
      </div>

      <div class="border-b border-gray-400 p-4">
        <div className="font-bold">My Bets</div>
        {myBets.map((bet) => (
          <div key={bet.id}>
            {bet.poolID} {bet.amount} {bet.bet}
          </div>
        ))}
      </div>

      <div class="border-b border-gray-400 p-4">
        <div className="font-bold">All Pools</div>
        {pools.map((pool) => (
          <div key={pool.id}>
            {pool.id} {pool.desc} {pool.point}
            <form onSubmit={handleSubmit} className="mb-8">
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

              <button
                type="submit"
                className="bg-blue-700 rounded-sm px-4 py-2 text-white"
                value="Submit"
              >
                Submit
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
