import "../styles/menu.css";

export default function Menu({ setMenuSelection, menuSelection, language }) {
  
  function highlightBorder(menu) {
    const style = menuSelection === menu ? { "borderBottom": "2px solid white" } : {}
    return style 
  }

  return (
    <header className="App-header Holiday-Cheer-1-hex heading-1">
      <div className="menu-button" style={highlightBorder("learn")} onClick={() => setMenuSelection("learn") } >LEARN</div>
      <div className="menu-button" style={highlightBorder("browse")} onClick={() => setMenuSelection("browse") }>BROWSE</div>
      <div className="menu-button" style={highlightBorder("account")} onClick={() => setMenuSelection("account")}>
        ACCOUNT
      </div>
      <div className="menu-button" style={highlightBorder("about")} onClick={() => setMenuSelection("about")}>
        ABOUT
      </div>
      <div className="current-language">language: {language["name"]}</div>
    </header>
  );
}
