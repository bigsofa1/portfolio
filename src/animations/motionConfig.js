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
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn", delay:  0.1 }
  },
};
