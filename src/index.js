import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from "@clerk/clerk-react";

import { AppWrapper } from "./components/AppWrapper";
import { Dashboard, dashboardLoader } from "./routes/Dashboard";
import { Pool, poolLoader } from "./routes/Pool";
import { Leaderboard, leaderboardLoader } from "./routes/Leaderboard";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

if (!process.env.REACT_APP_API_SERVER_URL) {
  throw new Error("Missing API Server URL");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    loader: dashboardLoader,
  },
  {
    path: "/sign-in/*",
    element: <SignIn routing="path" path="/sign-in" />,
  },
  {
    path: "/sign-up/*",
    element: <SignUp routing="path" path="/sign-up" />,
  },
  {
    path: "/pool/:poolId",
    element: <Pool />,
    loader: poolLoader,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
    loader: leaderboardLoader,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppWrapper>
        <RouterProvider router={router} />
      </AppWrapper>
    </ClerkProvider>
  </React.StrictMode>
);
