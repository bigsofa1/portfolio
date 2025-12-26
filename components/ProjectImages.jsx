import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {AnimatePresence, LayoutGroup, motion} from "framer-motion"
import {buildImageUrl} from "../src/lib/imageUrl"

const MotionImg = motion.img
const MotionFigure = motion.figure
const MotionDiv = motion.div

export default function ProjectImages({images = [], language = "en"}) {
    const [focusIndex, setFocusIndex] = useState(null)
    const [isClosing, setIsClosing] = useState(false)
    const closeTimerRef = useRef(null)
    const closeButtonRef = useRef(null)
    const scrollThreshold = 35
    const scrollStepSize = 100
    const scrollAccumulator = useRef(0)
    const touchStartRef = useRef(null)
    const touchAccumulator = useRef(0)
    const touchThreshold = 50
    const touchStepSize = 130

    const normalizedImages = useMemo(() => {
        return images.map((img, idx) => {
            const imageSource = img.image || img.asset || img
            const alt = img.alt || img.label || `Project image ${idx + 1}`
            return {
                id: img._id || img.id || img.asset?._ref || idx,
                image: imageSource,
                alt,
                label: img.label,
                fallbackUrl: img.src || img.srcFull || img.url,
            }
        })
    }, [images])

    const getImageSrc = useCallback(
        (imageDoc, {width, height, quality = 85} = {}) =>
            buildImageUrl(imageDoc?.image, {
                width,
                height,
                quality,
                fit: "max",
            }) || imageDoc?.fallbackUrl || "",
        [],
    )

    const focusImage =
        focusIndex !== null && normalizedImages.length
            ? normalizedImages[focusIndex % normalizedImages.length]
            : null
    const focusSrc = focusImage ? getImageSrc(focusImage, {width: 2400, quality: 100}) : ""

    const openImage = useCallback(
        (index) => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
                closeTimerRef.current = null
            }
            setIsClosing(false)
            setFocusIndex(index)
        },
        [],
    )

    const closeImage = useCallback(() => {
        if (focusIndex === null) return
        setIsClosing(true)
        closeTimerRef.current = setTimeout(() => {
            setFocusIndex(null)
            setIsClosing(false)
            closeTimerRef.current = null
        }, 200)
    }, [focusIndex])

    const showNext = useCallback(() => {
        if (!normalizedImages.length) return
        setFocusIndex((prev) => (prev === null ? 0 : (prev + 1) % normalizedImages.length))
    }, [normalizedImages.length])

    const showPrev = useCallback(() => {
        if (!normalizedImages.length) return
        setFocusIndex((prev) => {
            if (prev === null) return 0
            return (prev - 1 + normalizedImages.length) % normalizedImages.length
        })
    }, [normalizedImages.length])

    useEffect(() => {
        if (focusIndex === null) return

        if (closeButtonRef.current) {
            closeButtonRef.current.focus()
        }

        const handleKey = (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault()
                showNext()
            } else if (event.key === "ArrowLeft") {
                event.preventDefault()
                showPrev()
            } else if (event.key === "Escape") {
                event.preventDefault()
                closeImage()
            }
        }

        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [focusIndex, showNext, showPrev, closeImage])

    useEffect(() => {
        if (focusIndex === null) return

        const handleWheel = (event) => {
            const primaryDelta =
                Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX

            scrollAccumulator.current += primaryDelta

            if (Math.abs(scrollAccumulator.current) < scrollThreshold) return

            event.preventDefault()
            const steps = Math.max(1, Math.floor(Math.abs(scrollAccumulator.current) / scrollStepSize))
            if (scrollAccumulator.current > 0) {
                for (let i = 0; i < steps; i += 1) showNext()
            } else {
                for (let i = 0; i < steps; i += 1) showPrev()
            }
            scrollAccumulator.current = 0
        }

        window.addEventListener("wheel", handleWheel, {passive: false})
        return () => window.removeEventListener("wheel", handleWheel)
    }, [focusIndex, showNext, showPrev])

    useEffect(() => {
        if (focusIndex === null) return

        const handleTouchStart = (event) => {
            if (event.touches.length > 1) {
                touchStartRef.current = null
                return
            }
            const touch = event.touches[0]
            touchStartRef.current = {x: touch.clientX, y: touch.clientY}
        }

        const handleTouchMove = (event) => {
            if (event.touches.length > 1) return
            if (!touchStartRef.current) return

            const touch = event.touches[0]
            const deltaX = touchStartRef.current.x - touch.clientX
            touchAccumulator.current += deltaX

            if (Math.abs(touchAccumulator.current) >= touchThreshold) {
                event.preventDefault()
                const steps = Math.max(1, Math.floor(Math.abs(touchAccumulator.current) / touchStepSize))
                const goNext = touchAccumulator.current > 0
                for (let i = 0; i < steps; i += 1) {
                    goNext ? showNext() : showPrev()
                }
                touchAccumulator.current = 0
                touchStartRef.current = {x: touch.clientX, y: touch.clientY}
            }
            touchStartRef.current = {x: touch.clientX, y: touch.clientY}
        }

        const handleTouchEnd = () => {
            touchStartRef.current = null
            touchAccumulator.current = 0
        }

        window.addEventListener("touchstart", handleTouchStart, {passive: false})
        window.addEventListener("touchmove", handleTouchMove, {passive: false})
        window.addEventListener("touchend", handleTouchEnd)

        return () => {
            window.removeEventListener("touchstart", handleTouchStart)
            window.removeEventListener("touchmove", handleTouchMove)
            window.removeEventListener("touchend", handleTouchEnd)
        }
    }, [focusIndex, showNext, showPrev])

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
            }
        }
    }, [])

    if (!normalizedImages.length) return null
    const closeLabel = language === "fr" ? "Fermer l'image" : "Close image"

    return (
        <>
            {focusIndex !== null && focusImage && (
                <figure
                    className={`image-focus ${isClosing ? "image-focus--closing" : ""}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={focusImage.label || "Expanded project image"}
                    onClick={closeImage}
                >
                    <div className="image-focus__thumbs-row" onClick={(e) => e.stopPropagation()}>
                        <div className="image-focus__thumbs" role="list">
                            {normalizedImages.map((img, idx) => (
                                <button
                                    key={img.id}
                                    type="button"
                                    className={`image-focus__thumb ${idx === focusIndex ? "is-active" : ""}`}
                                    onClick={() => setFocusIndex(idx)}
                                    aria-label={`Go to image ${idx + 1}`}
                                    role="listitem"
                                >
                                    <img
                                        src={getImageSrc(img, {width: 120, quality: 60})}
                                        alt={img.alt}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <img
                        src={focusSrc}
                        alt={focusImage.alt || focusImage.label || "Project image"}
                        className="project-image"
                    />
                    <button
                        type="button"
                        className="hoverable image-focus-btn-prev"
                        onClick={(e) => {
                            e.stopPropagation()
                            showPrev()
                        }}
                        aria-label={language === "fr" ? "Image précédente" : "Show previous image"}
                    >
                        &lt;
                    </button>
                    <button
                        type="button"
                        className="hoverable image-focus-btn-next"
                        onClick={(e) => {
                            e.stopPropagation()
                            showNext()
                        }}
                        aria-label={language === "fr" ? "Image suivante" : "Show next image"}
                    >
                        &gt;
                    </button>
                    <button
                        type="button"
                        className="hoverable image-focus-btn-exit"
                        onClick={(e) => {
                            e.stopPropagation()
                            closeImage()
                        }}
                        ref={closeButtonRef}
                        aria-label={closeLabel}
                    >
                        {language === "fr" ? "Fermer" : "Close"}
                    </button>
                </figure>
            )}

            {normalizedImages.length > 0 && (
                <LayoutGroup>
                    <div className="project-images">
                        <AnimatePresence mode="wait" initial={false}>
                            <MotionDiv
                                key="carousel-view"
                                className="project-images-list project-images-list--carousel"
                                role="list"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.15, ease: "easeOut"}}
                            >
                                {normalizedImages.map((img, idx) => (
                                    <MotionFigure
                                        key={img.id}
                                        className="project-figure project-figure--carousel"
                                        role="listitem"
                                    >
                                        <MotionImg
                                            layoutId={`carousel-${img.id}`}
                                            onClick={() => openImage(idx)}
                                            src={getImageSrc(img, {width: 1400, quality: 80})}
                                            alt={img.alt}
                                            className="project-image"
                                        />
                                    </MotionFigure>
                                ))}
                            </MotionDiv>
                        </AnimatePresence>
                    </div>
                </LayoutGroup>
            )}
        </>
    )
}
