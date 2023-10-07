import { useLoaderData } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { BsGem } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

// React Icons
// https://react-icons.github.io/react-icons/search?q=star

// TODO: move leaderboard to separate page
// trophy icon in header that links to leaderboard page
// homepage just list
// black bar total %
// star indicator for your bets
// gray out bet opposite bet button when you have a bet
// implement the profile page info integrated into the dashboard list

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
      <div className="flex justify-between items-center p-4 bg-slate-800 text-white">
        <header className="text-2xl font-bold">Gambol!</header>
        <UserButton />
      </div>

      {loggedInUser === null && <a href="/sign-in">Sign In</a>}

      {/* TODO: User Profile - betting record, wonBets, netWinnings, etc */}

      {/* TODO: fix refresh issue when creating account in (user not shown before manual refresh) 
      EDIT: may not need to do this because they wont be on the leaderboard anyway */}
      {/* user list */}
      {currentUser.isLoaded && (
        <div className="border-b border-gray-400">
          <div className="font-bold p-4">Net Winnings Leaderboard</div>
          <ol className="list-decimal">
            {users.map((user) => (
              <li
                key={user.id}
                className={`flex justify-between py-1 px-4 ${
                  loggedInUser && user.id === loggedInUser.id ? "font-bold bg-orange-300" : ""
                }`}
              >
                <div>
                  {user.firstName} {user.lastName}
                </div>
                <div>{user.balance - 50}</div>
              </li>
            ))}
          </ol>
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
      <div className="border-b border-gray-400">
        <div className="font-bold p-4">Active Betting Pools</div>
        {pools.map((pool, i) => {
          const percent =
            pool.overPool && pool.underPool ? (pool.overPool / (pool.overPool + pool.underPool)) * 100 : 50;
          const isYourBet = i == 2 ? true : false;
          const total = 50;
          const totalPercent = ((pool.overPool + pool.underPool) / total) * 100;

          return (
            <a
              href={`/pool/${pool.id}`}
              key={pool.id}
              className={`block`}
              style={{
                backgroundImage: `linear-gradient(to right, #d9f99d ${percent - 7}%, #fecaca ${percent + 7}%)`,
              }}
            >
              <div className="border-t border-black/30 p-4 flex items-center justify-between group gap-4" key={pool.id}>
                <div className="flex-grow">
                  <div className="text-xl font-bold flex gap-2 items-center">
                    {pool.point}{" "}
                    {isYourBet ? <AiFillStar className="text-black/60" /> : <AiOutlineStar className="text-black/60" />}
                  </div>
                  <div>
                    <div className="h-1 my-1.5 bg-black/30 rounded-md" style={{ width: `${totalPercent}%` }}></div>
                  </div>
                  <div className="text-sm">{pool.desc}</div>
                </div>
                <FiChevronRight className="text-2xl text-black/50 transition-all group-active:translate-x-2" />
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
