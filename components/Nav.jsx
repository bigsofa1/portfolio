import { useState } from "react"
import navItems from "../src/data/navitems"


export default function Nav({ active, onSelect }){    
    //state for nav selection
    const [hasSelected, setHasSelected] = useState(false)

    //state for nav menu opening once index is selected
    const [menuOpen, setMenuOpen] = useState(false)

    return(
    <div className="col-2">
       <nav>
            <ul>
                {navItems.map((item) => {
                    if (item.id !== "index" && !menuOpen) return null
                    return(
                        <li key={item.id}>
                            <button className={
                                `${hasSelected ? (active === item.id ? null : "item-unfocus") : null} 
                                ${item.id !== "index" ? "fade-in" : null}`
                            }
                            onClick={() => {
                                onSelect(item.id)
                                if (item.id === "index"){
                                    if (menuOpen){
                                        setMenuOpen(false)
                                        setHasSelected(false)
                                    } else{
                                        setMenuOpen(true)
                                        setHasSelected(true)
                                    }
                                }
                                else{
                                    setHasSelected(true)
                                }
                            }}
                            >
                                {item.label}
                            </button>
                        </li>
                        )
                })}
            </ul>
       </nav>
       </div>
    )
}