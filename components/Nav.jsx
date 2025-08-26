import { useState } from "react"
import navItems from "../src/data/navitems"


export default function Nav({ active, onSelect }){    
    //state for nav selection
    const [hasSelected, setHasSelected] = useState(false)

    //state for nav menu opening once index is selected
    const [menuOpen, setMenuOpen] = useState(false)

    return(
       <nav>
            <ul>
                {navItems.map((item) => {
                    if (item.id !== "index" && !menuOpen) return null
                    return(
                        <li key={item.id}>
                            <button className={
                                hasSelected ? 
                                (active === item.id ? null : "nav-unfocus") 
                                : null}
                            onClick={() => {
                                onSelect(item.id)
                                setHasSelected(true)
                                if (item.id === "index") setMenuOpen(true)
                            }}>
                                {item.label}
                            </button>
                        </li>
                        )
                })}
            </ul>
       </nav>
    )
}