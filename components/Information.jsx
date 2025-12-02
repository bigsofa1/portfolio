import { useState } from "react";
import information from "../src/data/information";

//animation import
import { fadeIn, staggerChildren } from "../src/animations";
import { AnimatePresence } from "framer-motion";

export default function Information({ language = "en" }) {
    //state to show experience
    const [showExperience, setShowExperience] = useState(false);

    //state for link selection
    const [hasSelected, setHasSelected] = useState(false);
    const copy = information[language] || information.en;


    return(
        <section className="information" variants={staggerChildren} initial="hidden" animate="visible" exit="exit">
            <div variants={fadeIn} className={"information-description utility-border-top"}>
                <p>
                    {copy.title}<br/>
                    <span lang="fr">{copy.location}</span>
                </p>
            </div>
            <div variants={fadeIn} className="information-sociallinks utility-border-top" >
                <ul>
                    {copy.socialLinks.map((link) => (
                        <li className="hoverable" key={link.id}>
                            <a 
                                className={`hoverable ${hasSelected === link.id ? null : "item-unfocus"}`}
                                href={link.url} 
                                onClick={() => {setHasSelected(true)}}
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div variants={fadeIn} className={"information-experience-button utility-border-top"}>
                <button className={`hoverable ${showExperience ? null : "item-unfocus"}`}
                onClick={() => (setShowExperience(prev => !prev))}
                >
                    {language === "en" ? (showExperience ? "-" : "+") : (showExperience ? "-" : "+")}
                </button>
            </div>
            <AnimatePresence>
            {showExperience && (
            <div variants={fadeIn} className="information-experience-list utility-border-top" >
                <dl variants={staggerChildren} initial="hidden" animate="visible" exit="exit">
                    {copy.experience.map((item) => (
                        <div variants={fadeIn} key={item.id}>
                            <dt lang={item.lang || undefined}>
                                {item.dt}
                            </dt>
                            <dd>
                                {item.dd}
                            </dd>
                        </div>
                        ))}
                </dl>
            </div>
            )}
            </AnimatePresence>
        </section>
    )
}
