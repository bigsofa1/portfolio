// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export const MotionSection = ({ children, ...props }) => (
  <motion.section {...props}>{children}</motion.section>
);

export const MotionDiv = ({ children, ...props }) => (
  <motion.div {...props}>{children}</motion.div>
);

export const MotionNav = ({ children, ...props }) => (
  <motion.nav {...props}>{children}</motion.nav>
);

export const MotionUl = ({ children, ...props }) => (
  <motion.ul {...props}>{children}</motion.ul>
);

export const MotionLi = ({ children, ...props }) => (
  <motion.li {...props}>{children}</motion.li>
);

export const MotionButton = ({ children, ...props }) => (
  <motion.button {...props}>{children}</motion.button>
);

export const MotionFigure = ({ children, ...props }) => (
  <motion.figure {...props}>{children}</motion.figure>
);