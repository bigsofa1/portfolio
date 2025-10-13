import { useState } from "react"
import information from "../src/data/information"

//animation import
import { MotionSection, fadeIn, MotionDiv, MotionDl, MotionDt, MotionDd, staggerChildren } from "../src/animations"
import { AnimatePresence } from "framer-motion"

export default function Information() {
    //state to show experience
    const [showExperience, setShowExperience] = useState(false)

    //state for link selection
    const [hasSelected, setHasSelected] = useState(false)


    return(
        <MotionSection className="information" variants={staggerChildren} initial="hidden" animate="visible" exit="exit">
            <MotionDiv variants={fadeIn} className={"information-description"}>
                <p>
                    {information.title}<br/>
                    <span lang="fr">{information.location}</span>
                </p>
            </MotionDiv>
            <MotionDiv variants={fadeIn} className="information-sociallinks" >
                <ul>
                    {information.socialLinks.map((link) => (
                        <li className={"hoverable"} key={link.id}>
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
            </MotionDiv>
            <MotionDiv variants={fadeIn} className={"information-experience-button"}>
                <button className={`hoverable ${showExperience ? null : "item-unfocus"}`}
                onClick={() => (setShowExperience(prev => !prev))}
                >
                    Currently
                </button>
            </MotionDiv>
            <AnimatePresence>
            {showExperience && (
            <MotionDiv variants={fadeIn} className="information-experience-list" >
                <MotionDl variants={staggerChildren} initial="hidden" animate="visible" exit="exit">
                    {information.experience.map((item) => (
                        <MotionDiv variants={fadeIn} key={item.id}>
                            <dt lang={item.lang || undefined}>
                                {item.dt}
                            </dt>
                            <dd>
                                {item.dd}
                            </dd>
                        </MotionDiv>
                        ))}
                </MotionDl>
            </MotionDiv>
            )}
            </AnimatePresence>
        </MotionSection>
    )
}