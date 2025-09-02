import projectsList from "../src/data/projectsList"
import { useState } from "react"

//animation import
import { MotionSection, MotionDiv, MotionUl, fadeIn, staggerChildren } from "../src/animations"
import { AnimatePresence } from "framer-motion"

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
        <MotionSection className="projects" variants={staggerChildren} initial="hidden" animate="visible" exit="exit">
            <MotionDiv className="projects-list" variants={fadeIn}>
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
            </MotionDiv>
           
            {activeProject && (
                <AnimatePresence 
                    variant={staggerChildren} 
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <MotionDiv 
                        className="project-details" 
                        variants={fadeIn} 
                        key={activeProject} 
                    >
                        <MotionDiv key={activeProject} className="selected-project" variants={fadeIn}>
                            <p>{selectedProject.caption + ", " + selectedProject.year}</p>
                            <p>{selectedProject.description}</p>
                        </MotionDiv>
                        {selectedProject.links?.length > 0 && (
                            <MotionUl className="projects-links" variants={fadeIn}>
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
                            </MotionUl>
                        )}
                    </MotionDiv>

                    {selectedProject.images?.length > 0 && (
                        <MotionDiv 
                            className="project-images" 
                            variants={staggerChildren}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {selectedProject.images.map((image, i) =>
                           <figure key={i} className="project-figure">
                                <img onClick={() => setFocusImage(image)} src={image.src} alt={image.label || ""} className="project-image" />
                                {image.label && <figcaption className="project-image-caption">{image.label}</figcaption>}
                            </figure>  
                            )}
                        </MotionDiv>
                       
                    )}
                </AnimatePresence>
            )}
           
            {focusImage && (
                <figure className="image-focus " onClick={() => setFocusImage(null)}>
                    <img src={focusImage.src} alt={focusImage.label || ""}/>
                </figure>
            )}
        </MotionSection>
    )
}