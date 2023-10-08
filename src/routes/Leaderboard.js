import { useLoaderData } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Header } from "../components/Header";
import { BsGem } from "react-icons/bs";

export const leaderboardLoader = async ({ params }) => {
  const [users, pools, bets] = await Promise.all([
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/users`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/pools/active`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/bets`).then((res) => res.json()),
  ]);

  // sort users by balance
  users.sort((a, b) => b.balance - a.balance);

  return { users, pools, bets };
};

export function Leaderboard() {
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

  /* TODO: fix refresh issue when creating account in (user not shown before manual refresh) 
      EDIT: may not need to do this because they wont be on the leaderboard anyway */

  return (
    <>
      <Header />
      {/* leaderboard */}
      {currentUser.isLoaded && (
        <div className="border-b border-gray-400">
          <div className="font-bold p-2 my-2 flex justify-between border-b border-gray-400">
            <div>Leaderboard</div>
            <div>
              <BsGem />
            </div>
          </div>

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
                <div>{user.balance}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
      {/* list of active bets */}
      {/* {currentUser.isLoaded && currentUser.isSignedIn && (
        <div className="border-b border-gray-400 p-4">
          <div className="font-bold">Your Active Bets</div>
          {activeBets.map &&
            activeBets.map((bet) => (
              <div key={bet.id}>
                {bet.pool.desc} {bet.bet} {bet.amount}
              </div>
            ))}
        </div>
      )} */}

      {/* history of closed bets */}
      {/* {currentUser.isLoaded && currentUser.isSignedIn && (
        <div className="border-b border-gray-400 p-4">
          <div className="font-bold">Your Closed Bets (History)</div>
          {closedBets.map &&
            closedBets.map((bet) => (
              <div key={bet.id}>
                {bet.pool.desc} {bet.bet === bet.pool.result ? "WON" : "LOST"} {bet.amount}
              </div>
            ))}
        </div>
      )} */}
    </>
  );
}
