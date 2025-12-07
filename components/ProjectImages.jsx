import { useRef, useCallback, useEffect, useState } from "react"

export default function ProjectImages({ images = [], language = "en" }){

const [focusIndex, setFocusIndex] = useState(null)
const scrollThreshold = 75;
const scrollAccumulator = useRef(0);
const touchStartRef = useRef(null);
const touchThreshold = 40;
const closeButtonRef = useRef(null);

const openImage = useCallback(
   (index) => {
    setFocusIndex(index);
   },
   []
);

const closeImage = useCallback(() => {
    setFocusIndex(null);
}, []
);

const showNext = useCallback(() => {
    if (!images.length) return;
    setFocusIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const showPrev = useCallback(() => {
    if (!images.length) return;
    setFocusIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (focusIndex === null) return;

    if (closeButtonRef.current){
      closeButtonRef.current.focus();
    }

    const handleKey = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrev();
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeImage();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusIndex, showNext, showPrev, closeImage]);

const focusImage = focusIndex !== null ? images[focusIndex] : null;

useEffect(() => {
  if (focusIndex === null) return;

  const handleWheel = (event) => {
    const primaryDelta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;

    scrollAccumulator.current += primaryDelta;

    if (Math.abs(scrollAccumulator.current) < scrollThreshold) return;

    event.preventDefault();
    if (scrollAccumulator.current > 0) {
      showNext();
    } else {
      showPrev();
    }
    scrollAccumulator.current = 0;
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  return () => window.removeEventListener("wheel", handleWheel);
}, [focusIndex, showNext, showPrev]);

useEffect(() => {
  if (focusIndex === null) return;

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (event) => {
    if (!touchStartRef.current) return;

    const touch = event.touches[0];
    const deltaX = touchStartRef.current.x - touch.clientX;
    const deltaY = touchStartRef.current.y - touch.clientY;
    const primaryDelta =
      Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY;

    if (Math.abs(primaryDelta) < touchThreshold) return;

    event.preventDefault();
    if (primaryDelta > 0) {
      showNext();
    } else {
      showPrev();
    }

    touchStartRef.current = null;
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  window.addEventListener("touchstart", handleTouchStart, { passive: false });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd);

  return () => {
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };
}, [focusIndex, showNext, showPrev]);

if  (!images.length) return null;
const closeLabel = language === "fr" ? "Fermer l'image" : "Close image";

const focusNavFirst = () => {
  const navButton = document.querySelector('[data-nav-button="0"]');
  if (navButton) {
    navButton.focus();
    return true;
  }
  return false;
};

const focusProjectLast = () => {
  const projectButtons = document.querySelectorAll("[data-project-button]");
  if (!projectButtons.length) return false;
  const target = projectButtons[projectButtons.length - 1];
  if (target) {
    target.focus();
    return true;
  }
  return false;
};

const focusContentLast = () => {
  const contentTarget = document.querySelector("[data-content-focus]");
  if (!contentTarget) return false;
  const interactive = contentTarget.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
  if (!interactive.length) return false;
  const target = interactive[interactive.length - 1];
  if (target) {
    target.focus();
    return true;
  }
  return false;
};

const handleArrowNavigation = (event) => {
  const { key } = event;
  const buttons = Array.from(document.querySelectorAll("[data-carousel-button]"));
  const currentIndex = buttons.indexOf(document.activeElement);

  if (key === "ArrowRight") {
    event.preventDefault();
    if (currentIndex >= 0 && currentIndex < buttons.length - 1) {
      buttons[currentIndex + 1].focus();
      return;
    }
    focusNavFirst();
    return;
  }

  if (key === "ArrowLeft") {
    event.preventDefault();
    if (currentIndex > 0) {
      buttons[currentIndex - 1].focus();
      return;
    }
    if (focusContentLast()) return;
    focusProjectLast();
    return;
  }

  if (key === "ArrowDown") {
    event.preventDefault();
    focusNavFirst();
    return;
  }

  if (key === "ArrowUp") {
    event.preventDefault();
    focusProjectLast();
  }
};

return(
    <>
        {focusImage && (
            <figure
                className="image-focus"
                role="dialog"
                aria-modal="true"
                aria-label={focusImage.label || "Expanded project image"}
                onClick={closeImage}
            >
                <img src={focusImage.src} alt={focusImage.alt || focusImage.label || "Project image"}/>
                <button
                    type="button"
                    className="hoverable image-focus-btn-exit"
                    onClick={closeImage}
                    ref={closeButtonRef}
                    aria-label={closeLabel}
                >
                    {language === "fr" ? "Fermer" : "Close"}
                </button>
                <button
                    type="button"
                    className="hoverable image-focus-btn-prev"
                    onClick={(e) => {e.stopPropagation(); showPrev();}}
                    aria-label="Show previous image"
                >
                    &lt;
                </button>
                <button
                    type="button"
                    className="hoverable image-focus-btn-next"
                    onClick={(e) => {e.stopPropagation(); showNext();}}
                    aria-label="Show next image"
                >
                    &gt;
                </button>
            </figure>
        )}

        {images?.length > 0 && (
            <div className="project-images">
                <div className="project-images-bleed" data-carousel-focus onKeyDown={handleArrowNavigation}>
                    <div className="project-images-carousel">
                        {images.map((image, i) =>
                        <figure 
                        key={i} 
                        className="project-figure hoverable" 
                        >
                                <button
                                  type="button"
                                  className="project-image-button"
                                  onClick={() => openImage(i)}
                                  data-carousel-button={i}
                                  aria-label={image.label ? `Open ${image.label}` : "Open project image"}
                                >
                                  <img
                                    src={image.src}
                                    alt={image.alt || image.label || `Project image ${i + 1}`}
                                    className="project-image"
                                  />
                                </button>
                                {image.label && <figcaption className="project-image-caption">{image.label}</figcaption>}
                            </figure>  
                        )}
                    </div>
                </div>
            </div>
        )}
</>
);
}
