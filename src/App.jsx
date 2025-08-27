import Nav from "../components/Nav";
import Information from "../components/Information";
import Project from "../components/Project";

import { useState } from 'react';


function App() {
  const [activeSection, setActiveSection] = useState()

  return (
    <main>
      <div className="row">
        <Nav active={activeSection} onSelect={setActiveSection} />
        {activeSection === "information" && <Information />}
      {activeSection === "projects" && <Project />}
      </div>
    </main>
  )
}

export default App
