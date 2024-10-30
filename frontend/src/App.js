import "./App.css";
import "./components/Menu";
import Menu from "./components/Menu";
import Learn from "./components/Learn";
import Browse from "./components/Browse";
import About from "./components/About";
import FloatingLogin from "./components/FloatingLogin";
import React, { useState, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IconContext } from "react-icons";
import {attemptRefresh} from "./utils/fetchUtils";
import { ENV_VARS } from "./env";

function App() {
  const [menuSelection, setMenuSelection] = useState("waiting");
  const [loggedIn, setLoggedIn] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [ignoreSwedishVowels, setIgnoreSwedishVowels ] = useState(false);
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
        const response = await attemptRefresh();
        if (response.status === 200 && response.token !== null) {
          setUserDetails(() => ({ token: response["token"], userid: response["userid"] }));
          setLoggedIn(() => true, setMenuSelection("learn"))
        } else {
          setMenuSelection("account");
        }
    }
    if (localStorage.getItem("loggedin") == 1) {
      getToken();
    } else {
      setMenuSelection("account");
    }
  }, []);

  return (
    <div className="App Holiday-Cheer-5-hex">
      <div>
        <Menu
          {...{ setLoggedIn, loggedIn, setMenuSelection, menuSelection, language, setIgnoreSwedishVowels }}
        ></Menu>
      </div>
      {menuSelection == "waiting" && <div>
        <IconContext.Provider
          value={{
            size: 48,
            color: "black",
            className: "",
          }}
        >
          <AiOutlineLoading className="app-loading" />
        </IconContext.Provider>

      </div>}
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
