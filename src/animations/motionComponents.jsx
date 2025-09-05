/* eslint-disable no-unused-vars */
// motionWrappers.js
import { motion } from "framer-motion";

const createMotionComponent = (Component) => {
  return ({ children, ...props }) => (
    <Component {...props}>{children}</Component>
  );
};

export const MotionSection = createMotionComponent(motion.section);
export const MotionDiv = createMotionComponent(motion.div);
export const MotionNav = createMotionComponent(motion.nav);
export const MotionUl = createMotionComponent(motion.ul);
export const MotionLi = createMotionComponent(motion.li);
export const MotionButton = createMotionComponent(motion.button);
export const MotionFigure = createMotionComponent(motion.figure);
export const MotionDl = createMotionComponent(motion.dl);
export const MotionDt = createMotionComponent(motion.dt);
export const MotionDd = createMotionComponent(motion.dd);
export const MotionSpan = createMotionComponent(motion.span);
