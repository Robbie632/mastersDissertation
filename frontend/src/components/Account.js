import { AiOutlineLoading } from "react-icons/ai";

import "../App.css";
import "../styles/account.css";
import "../styles/login.css";
import { ENV_VARS } from "../env";

import SignUp from "./Signup";
import { useReducer, useState } from "react";

export default function Account({
  setLoggedIn,
  loggedIn,
  setUserDetails,
  setSignedUp,
  setMenuSelection,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isWaiting, setIsWaiting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsWaiting(1)
    // You can perform any validation or submit the form data as needed
    const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData),
    });
    if (response.status === 200) {
      const result = await response.json();
      setUserDetails(() => ({
        token: result["token"],
        userid: result["userid"],
      }));
      localStorage.setItem("JWT", result["token"])
      localStorage.setItem("userid", result["userid"])
      setLoggedIn((prev) => true);
      setMenuSelection(() => "learn");
    } else if (response.status === 403) {
      setIsWaiting(false);
      alert("invalid credentials");

    }
  };

  const logOutElement = (
    <div className="success-login-container">
      <div
        className="success-login Holiday-Cheer-5-hex log-out"
        onClick={() => {
          setLoggedIn(false);
        }}
      >
        <div >LOG OUT</div>
      </div>
    </div>
  );

  return !isWaiting ? (
    <div className="account-container">
      {loggedIn ? (
        logOutElement
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="account-content heading-2">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoFocus
            />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" class="Holiday-Cheer-3-hex default-button">
              Log In
            </button>
          </div>
          <div className="divider"></div>
        </form>
      )}

      {!loggedIn && <SignUp setSignedUp={setSignedUp} setIsWaiting={setIsWaiting}></SignUp>}
    </div>
  ) : (
    <div>
      <AiOutlineLoading className="account-loading" />
    </div>
  );
}
