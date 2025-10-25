import { useState } from "react"
import navItems from "../src/data/navitems"

import { AnimatePresence } from "framer-motion";
import { MotionNav, MotionUl, MotionLi, MotionButton, fadeIn } from "../src/animations"

const navAnimationTiming = (index, total) => {
    const safeTotal = Math.max(total, 1)
    return {
        delay: 0.2 + index * 0.08,
        exitDelay: Math.max(safeTotal - index - 1, 0) * 0.08,
    }
}

export default function Nav({ active, onSelect, hasSelected, setHasSelected }){    

    //state for nav menu opening once index is selected
    const [menuOpen, setMenuOpen] = useState(false)
    const primaryNavItem = navItems.find((item) => item.id === "index")
    const secondaryNavItems = navItems.filter((item) => item.id !== "index")

    return(
        <MotionNav>
            <MotionUl>
                {primaryNavItem && (
                    <MotionLi
                        key={primaryNavItem.id}
                        variants={fadeIn}
                        className={"hoverable"}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        custom={navAnimationTiming(0, 1)}
                    >
                        <MotionButton
                            className={
                                `${hasSelected ? (active === primaryNavItem.id ? null : "item-unfocus") : null}`
                            }
                            onClick={() => {
                                onSelect(primaryNavItem.id)
                                if (menuOpen){
                                    setMenuOpen(false)
                                    setHasSelected(false)
                                } else{
                                    setMenuOpen(true)
                                    setHasSelected(true)
                                }
                            }}
                        >
                            {primaryNavItem.label}
                        </MotionButton>
                    </MotionLi>
                )}
                <AnimatePresence mode="sync">
                    {menuOpen && secondaryNavItems.map((item, index) => (
                        <MotionLi
                            key={item.id}
                            variants={fadeIn}
                            className={"hoverable"}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={navAnimationTiming(index, secondaryNavItems.length)}
                        >
                            <MotionButton className={
                                `${hasSelected ? (active === item.id ? null : "item-unfocus") : null}`
                            }
                            onClick={() => {
                                onSelect(item.id)
                            }}
                            >
                                {item.label}
                            </MotionButton>
                        </MotionLi>
                    ))}
                    </AnimatePresence>
                </MotionUl>
            
       </MotionNav>
    )
}
