export const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.25,   
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.25,
      staggerDirection: -1, // reverse 
    },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => {
    const {
      delay = 0.2,
      duration = 0.5,
      ease = "easeInOut",
      opacity = 1,
    } = custom;
    return {
      opacity,
      transition: { duration, ease, delay },
    };
  },
  exit: (custom = {}) => {
    const {
      exitDelay = 0.1,
      exitDuration = 0.3,
      exitEase = "easeIn",
      exitOpacity = 0,
    } = custom;
    return {
      opacity: exitOpacity,
      transition: { duration: exitDuration, ease: exitEase, delay: exitDelay },
    };
  },
};
