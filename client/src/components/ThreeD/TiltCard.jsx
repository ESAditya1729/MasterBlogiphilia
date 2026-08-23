import React, { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

const SPRING = { stiffness: 260, damping: 22, mass: 0.6 };

const TiltCard = ({
  children,
  className = "",
  maxTilt = 10,
  scale = 1.02,
  glare = true,
  glareMaxOpacity = 0.25,
  lift = 6,
}) => {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), SPRING);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,${glareMaxOpacity}), transparent 55%)`;

  const handleMove = useCallback(
    (e) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      px.set(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
      py.set(Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)));
    },
    [px, py]
  );

  const handleLeave = useCallback(() => {
    px.set(0.5);
    py.set(0.5);
  }, [px, py]);

  return (
    <div className="[perspective:1200px]">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={{ scale, z: lift }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative transition-shadow duration-300 will-change-transform ${className}`}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TiltCard;
