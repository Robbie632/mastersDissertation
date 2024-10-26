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


  /**
   * if a cached refresh token exists does POST request to /api/token/refresh then sets user details
   * with token, userid and refresh token and writes refresh token to cache
   */
  useEffect(() => {
    const getToken = async () => {
      const cachedRefreshToken = localStorage.getItem("refreshtoken");
      if (cachedRefreshToken != null) {
        const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/token/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refreshtoken: cachedRefreshToken,
            }),
          },
        )
        if (response.status === 200) {
          const data = await response.json();
          setUserDetails(() => ({ token: data["token"], userid: data["userid"] }));
          setLoggedIn(() => true, setMenuSelection("learn"))
          localStorage.setItem("refreshtoken", data["refreshtoken"]);
          localStorage.setItem("userid", data["userid"])
        }
      }

    }
    if (localStorage.getItem("loggedin") == 1) {
      getToken();
    }
  }, []);

  return (
    <div className="App Holiday-Cheer-5-hex">
      <div>
        <Menu
          {...{ setLoggedIn, loggedIn, setMenuSelection, menuSelection, language }}
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
