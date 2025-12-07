import { useEffect, useRef, useState } from "react";
import navItems from "../src/data/navitems";

export default function Nav({ active, onSelect, hasSelected, setHasSelected, language = "en" }){    
    const items = navItems[language] || navItems.en;

    //state for nav menu opening once index is selected
    const [menuOpen, setMenuOpen] = useState(false);
    const [focusIndex, setFocusIndex] = useState(0);
    const [allowAutoFocus, setAllowAutoFocus] = useState(false);
    const primaryNavItem = items.find((item) => item.id === "index");
    const secondaryNavItems = items.filter((item) => item.id !== "index");
    const buttonRefs = useRef([]);
    const visibleItems = [primaryNavItem, ...(menuOpen ? secondaryNavItems : [])].filter(Boolean);

    useEffect(() => {
        if (focusIndex >= visibleItems.length) {
            setFocusIndex(visibleItems.length ? visibleItems.length - 1 : 0);
        }
    }, [focusIndex, visibleItems.length]);

    useEffect(() => {
        if (!allowAutoFocus) return;
        const target = buttonRefs.current[focusIndex];
        if (target) {
            target.focus();
        }
    }, [focusIndex, visibleItems.length, allowAutoFocus]);

    useEffect(() => {
        if (!menuOpen) {
            setFocusIndex(0);
        }
    }, [menuOpen]);

    const focusProjectFirst = () => {
        const projectFirst = document.querySelector('[data-project-button="0"]');
        if (projectFirst) {
            projectFirst.focus();
            return true;
        }
        return false;
    };

    const focusCarouselFirst = () => {
        const carouselFirst = document.querySelector('[data-carousel-button="0"]');
        if (carouselFirst) {
            carouselFirst.focus();
            return true;
        }
        return false;
    };

    const focusContentInteractive = () => {
        const contentTarget = document.querySelector("[data-content-focus]");
        if (!contentTarget) return false;
        const interactive = contentTarget.querySelector(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (interactive) {
            interactive.focus();
            return true;
        }
        return false;
    };

    const handleArrowNavigation = (event, index) => {
        if (!visibleItems.length) return;
        const { key } = event;
        let nextIndex = null;

        setAllowAutoFocus(true);
        if (key === "ArrowRight") {
            event.preventDefault();
            if (focusProjectFirst()) return;
            if (focusContentInteractive()) return;
            if (focusCarouselFirst()) return;
        } else if (key === "ArrowLeft") {
            event.preventDefault();
            if (focusCarouselFirst()) return;
            if (focusContentInteractive()) return;
        } else if (key === "ArrowDown") {
            if (!menuOpen && secondaryNavItems.length > 0) {
                event.preventDefault();
                setMenuOpen(true);
                setHasSelected(true);
                setAllowAutoFocus(true);
                setFocusIndex(1);
                return;
            }
            if (index === visibleItems.length - 1) {
                event.preventDefault();
                if (focusProjectFirst()) return;
                if (focusContentInteractive()) return;
            }
            nextIndex = (index + 1) % visibleItems.length;
        } else if (key === "ArrowUp") {
            nextIndex = (index - 1 + visibleItems.length) % visibleItems.length;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            setFocusIndex(nextIndex);
        }
    };

    return(
        <nav aria-label={language === "fr" ? "Navigation principale" : "Main navigation"}>
            <ul id="nav-secondary-items">
                {primaryNavItem && (
                    <li
                        key={primaryNavItem.id}
                        className={"hoverable"}
                    >
                        <button
                            type="button"
                            className={
                                `${hasSelected ? (active === primaryNavItem.id ? null : "item-unfocus") : null}`
                            }
                            aria-expanded={menuOpen}
                            aria-controls="nav-secondary-items"
                            tabIndex={focusIndex === 0 ? 0 : -1}
                            data-nav-button="0"
                            ref={(el) => { buttonRefs.current[0] = el; }}
                            onKeyDown={(event) => handleArrowNavigation(event, 0)}
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
                    {menuOpen && secondaryNavItems.map((item, index) => (
                        <li
                            key={item.id}
                            className={"hoverable"}
                        >
                            <button className={
                                `${hasSelected ? (active === item.id ? null : "item-unfocus") : null}`
                            }
                            type="button"
                            aria-current={active === item.id ? "page" : undefined}
                            tabIndex={focusIndex === index + 1 ? 0 : -1}
                            data-nav-button={index + 1}
                            ref={(el) => { buttonRefs.current[index + 1] = el; }}
                            onKeyDown={(event) => handleArrowNavigation(event, index + 1)}
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
