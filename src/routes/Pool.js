import React, { useState, useEffect } from "react";
import { PoolBets } from "../components/PoolBets.js";

import { useLoaderData } from "react-router-dom";

const me = {
  name: "Tebbo",
  id: 2,
};

export const poolLoader = async ({ params }) => {
  const [users, pool, bets] = await Promise.all([
    fetch(`http://localhost:8080/users`).then((res) => res.json()),
    fetch(`http://localhost:8080/pools/${params.poolId}`).then((res) => res.json()),
    fetch(`http://localhost:8080/pools/${params.poolId}/bets`).then((res) => res.json()),
  ]);

  console.log(users, pool, bets);

  return { users, pool, bets };
};

export const Pool = () => {
  const { users, pool, bets } = useLoaderData();

  return (
    <div className="h-screen flex flex-col">
      {/* over display component */}
      <PoolBets pool={pool} users={users} type="over" bets={bets} />

      {/* point container in center */}
      <div className="h-1/3 bg-gray-400 text-center flex flex-col justify-center">
        {/* bet over button */}
        <button className="bg-blue-500 text-white rounded-md w-32 h-16 mx-auto m-2">OVER</button>

        {/* display point */}
        <div className="text-gray-50">{pool.desc}</div>

        {/* TODO: handle various point sizes dynamically */}
        <div className="text-8xl text-green-700 font-bold">{pool.point}</div>

        {/* bet under button */}
        <button className="bg-red-500 text-white rounded-md w-32 h-16 mx-auto m-2">UNDER</button>
      </div>

      {/* under display component */}
      <PoolBets pool={pool} users={users} type="under" bets={bets} />
    </div>
  );
};
