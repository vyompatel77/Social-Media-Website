import React, { createContext, useContext, useEffect, useReducer } from "react";
import NavBar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/screens/Home";
import Signup from "./components/screens/Signup";
import Signin from "./components/screens/signin";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import { initialState, reducer } from "./reducer/UserReducer";
import UserProfile from "./components/screens/UserProfile";
import MyFollowingPosts from "./components/screens/myfollowingpost";
import Reset from "./components/screens/Reset";
import NewPassword from "./components/screens/NewPasword";

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if(!window.location.pathname.startsWith("/reset"))
          navigate("/signin");
    }
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/CreatePost" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/followingPosts" element={<MyFollowingPosts />} />
      <Route path="/reset" element={<Reset />} />
      <Route exact path="/reset/:token" element={<NewPassword/>} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
