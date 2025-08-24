import Nav from "../components/Nav";
import About from "../components/About";
import Contact from "../components/Contact";
import Project from "../components/Project"

function App() {
  return (
    <main>
      <div className="row">
        <div className="col-4"><Nav /></div>
        <div className="col-4"><About /><Contact /></div>
        <div className="col-4"><Project /></div>
      </div>
    </main>
  )
}

export default App
