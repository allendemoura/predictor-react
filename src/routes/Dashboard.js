import { useLoaderData } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

//  auth spoof placeholder
const me = {
  firstName: "Tebbo",
  lastName: "the dark lord",
  id: "darkness",
};

export const dashboardLoader = async ({ params }) => {
  const [users, pools, myBets] = await Promise.all([
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/users`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/pools/active`).then((res) => res.json()),
    // TODO: use real auth instead of spoof for this (need global state?)
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/users/${me.id}/bets`).then((res) => res.json()),
  ]);

  // sort users by balance
  users.sort((a, b) => b.balance - a.balance);

  return { users, pools, myBets };
};

export function Dashboard() {
  const { users, pools, myBets } = useLoaderData();

  const currentUser = useUser();

  // if logged in, store logged in user in variable and add balance to it
  let loggedInUser = null;
  if (currentUser.isLoaded && currentUser.isSignedIn) {
    loggedInUser = users.filter((user) => user.id === currentUser.id)[0];
  }

  // html to be rendered in browser
  return (
    // mobile optimized tailwind css
    <>
      <header className="p-4 text-2xl font-bold">Gambol!</header>

      <UserButton />
      {loggedInUser === null && <a href="/sign-in">Sign In</a>}

      {/* TODO: fix refresh issue when logging in (user not shown before manual refresh) */}
      {/* user list */}
      <div className="border-b border-gray-400 p-4">
        <div className="font-bold">Leaderboard</div>
        {
          // loop through users and render them
          users.map((user) => (
            <div key={user.id}>
              {user.firstName} {user.lastName}: {user.balance}
            </div>
          ))
        }
      </div>

      {/* list of my bets TODO: change this to active bets*/}
      <div className="border-b border-gray-400 p-4">
        <div className="font-bold">My Bets</div>
        {
          // loop through bets and render them
          myBets.map &&
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
              <a href={`/pool/${pool.id}`} className="underline text-blue-400" key={pool.id}>
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
              </a>
            </div>
          ))
        }
      </div>
    </>
  );
}
