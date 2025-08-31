import { useState } from "react"
import navItems from "../src/data/navitems"

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";


export default function Nav({ active, onSelect, hasSelected, setHasSelected }){    

    //state for nav menu opening once index is selected
    const [menuOpen, setMenuOpen] = useState(false)

    // Nav item animation variants
    const navItemVariants = {
        hidden: { opacity: 0},
        visible: { opacity: 1},
        exit: { opacity: 0}
    };

    const navListVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.3 } },
        exit: { transition: { staggerChildren: 0.5, staggerDirection: -1 } }
    };

    return(
       <nav>
        <motion.ul
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={navListVariants}>
            <AnimatePresence>
                {navItems.map((item) => {
                    if (item.id !== "index" && !menuOpen) return null
                    return(
                        <motion.li
                            key={item.id}
                            variants={navItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            <button className={
                                `${hasSelected ? (active === item.id ? null : "item-unfocus") : null}`
                            }
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
                            </button>
                        </motion.li>
                        )
                })}
                </AnimatePresence>
            </motion.ul>
       </nav>
    )
}