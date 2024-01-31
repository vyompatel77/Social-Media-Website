import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setMypics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMypics(result.myposts);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "dlwbmv3yr");
      fetch("https://api.cloudinary.com/v1_1/dlwbmv3yr/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url);
          // console.log(data)
          
          
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ pic: data.url }),
          })
            .then((res) => res.json())
            .then((result) => {
               localStorage.setItem("user",JSON.stringify({...state,photo:result.photo}))
              dispatch({type:"UPDATEPIC",payload:result.photo})
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <>
      {state ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <img
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "200px",
                  }}
                  src={state ? state.photo : <h5>Loading</h5>}
                  alt="pics"
                />
              </div>

              <div>
                <h4>{state.name} </h4>
                <h5>{state.email}</h5>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "108%",
                  }}
                >
                  <h6>{mypics.length} Posts</h6>
                  <h6>
                    {state ? state.followers.length : <h4>Loading</h4>}
                    Followers
                  </h6>
                  <h6>
                    {state ? state.following.length : <h4>Loading</h4>}
                    Following
                  </h6>
                </div>
              </div>
            </div>
            <div className="file-field input-field" style={{ margin: "10px" }}>
              <div className="btn #64b5f6 blue darken-1">
                <span>Update Image</span>
                <input
                  type="file"
                  onChange={(e) => {
                    updatePhoto(e.target.files[0]);
                  }}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
          </div>

          <div className="gallery">
            {mypics.map((item) => {
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
        <h6>Loading</h6>
      )}
    </>
  );
};

export default Profile;
