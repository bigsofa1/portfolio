import { useState } from "react"
import navItems from "../src/data/navitems"

import { AnimatePresence } from "framer-motion";
import { MotionNav, MotionUl, MotionLi, MotionButton, fadeIn, staggerChildren } from "../src/animations"

export default function Nav({ active, onSelect, hasSelected, setHasSelected }){

    //state for nav menu opening once index is selected
    const [menuOpen, setMenuOpen] = useState(false)
    const navigationListId = "primary-navigation-list"

    return(
        <MotionNav aria-label="Primary navigation">
            <MotionUl
                id={navigationListId}
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <AnimatePresence>
                    {navItems.map((item) => {
                        const isIndexItem = item.id === "index"
                        const isActive = active === item.id

                        if (!isIndexItem && !menuOpen) return null
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
                                `${hasSelected ? (isActive ? null : "item-unfocus") : null}`
                            }
                            type="button"
                            aria-current={isActive ? "page" : undefined}
                            aria-expanded={isIndexItem ? menuOpen : undefined}
                            aria-controls={isIndexItem ? navigationListId : undefined}
                            variants={fadeIn}
                            onClick={() => {
                                onSelect(item.id)
                                if (isIndexItem){
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