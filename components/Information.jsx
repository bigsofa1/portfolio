import { useState } from "react"
import information from "../src/data/information"
import React from "react"

export default function Information() {
    //state to show experience
    const [showExperience, setShowExperience] = useState(false)

    //state for link selection
    const [hasSelected, setHasSelected] = useState(false)


    return(
        <>
            <div className="col-8 information fade-in">
                <p>
                    {information.title}<br/>
                    {information.location}
                </p>

                <ul className="information-sociallinks">
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

                <button className={showExperience ? null : "item-unfocus"}
                onClick={() => (setShowExperience(prev => !prev))}
                >
                    Currently
                </button>

                {showExperience && (
                <div className="information-experience-container">
                    <dl className="fade-in">
                        {information.experience.map((item) => (
                            <React.Fragment key={item.id}>
                                <dt lang={item.lang || undefined}>
                                    {item.dt}
                                </dt>
                                <dd>
                                    {item.dd}
                                </dd>
                            </React.Fragment>
                        ))}
                    </dl>
                </div>
                )}
            </div>
        </>
    )
}