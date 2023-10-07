import React from "react";
import { PoolBets } from "../components/PoolBets.js";
import { useUser } from "@clerk/clerk-react";
import { Link, useLoaderData } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";

export const poolLoader = async ({ params }) => {
  const [users, pool] = await Promise.all([
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/users`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/pools/${params.poolId}`).then((res) => res.json()),
  ]).catch((error) => {
    console.error(error);
  });

  return { users, pool };
};

export const Pool = () => {
  const { users, pool } = useLoaderData();

  const user = useUser();

  // if logged in, store logged in user in variable and add balance to it
  //  [solved?]TODO: deal with clerk webhook delay bug (user is not in users list yet)
  let loggedInUser = null;
  if (user.isLoaded && user.isSignedIn) {
    loggedInUser = user.user;
    loggedInUser.id = loggedInUser.primaryEmailAddressId;
    loggedInUser.balance = users.filter((user) => user.id === loggedInUser.id)[0].balance;
  }

  return (
    // master screen container
    <div className="h-screen flex flex-col">
      {/* user balance banner */}
      <div className="p-4 bg-gray-700 text-xs flex align-center justify-between text-white">
        <Link to="/" className="font-bold flex align-center">
          <FiChevronLeft className="text-lg mr-2" /> Back to all pools
        </Link>
        {loggedInUser && <div>Your funds: {loggedInUser.balance}</div>}
      </div>

      {/* over display component */}
      <PoolBets pool={pool} users={users} type="over" user={loggedInUser} />

      {/* center point display */}
      <div className="h-1 bg-gray-800 text-center flex flex-col items-center justify-center relative">
        <div className="relative rounded-lg flex flex-col justify-center items-center">
          {/* point number display TODO: handle various point sizes dynamically */}
          <div className="max-w-[80%] py-2 px-6 bg-white rounded-md my-2">
            <div className="text-6xl font-light font-display mb-2">{pool.point}</div>
            <div
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {pool.desc} greet thanks that asthta hawssen alsdke asd asd asd asd asd asd asd asd asd asd asd asd asd
            </div>
          </div>
        </div>
      </div>

      {/* under display component */}
      <PoolBets pool={pool} users={users} type="under" user={loggedInUser} />
    </div>
  );
};
