import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { BsTrophyFill } from "react-icons/bs";
import { UserButton } from "@clerk/clerk-react";

export function Header() {
  // clerk checks
  const currentUser = useUser();
  let loggedInUser = null;
  if (currentUser.isLoaded && currentUser.isSignedIn) {
    loggedInUser = currentUser.user;
    loggedInUser.id = loggedInUser.primaryEmailAddressId;
  }
  return (
    <div className="flex justify-between items-center p-4 bg-slate-800 text-white">
      {/* title and home link */}
      <Link to="/">
        <header className="text-2xl font-bold">Gambol!</header>
      </Link>
      {/* leaderboard icon link */}
      <Link to="/leaderboard">
        <BsTrophyFill />
      </Link>
      {/* user/signin corner */}
      {loggedInUser === null ? <a href="/sign-in">Sign In</a> : <UserButton />}
    </div>
  );
}
