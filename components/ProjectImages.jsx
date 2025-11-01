import { useCallback, useEffect, useState } from "react"
import { fadeIn } from "../src/animations"

export default function ProjectImages({ images = [] }){

const [focusIndex, setFocusIndex] = useState(null)

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

if  (!images.length) return null;
return(
    <>
        {focusImage && (
            <figure className="image-focus" onClick={closeImage}>
                <img src={focusImage.src} alt={focusImage.label || ""}/>
                <button type="button" className="hoverable image-focus-btn-exit" onClick={closeImage}>x</button>
                <button type="button" className="hoverable image-focus-btn-prev" onClick={(e) => {e.stopPropagation(); showPrev();}}>&lt;</button>
                <button type="button" className="hoverable image-focus-btn-next" onClick={(e) => {e.stopPropagation(); showNext();}}>&gt;</button>
            </figure>
        )}

        {images?.length > 0 && (
            <div className="project-images">
                <div className="project-images-bleed">
                    <div className="project-images-carousel">
                        {images.map((image, i) =>
                        <figure 
                        key={i} 
                        className="project-figure hoverable" 
                        variants={fadeIn} 
                        custom={i} 
                        initial="hidden" 
                        animate="visible" 
                        exit="exit"
                        >
                                <img onClick={() => openImage(i)} src={image.src} alt={image.label || ""} className="project-image" />
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
