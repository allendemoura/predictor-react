import React, { useState, useEffect } from "react";
import { PoolBets } from "../components/PoolBets.js";

import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";

import { useLoaderData, useNavigate } from "react-router-dom";

const me = {
  name: "Tebbo",
  id: 2,
};

export const poolLoader = async ({ params }) => {
  const [users, pool, bets] = await Promise.all([
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/users`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/pools/${params.poolId}`).then((res) => res.json()),
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/pools/${params.poolId}/bets`).then((res) => res.json()),
  ]).catch((error) => {
    console.error(error);
  });

  return { users, pool, bets };
};

export const Pool = () => {
  const { users, pool, bets } = useLoaderData();

  const navigate = useNavigate();
  const { userId } = useAuth();

  const underBets = bets.filter((bet) => bet.bet === "UNDER");
  const overBets = bets.filter((bet) => bet.bet === "OVER");

  return (
    <div className="h-screen flex flex-col">
      <div class="p-4 text-center bg-gray-700 text-xs">
        {/* display point */}
        <div className="text-white">{pool.desc}</div>
      </div>
      {/* over display component */}
      <PoolBets pool={pool} users={users} type="over" bets={overBets} />

      {/* point container in center */}
      <div className="h-4 bg-gray-800 text-center flex flex-col items-center justify-center relative">
        {/* TODO: handle various point sizes dynamically */}
        <div class="relative rounded-lg flex flex-col">
          <button className="w-full px-4 py-3 bg-lime-500 text-white rounded-md flex gap-2">
            <AiOutlineArrowUp className="relative top-1" />
            Bet the over
            <AiOutlineArrowUp className="relative top-1" />
          </button>
          <div className="text-6xl font-light font-display py-2 px-6 bg-white rounded-md my-2">{pool.point}</div>
          <button className="w-full px-4 py-3 bg-red-500 text-white rounded-md flex gap-2">
            <AiOutlineArrowDown className="relative top-1" />
            Bet the under
            <AiOutlineArrowDown className="relative top-1" />
          </button>
        </div>
      </div>

      {/* under display component */}
      <PoolBets pool={pool} users={users} type="under" bets={underBets} />
    </div>
  );
};
