import { useState } from "react"
import navItems from "../src/data/navitems"


export default function Nav({ active, onSelect, hasSelected, setHasSelected }){    

    //state for nav menu opening once index is selected
    const [menuOpen, setMenuOpen] = useState(false)

    return(
    <div className="col">
       <nav>
            <ul className="fade-in">
                {navItems.map((item) => {
                    if (item.id !== "index" && !menuOpen) return null
                    return(
                        <li key={item.id}>
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
                        </li>
                        )
                })}
            </ul>
       </nav>
       </div>
    )
}