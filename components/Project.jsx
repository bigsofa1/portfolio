import projectsList from "../src/data/projectsList"
import { useState } from "react"

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Project({hasSelected}){
    //state for active project
    const [activeProject, setActiveProject] = useState(null)

    // find the selected project
    const selectedProject = projectsList.find(
        (project) => project.id === activeProject
    );

    //focus image state
    const [focusImage, setFocusImage] = useState(null)

    return(
        <motion.section className="projects"
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        exit={{ opacity: 0 }}
        transition={{ duration:0.5 }}>
            <div className="projects-list ">
                <ul>
                    {projectsList.map((project) => (
                        <li key={project.id}>
                            <button 
                            className={`${hasSelected ? (activeProject === project.id ? null : "item-unfocus") : null}`}
                            onClick={() => setActiveProject(project.id)}
                            >
                                {project.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {activeProject && (
                <>
                    <div className="project-details ">
                        <div key={activeProject} className="selected-project">
                            <p>{selectedProject.caption + ", " + selectedProject.year}</p>
                            <p>{selectedProject.description}</p>
                        </div>
                        {selectedProject.links?.length > 0 && (
                            <ul className="projects-links">
                            {selectedProject.links.map((link, i) => (
                                <li key={i}>
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

                    {selectedProject.images?.length > 0 && (
                        <div className="project-images ">
                            {selectedProject.images.map((image, i) =>
                           <figure key={i} className="project-figure">
                                <img onClick={() => setFocusImage(image)} src={image.src} alt={image.label || ""} className="project-image" />
                                {image.label && <figcaption className="project-image-caption">{image.label}</figcaption>}
                            </figure>  
                            )}
                        </div>
                    )}
                </>
            )}

            {focusImage && (
                <figure className="image-focus " onClick={() => setFocusImage(null)}>
                    <img src={focusImage.src} alt={focusImage.label || ""}/>
                </figure>
            )}
        </motion.section>
    )
}