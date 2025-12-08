import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setOnlineUsers, logout } from "./store/slices/authSlice.js";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "./lib/socket";
import { axiosInstance } from "./lib/axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Profile from "./pages/Profile.jsx"
import { ToastContainer } from "react-toastify";

const App = () => {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          dispatch(logout());
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [dispatch]);

  useEffect(() => {
    if (authUser) {
      const socket = connectSocket(authUser._id);

      socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users))
      })
      return () => disconnectSocket();
    }

  }, [authUser]);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex item-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
          <Route path="/register" element={!authUser ? <Register /> : <Navigate to={"/"} />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to={"/"} />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to={"/Login"} />} />
        </Routes>
        <ToastContainer />
      </Router>
    </div>
  );
};

export default App;
