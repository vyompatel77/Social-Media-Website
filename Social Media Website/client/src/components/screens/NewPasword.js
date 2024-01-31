import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
    const {token}=useParams()
  const PostData = () => {
    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.error) {
          M.toast({ html: data.error });
        } else {
          M.toast({ html:data.message });
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram </h2>
        <input
          type="password"
          placeholder="Enter New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={PostData}
        >
          Update Password
        </button>
        
      </div>
    </div>
  );
};

export default NewPassword;
