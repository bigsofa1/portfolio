import Nav from "../components/Nav";
import Information from "../components/Information";
import Project from "../components/Project";

import { useState } from 'react';

function App() {
  const [activeSection, setActiveSection] = useState()

  return (
    <main>
      <div className="row">
        <div className="col-4"><Nav active={activeSection} onSelect={setActiveSection} /></div>
        <div className="col-4 content">
          {activeSection === "Info" && <Information />}
          {activeSection === "work" && <Project />}
        </div>
        <div className="col-4">
          {activeSection === "project" && <Project />}
        </div>
      </div>
    </main>
  )
}

export default App
