import { useEffect, useRef, useState } from "react";
import information from "../src/data/information";

export default function Information({ language = "en" }) {
    //state to show experience
    const [showExperience, setShowExperience] = useState(false);

    //state for item selection (links, toggle, experience entries)
    const [focusedItemIndex, setFocusedItemIndex] = useState(0);
    const copy = information[language] || information.en;
    const itemRefs = useRef([]);

    const focusProjectFirst = () => {
        const projectFirst = document.querySelector('[data-project-button="0"]');
        if (projectFirst) {
            projectFirst.focus();
            return true;
        }
        return false;
    };

    const focusNavFirst = () => {
        const navButton = document.querySelector('[data-nav-button="0"]');
        if (navButton) {
            navButton.focus();
            return true;
        }
        return false;
    };

    const handleSpaceActivate = (event) => {
        if (event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            event.currentTarget.click();
        }
    };

    useEffect(() => {
        setFocusedItemIndex(0);
    }, [language]);

    useEffect(() => {
        const target = itemRefs.current[focusedItemIndex];
        if (target) {
            target.focus();
        }
    }, [focusedItemIndex, copy.socialLinks.length]);

    useEffect(() => {
        const totalItems = copy.socialLinks.length + 1; // links + toggle button
        if (focusedItemIndex >= totalItems) {
            setFocusedItemIndex(totalItems ? totalItems - 1 : 0);
        }
    }, [focusedItemIndex, copy.socialLinks.length]);

    const handleColumnNavigation = (event) => {
        const { key } = event;
        if (key === "ArrowLeft") {
            event.preventDefault();
            if (focusProjectFirst()) return;
            focusNavFirst();
        } else if (key === "ArrowRight") {
            event.preventDefault();
            focusNavFirst();
        }
    };

    const handleArrowNavigation = (event, index) => {
        const { key } = event;
        const totalItems = copy.socialLinks.length + 1; // links + toggle button
        if (!totalItems) return;
        let nextIndex = null;

        if (key === "ArrowRight") {
            event.preventDefault();
            focusNavFirst();
            return;
        } else if (key === "ArrowDown") {
            const isLast = index === totalItems - 1;
            if (isLast) {
                event.preventDefault();
                focusNavFirst();
                return;
            }
            nextIndex = (index + 1) % totalItems;
        } else if (key === "ArrowLeft") {
            event.preventDefault();
            if (focusProjectFirst()) return;
            focusNavFirst();
            return;
        } else if (key === "ArrowUp") {
            nextIndex = (index - 1 + totalItems) % totalItems;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            setFocusedItemIndex(nextIndex);
        }
    };


    return(
        <section
            className="information"
            data-content-focus
            onKeyDown={handleColumnNavigation}
        >
            <div className={"information-description utility-border-top"}>
                <p>
                    {copy.title}<br/>
                    <span lang="fr">{copy.location}</span>
                </p>
            </div>
            <div className="information-sociallinks utility-border-top" >
                <ul>
                    {copy.socialLinks.map((link, index) => (
                        <li className="hoverable" key={link.id}>
                            <a 
                                className={`hoverable ${focusedItemIndex !== null ? (focusedItemIndex === index ? null : "item-unfocus") : null}`}
                                href={link.url} 
                                onClick={() => {setFocusedItemIndex(index)}}
                                target="_blank" 
                                rel="noopener noreferrer"
                                onFocus={() => setFocusedItemIndex(index)}
                                tabIndex={focusedItemIndex === index ? 0 : -1}
                                ref={(el) => { itemRefs.current[index] = el; }}
                                onKeyDown={(event) => handleArrowNavigation(event, index)}
                                onKeyUp={handleSpaceActivate}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={"information-experience-button utility-border-top"}>
                <button
                type="button"
                className={`hoverable ${showExperience ? null : "item-unfocus"}`}
                aria-expanded={showExperience}
                aria-controls="experience-list"
                tabIndex={focusedItemIndex === copy.socialLinks.length ? 0 : -1}
                ref={(el) => { itemRefs.current[copy.socialLinks.length] = el; }}
                onKeyDown={(event) => handleArrowNavigation(event, copy.socialLinks.length)}
                onFocus={() => setFocusedItemIndex(copy.socialLinks.length)}
                onClick={() => (setShowExperience(prev => !prev))}
                >
                    {language === "en" ? (showExperience ? "-" : "+") : (showExperience ? "-" : "+")}
                </button>
            </div>
            {showExperience && (
            <div
                className="information-experience-list utility-border-top"
                id="experience-list"
            >
                <dl>
                    {copy.experience.map((item, idx) => {
                        const experienceIndex = copy.socialLinks.length + 1 + idx;
                        return (
                            <div
                                key={item.id}
                            >
                                <dt lang={item.lang || undefined}>
                                    {item.dt}
                                </dt>
                                <dd>
                                    {item.dd}
                                </dd>
                            </div>
                        );
                    })}
                </dl>
            </div>
            )}
        </section>
    )
}
