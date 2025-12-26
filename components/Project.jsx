import { useEffect, useMemo, useRef, useState } from "react"
import { sanityClient, urlFor } from "../src/lib/sanityClient"
import { PROJECTS_QUERY } from "../src/lib/queries"
import ProjectImages from "./ProjectImages"

export default function Project({hasSelected, language = "en"}){
    //state for active project
    const [activeProject, setActiveProject] = useState(null)
    const [listFocusIndex, setListFocusIndex] = useState(0)
    const projectButtonRefs = useRef([])
    const [projectDocs, setProjectDocs] = useState([])
    const [loadError, setLoadError] = useState(null)

    const blockContentToSegments = (blocks = []) => {
        const segments = []
        blocks.forEach((block) => {
            if (block._type !== "block" || !block.children) return
            const markDefs = block.markDefs || []
            block.children.forEach((child) => {
                const text = child.text || ""
                if (!text) return
                if (child.marks?.length) {
                    const linkMark = child.marks
                        .map((markKey) => markDefs.find((def) => def._key === markKey && def._type === "link"))
                        .find(Boolean)
                    if (linkMark) {
                        segments.push({ type: "link", label: text, url: linkMark.href })
                        return
                    }
                }
                segments.push({ type: "text", value: text })
            })
            segments.push({ type: "break" })
        })
        while (segments[segments.length - 1]?.type === "break") {
            segments.pop()
        }
        return segments
    }

    const projects = useMemo(() => {
        return projectDocs.map((project) => {
            const translation = project.translations?.[language] || project.translations?.en || {}
            const yearFromDate = project.publishDate ? project.publishDate.slice(0, 4) : ""
            return {
                id: project._id,
                publishDate: project.publishDate,
                year: yearFromDate,
                title: translation.title || project.title || "Untitled project",
                caption: language === "fr" ? project.type?.titleFr || project.type?.title : project.type?.title,
                description: blockContentToSegments(translation.description),
                images:
                    project.images?.map((img) => {
                        const builder = img.asset ? urlFor(img.asset) : null
                        const src = builder
                            ? builder.width(1600).fit("max").auto("format").quality(80).url()
                            : img.src
                        const srcFull = builder
                            ? builder.width(2400).fit("max").auto("format").quality(100).url()
                            : src
                        return {
                            src,
                            srcFull,
                            asset: img.asset,
                            alt: img.alt,
                            label: img.label,
                        }
                    }) || [],
            }
        })
    }, [projectDocs, language])

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

    useEffect(() => {
        let isMounted = true
        sanityClient
            .fetch(PROJECTS_QUERY)
            .then((data) => {
                if (!isMounted) return
                setProjectDocs(data || [])
            })
            .catch((err) => {
                if (!isMounted) return
                setLoadError(err)
                setProjectDocs([])
            })
        return () => {
            isMounted = false
        }
    }, [])

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

    if (loadError) {
        console.error("Failed to load projects from Sanity:", loadError)
    }

    const captionLine = (project) => {
        return [project.caption, project.year].filter(Boolean).join(", ")
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
                    {!projects.length && (
                        <li>
                            <span className="project-empty">
                                {language === "fr" ? "Aucun projet trouvé." : "No projects found."}
                            </span>
                        </li>
                    )}
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
                            <p className="project-caption">{captionLine(selectedProject)}</p>
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
