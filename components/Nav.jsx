import { useState } from "react";
import navItems from "../src/data/navitems";

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
                        className={"hoverable"}
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
                    {menuOpen && secondaryNavItems.map((item) => (
                        <li
                            key={item.id}
                            className={"hoverable"}
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
                </ul>
            
       </nav>
    )
}
