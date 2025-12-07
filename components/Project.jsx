import projectsList from "../src/data/projectsList"
import { useEffect, useRef, useState } from "react"
import ProjectImages from "./ProjectImages"

export default function Project({hasSelected, language = "en"}){
    //state for active project
    const [activeProject, setActiveProject] = useState(null)
    const [listFocusIndex, setListFocusIndex] = useState(0)
    const projectButtonRefs = useRef([])
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

    const focusNavFirst = () => {
        const navButton = document.querySelector('[data-nav-button="0"]')
        if (navButton) {
            navButton.focus()
            return true
        }
        return false
    }

    const focusNavLast = () => {
        const navButtons = document.querySelectorAll("[data-nav-button]")
        if (!navButtons.length) return false
        const navTarget = navButtons[navButtons.length - 1]
        if (navTarget) {
            navTarget.focus()
            return true
        }
        return false
    }

    const focusCarouselFirst = () => {
        const carouselFirst = document.querySelector('[data-carousel-button="0"]')
        if (carouselFirst) {
            carouselFirst.focus()
            return true
        }
        return false
    }

    const focusCarouselLast = () => {
        const carouselButtons = document.querySelectorAll("[data-carousel-button]")
        if (!carouselButtons.length) return false
        const target = carouselButtons[carouselButtons.length - 1]
        if (target) {
            target.focus()
            return true
        }
        return false
    }

    const focusContentInteractive = () => {
        const contentTarget = document.querySelector("[data-content-focus]")
        if (!contentTarget) return false
        const interactive = contentTarget.querySelector(
            'a, button, [tabindex]:not([tabindex="-1"])'
        )
        if (interactive) {
            interactive.focus()
            return true
        }
        return false
    }

    const handleSpaceActivate = (event) => {
        if (event.key === " " || event.key === "Spacebar") {
            event.preventDefault()
            event.currentTarget.click()
        }
    }

    useEffect(() => {
        if (listFocusIndex >= projects.length) {
            setListFocusIndex(projects.length ? projects.length - 1 : 0)
        }
    }, [listFocusIndex, projects.length])

    useEffect(() => {
        const target = projectButtonRefs.current[listFocusIndex]
        if (target) {
            target.focus()
        }
    }, [listFocusIndex, projects.length])

    const handleArrowNavigation = (event, index) => {
        if (!projects.length) return
        const { key } = event
        let nextIndex = null

        if (key === "ArrowRight") {
            event.preventDefault()
            if (focusContentInteractive()) return
            if (focusCarouselFirst()) return
            if (focusNavFirst()) return
        } else if (key === "ArrowLeft") {
            event.preventDefault()
            if (focusNavLast()) return
        } else if (key === "ArrowDown") {
            if (index === projects.length - 1) {
                event.preventDefault()
                if (focusContentInteractive()) return
                if (focusCarouselFirst()) return
                if (focusNavFirst()) return
            }
            nextIndex = (index + 1) % projects.length
        } else if (key === "ArrowUp") {
            nextIndex = (index - 1 + projects.length) % projects.length
        }

        if (nextIndex !== null) {
            event.preventDefault()
            setListFocusIndex(nextIndex)
        }
    }

    return(
        <>
        <section
            className="projects"
        >
            <div className="projects-list utility-border-top">
                <ul>
                    {projects.map((project, index) => (
                        <li key={project.id}>
                            <button 
                            className={`hoverable ${hasSelected ? (activeProject === project.id ? null : "item-unfocus") : null}`}
                            type="button"
                            aria-expanded={activeProject === project.id}
                            aria-controls={`project-panel-${project.id}`}
                            tabIndex={listFocusIndex === index ? 0 : -1}
                            data-project-button={index}
                            ref={(el) => { projectButtonRefs.current[index] = el }}
                            onKeyDown={(event) => handleArrowNavigation(event, index)}
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
                    id={`project-panel-${activeProject}`}
                    aria-live="polite"
                >
                    <div 
                        className="project-details utility-border-top" 
                        data-content-focus
                        onKeyDown={(event) => {
                            const { key } = event
                            const interactive = Array.from(
                                event.currentTarget.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
                            )
                            const currentIndex = interactive.indexOf(document.activeElement)

                            if (key === "ArrowRight") {
                                event.preventDefault()
                                if (focusCarouselFirst()) return
                                focusNavFirst()
                                return
                            }
                            if (key === "ArrowLeft") {
                                event.preventDefault()
                                const projectButtons = document.querySelectorAll("[data-project-button]")
                                const target = projectButtons[projectButtons.length - 1]
                                if (target) target.focus()
                            } else if (key === "ArrowDown") {
                                event.preventDefault()
                                if (currentIndex >= 0 && currentIndex < interactive.length - 1) {
                                    interactive[currentIndex + 1].focus()
                                    return
                                }
                                if (focusCarouselFirst()) return
                                focusNavFirst()
                            } else if (key === "ArrowUp") {
                                event.preventDefault()
                                const projectButtons = document.querySelectorAll("[data-project-button]")
                                const target = projectButtons[projectButtons.length - 1]
                                if (target) target.focus()
                            }
                        }}
                    >
                        <div className="selected-project">
                            <p className="project-caption">{selectedProject.caption + ", " + selectedProject.year}</p>
                            <p className="project-description">
                                {selectedProject.description.map((segment, i) => {
                                if (segment.type === "text") return <span key={i}>{segment.value}</span>;
                                if (segment.type === "link"){
                                    return (
                                        <a
                                        key={i}
                                        href={segment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onKeyUp={handleSpaceActivate}
                                        >
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
                                    onKeyUp={handleSpaceActivate}
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
                <ProjectImages key={`gallery-${activeProject}`} images={selectedProject?.images} language={language} />
            )}
        </>
    )
}
