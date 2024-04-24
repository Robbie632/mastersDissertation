import "../App.css";
import "../styles/account.css";
import "../styles/signup.css";

import { useState } from "react";

export default function SignUp({ setSignedUp}) {
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

  const  handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    if (response.status === 201) {
      alert("succesfully signed up");
    }
    const result = await response.json()
    setSignedUp((prev) => true)

  };

  return (
    <div >
      <form onSubmit={handleSubmit}>
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
          <button type="submit" class="Holiday-Cheer-3-hex">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
