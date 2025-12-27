import { useEffect, useMemo, useRef, useState } from "react";
import information from "../src/data/information";
import { sanityClient } from "../src/lib/sanityClient";
import { SOCIAL_LINKS_QUERY, EXPERIENCES_QUERY } from "../src/lib/queries";

export default function Information({ language = "en" }) {
    //state to show experience
    const [showExperience, setShowExperience] = useState(false);
    const [socialLinks, setSocialLinks] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [loadError, setLoadError] = useState(null);

    //state for item selection (links, toggle, experience entries)
    const [focusedItemIndex, setFocusedItemIndex] = useState(null);
    const copyBase = information[language] || information.en;
    const blockContentToSegments = (blocks = []) => {
        const segments = [];
        blocks.forEach((block) => {
            if (block._type !== "block" || !block.children) return;
            const markDefs = block.markDefs || [];
            block.children.forEach((child) => {
                const text = child.text || "";
                if (!text) return;
                if (child.marks?.length) {
                    const linkMark = child.marks
                        .map((markKey) => markDefs.find((def) => def._key === markKey && def._type === "link"))
                        .find(Boolean);
                    if (linkMark) {
                        segments.push({ type: "link", label: text, url: linkMark.href });
                        return;
                    }
                }
                segments.push({ type: "text", value: text });
            });
            segments.push({ type: "break" });
        });
        while (segments[segments.length - 1]?.type === "break") {
            segments.pop();
        }
        return segments;
    };
    const socialCopy = useMemo(() => {
        if (socialLinks?.length) {
            return socialLinks.map((link) => ({
                id: link._id,
                label: link.label,
                url: link.url,
            }));
        }
        return copyBase.socialLinks;
    }, [socialLinks, copyBase.socialLinks]);
    const experienceCopy = useMemo(() => {
        if (experiences?.length) {
            return experiences.map((item) => {
                const translation = item.translations?.[language] || item.translations?.en || {};
                return {
                    id: item._id,
                    dt: translation.title || "",
                    dd: blockContentToSegments(translation.description),
                };
            });
        }
        return copyBase.experience;
    }, [experiences, copyBase.experience, language]);
    const copy = {
        ...copyBase,
        socialLinks: socialCopy,
        experience: experienceCopy,
    };
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
        setFocusedItemIndex(null);
    }, [language, copy.socialLinks.length]);

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

    useEffect(() => {
        let isMounted = true;
        sanityClient
            .fetch(SOCIAL_LINKS_QUERY)
            .then((data) => {
                if (!isMounted) return;
                setSocialLinks(data || []);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error("Failed to load social links from Sanity:", err);
                setLoadError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        sanityClient
            .fetch(EXPERIENCES_QUERY)
            .then((data) => {
                if (!isMounted) return;
                setExperiences(data || []);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error("Failed to load experiences from Sanity:", err);
                setLoadError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);


    return(
        <section
            className="information"
            data-content-focus
            onKeyDown={handleColumnNavigation}
        >
            <div className={"information-description utility-border-top"}>
                <p>
                    <span lang="fr">{copy.location}</span>
                </p>
            </div>
            <div className="information-sociallinks utility-border-top" >
                <ul>
                    {copy.socialLinks.map((link, index) => (
                        <li className="hoverable" key={link.id}>
                            <a 
                                className={`hoverable ${focusedItemIndex === index ? "" : "item-unfocus"}`}
                                href={link.url} 
                                onClick={() => {setFocusedItemIndex(index)}}
                                target="_blank" 
                                rel="noopener noreferrer"
                                onFocus={() => setFocusedItemIndex(index)}
                                tabIndex={
                                    focusedItemIndex === null
                                        ? index === 0
                                            ? 0
                                            : -1
                                        : focusedItemIndex === index
                                            ? 0
                                            : -1
                                }
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
                                    {Array.isArray(item.dd)
                                        ? item.dd.map((segment, i) => {
                                            if (segment.type === "text") return <span key={i}>{segment.value}</span>;
                                            if (segment.type === "link") {
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
                                        })
                                        : item.dd}
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
