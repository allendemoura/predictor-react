import { Link, useLoaderData } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { BsGem, BsFillCheckCircleFill } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { AiFillStar, AiOutlineStar, AiFillCloseSquare } from "react-icons/ai";
import { Header } from "../components/Header";

// React Icons
// https://react-icons.github.io/react-icons/search?q=star

// TODO: gray out bet opposite bet button when you have a bet
// User Profile - betting record, wonBets, netWinnings, etc

// TODO: look into global state for logged in user?

export const dashboardLoader = async ({ params }) => {
  const [users, pools, bets] = await Promise.all([
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/users`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/pools`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/bets`).then((res) => res.json()),
  ]);

  // sort users by balance
  users.sort((a, b) => b.balance - a.balance);

  return { users, pools, bets };
};

export function Dashboard() {
  const { users, pools, bets } = useLoaderData();

  const activePools = pools.filter((pool) => pool.result === "PENDING");
  const closedPools = pools.filter((pool) => pool.result !== "PENDING");
  // all gems in play on pools for black bar percentage
  const activeTotal = activePools.reduce((acc, pool) => acc + pool.overPool + pool.underPool, 0);
  const closedTotal = closedPools.reduce((acc, pool) => acc + pool.overPool + pool.underPool, 0);

  const currentUser = useUser();
  // if logged in, store logged in user in variable
  let loggedInUser = null;
  if (currentUser.isLoaded && currentUser.isSignedIn) {
    loggedInUser = currentUser.user;
    loggedInUser.id = loggedInUser.primaryEmailAddressId;
  }

  return (
    <>
      <Header />
      {/* list of all active pools */}
      <div className="border-b border-gray-400">
        {/* <div className="font-bold p-4">Active Betting Pools</div> */}
        {activePools.map((pool, i) => {
          // ratio of over to under bets for color gradient background
          const percent =
            pool.overPool && pool.underPool ? (pool.overPool / (pool.overPool + pool.underPool)) * 100 : 50;
          // determine if you have a bet in this pool
          const isYourBet =
            loggedInUser === null ? false : pool.bets.filter((bet) => bet.better.id === loggedInUser.id).length > 0;
          // if so, what was your bet and amount
          const yourBet = isYourBet ? pool.bets.filter((bet) => bet.better.id === loggedInUser.id)[0].bet : null;
          const betAmount = isYourBet ? pool.bets.filter((bet) => bet.better.id === loggedInUser.id)[0].amount : null;
          // percentage of total bets for black bar length
          const totalPercent = ((pool.overPool + pool.underPool) / activeTotal) * 100;

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
                    {isYourBet ? (
                      <>
                        <AiFillStar className="text-black/60" />
                        <div className="text-sm font-light">{" " + yourBet + " " + betAmount}</div>
                      </>
                    ) : (
                      <AiOutlineStar className="text-black/60" />
                    )}
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
      {/* list of all closed pools */}
      <div className="border-b border-gray-400">
        {/* <div className="font-bold p-4">Closed Betting Pools</div> */}
        {closedPools.map((pool, i) => {
          // ratio of over to under bets for color gradient background
          const percent =
            pool.overPool && pool.underPool ? (pool.overPool / (pool.overPool + pool.underPool)) * 100 : 50;
          // determine if you have a bet in this pool
          const isYourBet =
            loggedInUser === null ? false : pool.bets.filter((bet) => bet.better.id === loggedInUser.id).length > 0;
          // what was your bet
          const yourBet = isYourBet ? pool.bets.filter((bet) => bet.better.id === loggedInUser.id)[0].bet : null;
          // did you win?
          const isWinner = isYourBet
            ? pool.result === pool.bets.filter((bet) => bet.better.id === loggedInUser.id)[0].bet
            : false;
          // find your bet amount
          const betAmount = isYourBet ? pool.bets.filter((bet) => bet.better.id === loggedInUser.id)[0].amount : null;
          // find your winnings. TODO: not sure if this is exactly right, would be better to get this info from back end
          const winnings =
            betAmount && isWinner
              ? yourBet === "over"
                ? Math.round((betAmount / pool.overPool) * pool.underPool - betAmount)
                : Math.round((betAmount / pool.underPool) * pool.overPool - betAmount)
              : null;
          // percentage of total bets for black bar length
          const totalPercent = ((pool.overPool + pool.underPool) / closedTotal) * 100;

          return (
            <a
              href={`/pool/${pool.id}`}
              key={pool.id}
              className={`block`}
              style={{
                backgroundImage: `linear-gradient(to right, #f7fee7 ${percent - 7}%, #fef2f2 ${percent + 7}%)`,
              }}
            >
              <div className="border-t border-black/30 p-4 flex items-center justify-between group gap-4" key={pool.id}>
                <div className="flex-grow">
                  <div className="text-xl font-bold flex gap-2 items-center">
                    {pool.result + " "}
                    {pool.point}{" "}
                    {isYourBet ? (
                      isWinner ? (
                        <>
                          <BsFillCheckCircleFill className="text-black/60" />
                          {" +" + winnings}
                        </>
                      ) : (
                        <>
                          <AiFillCloseSquare className="text-black/60" />
                          {" -" + betAmount}
                        </>
                      )
                    ) : (
                      <AiOutlineStar className="text-black/60" />
                    )}
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
