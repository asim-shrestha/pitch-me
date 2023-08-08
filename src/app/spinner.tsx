import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

function LoadingSpinner({ timer, totalDuration }: { timer: number, totalDuration: number }) {
  const controls = useAnimation();

  useEffect(() => {
    const percentage = (timer / totalDuration) * 100;
    controls.start({ pathLength: percentage / 100 }).then(r => console.log(r));
  }, [timer, controls, totalDuration]);

  return (
    <motion.svg
      className="circle"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        fill="none"
        strokeWidth="4"
        stroke="currentColor"
        d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
        strokeLinecap="round"
        initial={false}
        animate={controls}
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1 },
        }}
      />
    </motion.svg>
  );
}

export default LoadingSpinner;