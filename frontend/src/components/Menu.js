import "../styles/menu.css";
import swedishFlag from "../assets/swedish_flag.png";
import logo from "../assets/logo.jpeg";
import { IconContext } from "react-icons";
import { GoSignOut } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";

export default function Menu({ setLoggedIn, loggedIn, setMenuSelection, menuSelection, language, ignoreSwedishVowels }) {

  const [accountHover, setAccountHover] = useState(false);

  function highlightBorder(menu) {
    const style = menuSelection === menu ? { "borderBottom": "2px solid white" } : {}
    return style
  }


  return (
    <header className="App-header Holiday-Cheer-1-hex heading-1">
      {/* <div className="menu-item logo-container" onClick={() => setMenuSelection("learn")} >
        <img className="logo" alt="logo" src={logo}></img>
      </div> */}
      {loggedIn && <div className="menu-item menu-button default-button" style={highlightBorder("learn")} onClick={() => setMenuSelection("learn")} >LEARN</div>}
      {loggedIn && <div className="menu-item menu-button default-button" style={highlightBorder("browse")} onClick={() => setMenuSelection("browse")}>BROWSE</div>}
      <div className="menu-item menu-button default-button" style={highlightBorder("about")} onClick={() => setMenuSelection("about")}>
        ABOUT
      </div>
      <div className=" menu-item current-language">
        <img alt="Swedish flag" src={swedishFlag}></img>
      </div>
      <div
        onMouseEnter={() => setAccountHover(true)}
        onMouseLeave={() => setAccountHover(false)}
        className="account menu-item menu-button default-button" style={highlightBorder("account")} onClick={!loggedIn ? () => setMenuSelection("account") : null}>
        <IconContext.Provider
          value={{
            size: 78,
            color: "white",
            className: "lessontype-back-arrow-graphic",
          }}
        >
          <CgProfile />
        </IconContext.Provider>
        {accountHover && loggedIn ?
          <div className="Holiday-Cheer-2-hex" id="sign-out-container">
            <div onClick={() => { setLoggedIn(false); setMenuSelection("account"); setAccountHover(false); localStorage.setItem("loggedin", 0); }} id="sign-out-button">
              <GoSignOut />
              <div>
                Sign out
              </div>
            </div>
          </div> : null}
      </div>
      {loggedIn && <div className="menu-item menu-button default-button" style={highlightBorder("settings")} onClick={() => setMenuSelection("settings")}>SETTINGS</div>}
    </header>
  );
}
