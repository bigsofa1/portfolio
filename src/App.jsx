import Nav from "../components/Nav";
import Information from "../components/Information";
import Project from "../components/Project";

import { useState } from 'react';

import { AnimatePresence } from "framer-motion";


function App() {
  //state for active section
  const [activeSection, setActiveSection] = useState()
  //state for menu selection focus
  const [hasSelected, setHasSelected] = useState(false)
  
  return (
    <main className="layout">
        <Nav active={activeSection} hasSelected={hasSelected}  setHasSelected={setHasSelected} onSelect={setActiveSection} />
        <AnimatePresence mode="wait">
          {activeSection === "information" && (<Information  key={"information"}/>)}
          {activeSection === "projects" && (<Project key={"projects"} hasSelected={hasSelected} setHasSelected={setHasSelected}/>)}
        </AnimatePresence>
    </main>
  )
}

export default App
