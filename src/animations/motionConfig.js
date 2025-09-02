export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.3, ease: "easeIn"} }
};

export const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
  exit: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1, // reverse 
    },
  },
};
