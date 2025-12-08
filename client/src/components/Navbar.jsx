import { LogOut, MessageSquareDot, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.js";
import { Link } from "react-router-dom";
const Navbar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (<>
    <header className="fixed top-0 left-0 w-full bg-white backdrop-blur-lg border  border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={"/"} className="flex item-center gap-2.5 hover:opacity-75 transition">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquareDot className="w-5 h-5 text-blue-500" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">hiapp</h1>
          </Link>
          {/* Right Actions  */}

        </div>
        <div className="flex items-center gap-3">
          {authUser && (
            <>
              <Link to={"/profile"} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition">
                <User className="w-5 h-6" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 transition">
                <LogOut className="w-5 h-6" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  </>);
};

export default Navbar;
