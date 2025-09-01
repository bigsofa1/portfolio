export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }
};

export const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.3 } }
};
