import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
const Profile = () => {
  const [userprofile, setprofile] = useState(null);
  
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setshowfollow] = useState(state?!state.following.includes(userid):true);

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setprofile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ userid: userid }),
    })
      .then((res) => res.json())
      .then((data) => {
        
        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, following: data.following },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setprofile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setshowfollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ userid: userid }),
    })
      .then((res) => res.json())
      .then((data) => {
        
        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, following: data.following },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setprofile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        setshowfollow(true);
      });
  };

  return (
    <>
      {userprofile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "200px",
                }}
                src={userprofile.user.photo}
                alt="pics"
              />
            </div>
            <div>
              <h4>{userprofile.user.name} </h4>
              <h5>{userprofile.user.email} </h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6> {userprofile.posts.length} Posts</h6>
                <h6>{userprofile.user.followers.length} Followers</h6>
                <h6>{userprofile.user.following.length} Following</h6>
              </div>
              {showfollow ? (
                <button
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={followUser}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={unfollowUser}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userprofile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>Loading</h2>
      )}
    </>
  );
};

export default Profile;
