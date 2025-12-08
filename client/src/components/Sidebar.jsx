import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { User } from "lucide-react";
import { getUsers, setSelectedUser } from "../store/slices/chatSlice";

const Sidebar = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { users, selectedUser, isUserLoading } = useSelector((state) => state.chat);

  const { onlineUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const filteredUsers = showOnlineOnly
    ? (users || []).filter((user) => (onlineUsers || []).includes(user._id))
    : (users || []);

  const onlineUsersCount = (users || []).filter((user) => (onlineUsers || []).includes(user._id)).length;

  console.log(filteredUsers, "filtered users")
  if (isUserLoading) return <SidebarSkeleton />

  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-200 bg-white">
        {/* header  */}
        <div className="border-b border-gray-200 2-full p-5">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-gray-700" />
            <span className="font-medium hidden lg:block text-gray-800">
              Contacts
            </span>
          </div>
          {/* online only filte  */}
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-700 ">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="w-4 h-4 border-gray-700 text-blue-600 focus:ring-blue-600 rounded-sm" />
              Show Online Only
            </label>
            <span className="text-xs text-gray-500">({onlineUsersCount} online)</span>
          </div>
        </div>
        {/* Users list  */}
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.length > 0 &&
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className={`w-full p-3 flex items-center gap-3 transition-colors rounded-md ${selectedUser?._id === user._id ? "bg-gray-200 ring-gray-200" : "hover:bg-gray-200"}`}
              >
                {/* avatar  */}

                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user?.avatar?.url || "/avatar-holder.avif"}
                    alt={"avatar"}
                    className="w-12 h-12 rounded-full"
                  />
                  {(onlineUsers || []).includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div>
                  {/* user info  */}
                  <div className="hidden lg:block text-left min-w-0 ">
                    <div className="font-medium text-gray-800 truncate">{user.name}</div>


                  </div>
                  <div className="text-sm text-gray-500">

                    {(onlineUsers || []).includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))
          }
          {filteredUsers.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No Online User
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
