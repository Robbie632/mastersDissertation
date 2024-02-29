import "./App.css";
import "./components/Menu";
import Menu from "./components/Menu";
import Learn from "./components/Learn";
import Browse from "./components/Browse";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import React, { useState } from "react";

function App() {
  const [menuSelection, setMenuSelection] = useState("learn");
  const [loggedIn, setLoggedIn] = useState(true);
  const [signedUp, setSignedUp] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [language, setLanguage] = useState("Swedish")

  return (
    <div className="App">
      <div>
        <Menu setMenuSelection={setMenuSelection} setlanguage={setLanguage} language={language}></Menu>
      </div>
      {menuSelection === "learn" && loggedIn && <Learn></Learn>}
      {menuSelection === "browse" && loggedIn && <Browse></Browse>}
      {menuSelection === "login" && <Login></Login>}
      {menuSelection === "signup" && <SignUp></SignUp>}
    </div>
  );
}

export default App;
