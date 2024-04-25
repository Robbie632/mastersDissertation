import "../styles/menu.css";

export default function Menu({ setMenuSelection, language, loggedIn}) {
  return (
    <header className="App-header Holiday-Cheer-1-hex heading-1">
      <div className="menu-button" onClick={() => setMenuSelection("learn") } >Learn</div>
      <div className="menu-button" onClick={() => setMenuSelection("browse") }>Browse</div>
      <div className="menu-button" onClick={() => setMenuSelection("account")}>
        Account
      </div>
      <div className="current-language">language: {language["name"]}</div>
    </header>
  );
}
