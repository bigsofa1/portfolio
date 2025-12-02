import Nav from "../components/Nav";
import Information from "../components/Information";
import Project from "../components/Project";

import { useState } from 'react';


function App() {
  const [language, setLanguage] = useState("en")

  //state for active section
  const [activeSection, setActiveSection] = useState()
  //state for menu selection focus
  const [hasSelected, setHasSelected] = useState(false)
  
  return (
    <main className="layout">
        <button className="language-toggle" onClick={() => {
            setLanguage(language === "en" ? "fr" : "en")}}>
            {language === "en" ? "EN" : "FR"}
        </button>
        <Nav
          active={activeSection}
          hasSelected={hasSelected}
          setHasSelected={setHasSelected}
          onSelect={setActiveSection}
          language={language}
        />
        {activeSection === "information" && (<Information key={"information"} language={language} />)}
        {activeSection === "projects" && (
          <Project
            key={"projects"}
            hasSelected={hasSelected}
            setHasSelected={setHasSelected}
            language={language}
          />
        )}
    </main>
  )
}

export default App
