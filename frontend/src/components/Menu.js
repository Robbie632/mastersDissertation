import "../styles/menu.css";
import swedishFlag from "../assets/swedish_flag.png";
import logo from "../assets/logo.jpeg";

export default function Menu({ loggedIn, setMenuSelection, menuSelection, language }) {

  function highlightBorder(menu) {
    const style = menuSelection === menu ? { "borderBottom": "2px solid white" } : {}
    return style
  }

  return (
    <header className="App-header Holiday-Cheer-1-hex heading-1">
      <div className="menu-item logo-container">
        <img className="logo" alt="logo" src={logo}></img>
      </div>
      {loggedIn && <div className="menu-item menu-button default-button" style={highlightBorder("learn")} onClick={() => setMenuSelection("learn")} >LEARN</div>}
      {loggedIn && <div className="menu-item menu-button default-button" style={highlightBorder("browse")} onClick={() => setMenuSelection("browse")}>BROWSE</div>}
      <div className="menu-item menu-button default-button" style={highlightBorder("account")} onClick={() => setMenuSelection("account")}>
        ACCOUNT
      </div>
      <div className="menu-item menu-button default-button" style={highlightBorder("about")} onClick={() => setMenuSelection("about")}>
        ABOUT
      </div>
      <div className=" menu-item current-language">
        <img alt="Swedish flag" src={swedishFlag}></img>
      </div>
    </header>
  );
}
