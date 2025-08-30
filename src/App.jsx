import Nav from "../components/Nav";
import Information from "../components/Information";
import Project from "../components/Project";

import { useState } from 'react';


function App() {
  //state for active section
  const [activeSection, setActiveSection] = useState()
  //state for menu selection focus
  const [hasSelected, setHasSelected] = useState(false)
  
  return (
    <main>
      <div className="layout">
        <Nav active={activeSection} hasSelected={hasSelected}  setHasSelected={setHasSelected} onSelect={setActiveSection} />
        {activeSection === "information" && <Information />}
        {activeSection === "projects" && <Project hasSelected={hasSelected} setHasSelected={setHasSelected}/>}
      </div>
    </main>
  )
}

export default App
