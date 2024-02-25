import "./App.css";
import "./components/Menu";
import Menu from "./components/Menu";
import Learn from "./components/Learn";
import Browse from "./components/Browse";
import Account from "./components/Account";
import React, { useState } from "react";

function App() {
  const [menuSelection, setMenuSelection] = useState("learn");
  const [loggedIn, setLoggedIn] = useState(0);
  const [signedUp, setSignedUp] = useState(0);
  const [userDetails, setUserDetails] = useState({});

  const menuOptions = ["learn", "browse"];
  return (
    <div className="App">
      <div>
        <Menu setMenuSelection={setMenuSelection}></Menu>
      </div>
      {menuSelection === "learn" && <Learn></Learn>}
      {menuSelection === "browse" && <Browse></Browse>}
      {menuSelection === "account" && <Account></Account>}
    </div>
  );
}

export default App;
