import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AppWrapper } from "./components/AppWrapper";
import { Dashboard, dashboardLoader } from "./routes/Dashboard";
import { Pool, poolLoader } from "./routes/Pool";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    loader: dashboardLoader,
  },
  {
    path: "/pool/:poolId",
    element: <Pool />,
    loader: poolLoader,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppWrapper>
    <RouterProvider router={router} />
  </AppWrapper>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);
