import "../styles/menu.css";
import swedishFlag from "../assets/swedish_flag.png";
import logo from "../assets/logo.jpeg";
import { IconContext } from "react-icons";
import { CgProfile } from "react-icons/cg";

export default function Menu({ loggedIn, setMenuSelection, menuSelection, language }) {

  function highlightBorder(menu) {
    const style = menuSelection === menu ? { "borderBottom": "2px solid white" } : {}
    return style
  }

  return (
    <header className="App-header Holiday-Cheer-1-hex heading-1">
      <div className="menu-item logo-container" onClick={() => setMenuSelection("learn")} >
        <img className="logo" alt="logo" src={logo}></img>
      </div>
      {loggedIn && <div className="menu-item menu-button default-button" style={highlightBorder("learn")} onClick={() => setMenuSelection("learn")} >LEARN</div>}
      {loggedIn && <div className="menu-item menu-button default-button" style={highlightBorder("browse")} onClick={() => setMenuSelection("browse")}>BROWSE</div>}
      <div className="menu-item menu-button default-button" style={highlightBorder("about")} onClick={() => setMenuSelection("about")}>
        ABOUT
      </div>
      <div className=" menu-item current-language">
        <img alt="Swedish flag" src={swedishFlag}></img>
      </div>
      <div className="account menu-item menu-button default-button" style={highlightBorder("account")} onClick={() => setMenuSelection("account")}>
        <IconContext.Provider
          value={{
            size: 78,
            color: "white",
            className: "lessontype-back-arrow-graphic",
          }}
        >
          <CgProfile />
        </IconContext.Provider>
      </div>
    </header>
  );
}
