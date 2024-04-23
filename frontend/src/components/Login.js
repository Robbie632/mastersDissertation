import "../App.css";
import "../styles/account.css";
import "../styles/login.css";
import { useState } from "react";

export default function Login({ setloggedIn }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform any validation or submit the form data as needed
    setloggedIn((prev) => true);
    alert(`Form data submitted: ${JSON.stringify(formData)}`);
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
          <button type="submit" class="Holiday-Cheer-3-hex">Log In</button>
        </div>
      </form>
    </div>
  );
}
