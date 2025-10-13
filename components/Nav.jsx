import { useState } from "react"
import navItems from "../src/data/navitems"

import { AnimatePresence } from "framer-motion";
import { MotionNav, MotionUl, MotionLi, MotionButton, fadeIn, staggerChildren } from "../src/animations"

export default function Nav({ active, onSelect, hasSelected, setHasSelected }){    

    //state for nav menu opening once index is selected
    const [menuOpen, setMenuOpen] = useState(false)

    return(
        <MotionNav>
            <MotionUl variants={staggerChildren} initial="hidden" animate="visible" exit="exit">
                <AnimatePresence>
                    {navItems.map((item) => {
                        if (item.id !== "index" && !menuOpen) return null
                        return(
                        <MotionLi
                            key={item.id}
                            variants={fadeIn}
                            className={"hoverable"}
                            initial="hidden" animate="visible" exit="exit" 
                            // whileHover={{
                            // color: "color-mix(in srgb, var(--base-color-dark), black 25%)",
                            // scale: 1.01,
                            // opacity: 1,
                            // transition: { duration: 0.25, ease: "easeOut" },
                            // }}
                        >
                            <MotionButton className={
                                `${hasSelected ? (active === item.id ? null : "item-unfocus") : null}`
                            }
                            variants={fadeIn}
                            onClick={() => {
                                onSelect(item.id)
                                if (item.id === "index"){
                                    if (menuOpen){
                                        setMenuOpen((prev) => !prev)
                                        setHasSelected(false)
                                    } else{
                                        setMenuOpen(true)
                                        setHasSelected(true)
                                    }
                                }
                            }}
                            >
                                {item.label}
                            </MotionButton>
                        </MotionLi>
                        )
                    })}
                    </AnimatePresence>
                </MotionUl>
            
       </MotionNav>
    )
}