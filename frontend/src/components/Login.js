import "../App.css";
import "../styles/account.css";
import "../styles/login.css";
import { IconContext } from "react-icons";
import { TiTick } from "react-icons/ti";
import { useState } from "react";

export default function Login({ setLoggedIn, loggedIn, setUserDetails }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can perform any validation or submit the form data as needed
    const response = await fetch("http://localhost:5000/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    });
    if (response.status === 200) {
      const result = await response.json();
      setUserDetails(() => ({
        token: result["token"],
        userid: result["userid"]
      }));
      setLoggedIn((prev) => true);
    } else if(response.status === 400) {
      alert("invalid credentials");
    }

  };

  const logOutElement = <div className="success-login-container">
    <div className="success-login Holiday-Cheer-3-hex">
      <div className="log-out" onClick={() => {
        setLoggedIn(false);
      }}>
        LOG OUT
      </div>
    </div>
  
  </div>;

  return (
    <div >
      {loggedIn ? logOutElement :
        < form onSubmit={handleSubmit}>
      <div className="account-content heading-2">
     
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" class="Holiday-Cheer-3-hex">Log In</button>
      </div>
    </form>}
    </div>
  );
}
