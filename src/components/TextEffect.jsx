import React, { useRef, useEffect, useState } from "react";

const TextEffect = ({ texts, delay = 200 }) => {
  const [display, setDisplay] = useState("");
  const ref = useRef({ speed: 1, endIndx: 0, textIdx: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const { speed, endIndx, textIdx } = ref.current;
      const currentText = texts[textIdx];

      if (endIndx === currentText.length) {
        ref.current.speed = -1; // start erasing
      }
      if (endIndx === 0 && speed === -1) {
        ref.current.speed = 1; // start typing next text
        ref.current.textIdx = (textIdx + 1) % texts.length;
      }

      ref.current.endIndx += ref.current.speed;
      const newText = texts[ref.current.textIdx].slice(0, ref.current.endIndx);
      setDisplay(newText);
    }, delay);

    return () => clearInterval(interval);
  }, [delay, texts]);

  return <>{display}</>;
};

export default TextEffect;
