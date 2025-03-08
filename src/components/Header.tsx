import { Link } from "react-router-dom";
import { useToast } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useToast();

  return (
    <div className="bg-orange-600 py-6 px-6">
      <div className="container mx-auto flex justify-between max-w-7xl">
        <span className="text-3xl text-white font-bold">
          <Link to="/">SunsetView.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className="flex items-center text-white px-4 font-bold hover:bg-orange-500 hover:text-white rounded-[20px]"
              >
                My Bookings
              </Link>
              <Link
                to="/my-hotels"
                className="flex items-center text-white px-4 font-bold hover:bg-orange-500 hover:text-white rounded-[20px]"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-orange-600 px-4 font-bold hover:bg-orange-500 hover:text-white rounded-[20px]"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
