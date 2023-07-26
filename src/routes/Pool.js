import React from "react";
import { PoolBets } from "../components/PoolBets.js";
import { useUser } from "@clerk/clerk-react";
import { useLoaderData } from "react-router-dom";

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
  let loggedInUser = null;
  if (user.isLoaded && user.isSignedIn) {
    loggedInUser = user.user;
    loggedInUser.balance = users.filter((user) => user.id === loggedInUser.id)[0].balance;
  }

  return (
    // master screen container
    <div className="h-screen flex flex-col">
      {/* user balance banner */}
      <div className="p-4 text-center bg-gray-700 text-xs">
        {loggedInUser && <div className="text-white">Your funds: {loggedInUser.balance}</div>}
      </div>

      {/* over display component */}
      <PoolBets pool={pool} users={users} type="over" user={loggedInUser} />

      {/* center point display */}
      <div className="h-4 bg-gray-800 text-center flex flex-col items-center justify-center relative">
        <div className="relative rounded-lg flex flex-col">
          {/* point number display TODO: handle various point sizes dynamically */}
          <div className="text-6xl font-light font-display py-2 px-6 bg-white rounded-md my-2">{pool.point}</div>
        </div>
      </div>

      {/* under display component */}
      <PoolBets pool={pool} users={users} type="under" user={loggedInUser} />

      {/* pool desc */}
      <div className="p-4 text-center bg-gray-700 text-xs">
        <div className="text-white">{pool.desc}</div>
      </div>
    </div>
  );
};
