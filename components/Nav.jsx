import { useState } from "react";
import navItems from "../src/data/navitems";

import { AnimatePresence } from "framer-motion";
import { fadeIn } from "../src/animations";


const navAnimationTiming = (index, total) => {
    const safeTotal = Math.max(total, 1)
    return {
        delay: 0.2 + index * 0.08,
        exitDelay: Math.max(safeTotal - index - 1, 0) * 0.08,
    }
}

export default function Nav({ active, onSelect, hasSelected, setHasSelected, language = "en" }){    
    const items = navItems[language] || navItems.en;

    //state for nav menu opening once index is selected
    const [menuOpen, setMenuOpen] = useState(false);
    const primaryNavItem = items.find((item) => item.id === "index");
    const secondaryNavItems = items.filter((item) => item.id !== "index");

    return(
        <nav>
            <ul>
                {primaryNavItem && (
                    <li
                        key={primaryNavItem.id}
                        variants={fadeIn}
                        className={"hoverable"}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        custom={navAnimationTiming(0, 1)}
                    >
                        <button
                            className={
                                `${hasSelected ? (active === primaryNavItem.id ? null : "item-unfocus") : null}`
                            }
                            onClick={() => {
                                onSelect(primaryNavItem.id);
                                if (menuOpen){
                                    setMenuOpen(false);
                                    setHasSelected(false);
                                } else{
                                    setMenuOpen(true);
                                    setHasSelected(true);
                                }
                            }}
                        >
                            {primaryNavItem.label}
                        </button>
                    </li>
                )}
                <AnimatePresence mode="sync">
                    {menuOpen && secondaryNavItems.map((item, index) => (
                        <li
                            key={item.id}
                            variants={fadeIn}
                            className={"hoverable"}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={navAnimationTiming(index, secondaryNavItems.length)}
                        >
                            <button className={
                                `${hasSelected ? (active === item.id ? null : "item-unfocus") : null}`
                            }
                            onClick={() => {
                                onSelect(item.id);
                            }}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                    </AnimatePresence>
                </ul>
            
       </nav>
    )
}
