import Nav from "../components/Nav";
import Information from "../components/Information";
import Project from "../components/Project";

import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';


function App() {
  const [language, setLanguage] = useState("en")
  console.log("Design & Technology by Thomas Chap Vinette");
  

  return (
    <main className="layout">
        <Nav language={language} />
        <button
          type="button"
          className="language-toggle"
          aria-label={language === "en" ? "Switch site language to French" : "Basculer le site en anglais"}
          onClick={() => {
            setLanguage(language === "en" ? "fr" : "en")}}
        >
            {language === "en" ? "EN" : "FR"}
        </button>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/information" element={<Information language={language} />} />
          <Route path="/projects" element={<Project language={language} />} />
          <Route path="/projects/:slug" element={<Project language={language} />} />
        </Routes>
    </main>
  )
}

export default App
