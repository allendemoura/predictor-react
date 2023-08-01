import { useLoaderData } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

// TODO: look into global state for logged in user?

export const dashboardLoader = async ({ params }) => {
  const [users, pools, bets] = await Promise.all([
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/users`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/pools/active`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/bets`).then((res) => res.json()),
  ]);

  // sort users by balance
  users.sort((a, b) => b.balance - a.balance);

  return { users, pools, bets };
};

export function Dashboard() {
  const { users, pools, bets } = useLoaderData();

  const currentUser = useUser();
  // if logged in, store logged in user in variable and find their bets
  let loggedInUser = null;
  let myBets = null;
  let activeBets = null;
  let closedBets = null;
  let wonBets = null;
  let netWinnings = null;
  if (currentUser.isLoaded && currentUser.isSignedIn) {
    loggedInUser = currentUser.user;
    loggedInUser.id = loggedInUser.primaryEmailAddressId;
    myBets = bets.filter((bet) => bet.better.id === loggedInUser.id);
    activeBets = myBets.filter((bet) => bet.pool.result === "PENDING");
    closedBets = myBets.filter((bet) => bet.pool.result !== "PENDING");
    // TODO: use this data for leaderboards
    wonBets = closedBets.filter((bet) => bet.pool.result === bet.bet);
    netWinnings = wonBets.reduce((acc, bet) => acc + bet.amount, 0);
  }

  return (
    <>
      <header className="p-4 text-2xl font-bold">Gambol!</header>

      <UserButton />
      {loggedInUser === null && <a href="/sign-in">Sign In</a>}

      {/* TODO: fix refresh issue when creating account in (user not shown before manual refresh) 
      EDIT: may not need to do this because they wont be on the leaderboard anyway */}
      {/* user list */}
      {currentUser.isLoaded && (
        <div className="border-b border-gray-400 p-4">
          <div className="font-bold">Net Winnings Leaderboard</div>
          {users.map((user) => (
            <div key={user.id} className={loggedInUser && user.id === loggedInUser.id ? "bg-orange-300" : ""}>
              {user.firstName} {user.lastName}: {user.balance - 50}
            </div>
          ))}
        </div>
      )}

      {/* list of active bets */}
      {currentUser.isLoaded && currentUser.isSignedIn && (
        <div className="border-b border-gray-400 p-4">
          <div className="font-bold">Your Active Bets</div>
          {activeBets.map &&
            activeBets.map((bet) => (
              <div key={bet.id}>
                {bet.pool.desc} {bet.bet} {bet.amount}
              </div>
            ))}
        </div>
      )}

      {/* history of closed bets */}
      {currentUser.isLoaded && currentUser.isSignedIn && (
        <div className="border-b border-gray-400 p-4">
          <div className="font-bold">Your Closed Bets (History)</div>
          {closedBets.map &&
            closedBets.map((bet) => (
              <div key={bet.id}>
                {bet.pool.desc} {bet.bet === bet.pool.result ? "WON" : "LOST"} {bet.amount}
              </div>
            ))}
        </div>
      )}

      {/* list of all active pools */}
      <div className="border-b border-gray-400 p-4">
        <div className="font-bold">Active Pools</div>
        {pools.map((pool) => (
          <div key={pool.id}>
            <a href={`/pool/${pool.id}`} className="underline text-blue-400" key={pool.id}>
              {pool.desc} <b>{pool.point}</b> Under: {pool.underPool} Over: {pool.overPool}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
