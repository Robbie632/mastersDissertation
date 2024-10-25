import "./App.css";
import "./components/Menu";
import Menu from "./components/Menu";
import Learn from "./components/Learn";
import Browse from "./components/Browse";
import About from "./components/About";
import FloatingLogin from "./components/FloatingLogin";
import React, { useState, useEffect } from "react";
import { ENV_VARS } from "./env";

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
      fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/checkjwt`,
        {
          headers: {
            "Content-Type": "application/json",
            "authorization": cachedJWT
          }
        },
      )
        .then((response) => {
          if (response.status === 200) {
            setUserDetails(() => ({ token: cachedJWT, userid: cachedUserid }));
            setLoggedIn(() => true, setMenuSelection("learn"))
          }
        })
    }
  }, []);

  return (
    <div className="App Holiday-Cheer-5-hex">
      <div>
        <Menu
        {...{setLoggedIn, loggedIn, setMenuSelection, menuSelection, language}}
        ></Menu>
      </div>
      {menuSelection === "learn" && loggedIn && (
        <Learn userDetails={userDetails} language={language}></Learn>
      )}
      {menuSelection === "browse" && loggedIn && (
        <Browse userDetails={userDetails}></Browse>
      )}
      {menuSelection === "account" && (
          <FloatingLogin {...{ userDetails, setUserDetails, setMenuSelection, setLoggedIn, setSignedUp }}></FloatingLogin>
        
      )}
      {menuSelection === "about" && <About></About>}
    </div>
  );
}

export default App;
