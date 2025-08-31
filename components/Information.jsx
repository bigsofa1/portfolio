import { useState } from "react"
import information from "../src/data/information"
import React from "react"

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Information() {
    //state to show experience
    const [showExperience, setShowExperience] = useState(false)

    //state for link selection
    const [hasSelected, setHasSelected] = useState(false)


    return(
    <motion.section
      className="information"
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}>
            <div className={"information-description"}>
                <p>
                    {information.title}<br/>
                    <span lang="fr">{information.location}</span>
                </p>
            </div>
            <div className="information-sociallinks">
                <ul>
                    {information.socialLinks.map((link) => (
                        <li key={link.id}>
                            <a 
                                className={hasSelected === link.id ? null : "item-unfocus"}
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
            <div className={"information-experience-button"}>
                <button className={showExperience ? null : "item-unfocus"}
                onClick={() => (setShowExperience(prev => !prev))}
                >
                    Currently
                </button>
            </div>
            {showExperience && (
            <div className="information-experience-list">
                <dl>
                    {information.experience.map((item) => (
                    <React.Fragment key={item.id}>
                        <div>
                        <dt lang={item.lang || undefined} className="0">
                            {item.dt}
                        </dt>
                        <dd className="0">
                            {item.dd}
                        </dd>
                        </div>
                    </React.Fragment>
                        ))}
                </dl>
            </div>
            )}
            
        </motion.section>
    )
}