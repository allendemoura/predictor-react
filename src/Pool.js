import React, { useState, useEffect } from "react";
import { PoolBets } from "./PoolBets.js";

const me = {
  name: "Tebbo",
  id: 2,
};

export const Pool = (props) => {
  const { pool, users } = props;

  return (
    <div className="h-screen flex flex-col">
      {/* over display component */}
      <PoolBets pool={pool} users={users} type="over" />

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
      <PoolBets pool={pool} users={users} type="under" />
    </div>
  );
};
