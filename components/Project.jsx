import projectsList from "../src/data/projectsList"
import { useState } from "react"

//animation import
import { MotionSection, MotionDiv, MotionUl, MotionLi, fadeIn, MotionSpan, staggerChildren } from "../src/animations"
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
            <MotionDiv className="projects-list" variants={fadeIn} >
                <ul>
                    {projectsList.map((project) => (
                        <li key={project.id}>
                            <button 
                            className={`${hasSelected ? (activeProject === project.id ? null : "item-unfocus") : null}`}
                            onClick={() => (setActiveProject(prev => prev === project.id ? null : project.id))}
                            >
                                {project.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </MotionDiv>
           
           <AnimatePresence mode="wait">
            {activeProject && (
                <MotionSpan
                    key={activeProject}
                    variants={fadeIn}  
                >
                    <MotionDiv 
                        className="project-details" 
                        variants={fadeIn}    
                    >
                        <MotionDiv className="selected-project" variants={fadeIn}  exit="exit">
                            <p className="project-caption">{selectedProject.caption + ", " + selectedProject.year}</p>
                            <p className="project-description">{selectedProject.description}</p>
                        </MotionDiv>
                        {selectedProject.links?.length > 0 && (
                            <MotionUl className="projects-links" variants={fadeIn} >
                            {selectedProject.links.map((link, i) => (
                                <MotionLi key={i} variants={fadeIn} >
                                    <a 
                                    href={link.url} target="_blank" rel="noopener noreferrer"
                                    className={activeProject ? null : "item-unfocus"}
                                    >
                                        {link.label}
                                    </a>
                                </MotionLi>
                            ))}
                            </MotionUl>
                        )}
                    </MotionDiv>

                    {selectedProject.images?.length > 0 && (
                        <MotionDiv 
                            className="project-images" 
                            variants={fadeIn}
                            initial="hidden" 
                            animate="visible" 
                            exit="exit"
                        >
                            {selectedProject.images.map((image, i) =>
                            <MotionFigure key={i} className="project-figure" variants={fadeIn} custom={i}>
                                    <img onClick={() => setFocusImage(image)} src={image.src} alt={image.label || ""} className="project-image" />
                                    {image.label && <figcaption className="project-image-caption">{image.label}</figcaption>}
                                </MotionFigure>  
                            )}
                        </MotionDiv>
                    )}
             </MotionSpan>
            )}
            </AnimatePresence>
            {focusImage && (
                <figure className="image-focus " onClick={() => setFocusImage(null)}>
                    <img src={focusImage.src} alt={focusImage.label || ""}/>
                </figure>
            )}
        </MotionSection>
    )
}