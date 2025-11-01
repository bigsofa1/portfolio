import projectsList from "../src/data/projectsList"
import { useState } from "react"
import ProjectImages from "./projectImages"

//animation import
import { fadeIn, staggerChildren } from "../src/animations"
import { AnimatePresence } from "framer-motion"

export default function Project({hasSelected}){
    //state for active project
    const [activeProject, setActiveProject] = useState(null)

    // find the selected project
    const selectedProject = projectsList.find(
        (project) => project.id === activeProject
    );

    return(
        <>
        <section className="projects" variants={staggerChildren} initial="hidden" animate="visible" exit="exit">
            <div className="projects-list utility-border-top" variants={fadeIn} >
                <ul>
                    {projectsList.map((project) => (
                        <li key={project.id}>
                            <button 
                            className={`hoverable ${hasSelected ? (activeProject === project.id ? null : "item-unfocus") : null}`}
                            onClick={() => (setActiveProject(prev => prev === project.id ? null : project.id))}
                            >
                                {project.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
           
           <AnimatePresence>
            {activeProject && (
                <div
                    className="project-content"
                    key={`details-${activeProject}`}
                    variants={fadeIn}  
                >
                    <div 
                        className="project-details utility-border-top" 
                        variants={fadeIn}    
                    >
                        <div className="selected-project" variants={fadeIn}  exit="exit">
                            <p className="project-caption">{selectedProject.caption + ", " + selectedProject.year}</p>
                            <p className="project-description">{selectedProject.description}</p>
                        </div>
                        {selectedProject.links?.length > 0 && (
                            <ul className="projects-links" variants={fadeIn} >
                            {selectedProject.links.map((link, i) => (
                                <li key={i} variants={fadeIn} >
                                    <a 
                                    href={link.url} target="_blank" rel="noopener noreferrer"
                                    className={activeProject ? null : "item-unfocus"}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            </ul>
                        )}
                    </div>
                    
             </div>
            )}
            </AnimatePresence>
            
        </section>
        <AnimatePresence mode="wait">
            {activeProject && (
                <ProjectImages key={`gallery-${activeProject}`} images={selectedProject?.images} />
            )}
        </AnimatePresence>
        </>
    )
}
