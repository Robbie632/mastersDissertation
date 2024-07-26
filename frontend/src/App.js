import "./App.css";
import "./components/Menu";
import Menu from "./components/Menu";
import Learn from "./components/Learn";
import Browse from "./components/Browse";
import Account from "./components/Account";
import SignUp from "./components/Signup";
import About from "./components/About";
import React, { useState, useEffect } from "react";

function App() {
  const [menuSelection, setMenuSelection] = useState("account");
  const [loggedIn, setLoggedIn] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [language, setLanguage] = useState({
    name: "swedish",
    id: 0,
  });
  const cachedJWT = localStorage.getItem("JWT");
  const cachedUserid = localStorage.getItem("userid");
  useEffect(() => {
    if (cachedJWT !== null && cachedUserid !== null) {
      setUserDetails(
        () => ({ token: cachedJWT, userid: cachedUserid }),
        setLoggedIn(() => true, setMenuSelection("learn"))
      );
    }
  }, []);

  return (
    
    <div className="App Holiday-Cheer-5-hex">
      <div>
        <Menu
          loggedIn={loggedIn}
          setMenuSelection={setMenuSelection}
          menuSelection={menuSelection}
          language={language}
        ></Menu>
      </div>
      {menuSelection === "learn" && loggedIn && (
        <Learn userDetails={userDetails} language={language}></Learn>
      )}
      {menuSelection === "browse" && loggedIn && (
        <Browse userDetails={userDetails}></Browse>
      )}
      {menuSelection === "account" && (
        <Account
          setLoggedIn={setLoggedIn}
          loggedIn={loggedIn}
          setSignedUp={setSignedUp}
          signedUp={signedUp}
          setUserDetails={setUserDetails}
          setMenuSelection={setMenuSelection}
        ></Account>
      )}
      {menuSelection === "signup" && (
        <SignUp setSignedUp={setSignedUp}></SignUp>
      )}
      {menuSelection === "about" && <About></About>}
    </div>
  );
}

export default App;
