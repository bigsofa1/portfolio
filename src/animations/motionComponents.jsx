// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Section with inherited variants
export const MotionSection = ({ children, ...props }) => (
  <motion.section {...props}>{children}</motion.section>
);

// Div with inherited variants
export const MotionDiv = ({ children, ...props }) => (
  <motion.div {...props}>{children}</motion.div>
);