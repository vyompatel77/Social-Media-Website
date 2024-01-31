import React, { useContext, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { useRef } from "react";
import M from "materialize-css";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUseretails] = useState([]);
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          {" "}
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/CreatePost">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/followingPosts">My Following Posts</Link>
        </li>,
        <li key="5">
          <button
            className="btn waves-effect waves-light #b71c1c red darken-4"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              navigate("/signin");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Login</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUser = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query }),
    })
      .then((res) => res.json())
      .then((result) => {
        setUseretails(result.user);
      });
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signup"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right ">
          {renderList()}
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUser(e.target.value)}
          />

          <ul className="collection" style={{ color: "black" }}>
            {userDetails.map((item) => {
              return (
                <Link
                  to={item._id!==state._id?"/profile/" + item._id:"/profile"}
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch('')
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            CLose
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
