import projectsList from "../src/data/projectsList"
import { useState } from "react"
import ProjectImages from "./ProjectImages"

export default function Project({hasSelected, language = "en"}){
    //state for active project
    const [activeProject, setActiveProject] = useState(null)
    const projects = projectsList.map((project) => {
        const translation = project.translations?.[language] || project.translations?.en || {};
        return {
            ...project,
            ...translation,
        };
    });

    // find the selected project
    const selectedProject = projects.find(
        (project) => project.id === activeProject
    );

    return(
        <>
        <section
            className="projects"
        >
            <div className="projects-list utility-border-top">
                <ul>
                    {projects.map((project) => (
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
           
            {activeProject && selectedProject && (
                <div
                    className="project-content"
                    key={`details-${activeProject}`}
                >
                    <div 
                        className="project-details utility-border-top" 
                    >
                        <div className="selected-project">
                            <p className="project-caption">{selectedProject.caption + ", " + selectedProject.year}</p>
                            <p className="project-description">
                                {selectedProject.description.map((segment, i) => {
                                if (segment.type === "text") return <span key={i}>{segment.value}</span>;
                                if (segment.type === "link"){
                                    return (
                                        <a key={i} href={segment.url} target="_blank" rel="noopener noreferrer">
                                            {segment.label}
                                        </a>
                                    );
                                }
                                if (segment.type === "break") return <br key={i} />;
                                return null;
                                })}
                            </p>
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
                    
             </div>
            )}
            
        </section>
            {activeProject && selectedProject && (
                <ProjectImages key={`gallery-${activeProject}`} images={selectedProject?.images} />
            )}
        </>
    )
}
