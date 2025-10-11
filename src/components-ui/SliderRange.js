import { useState, useRef, useEffect } from "react";
import styles from "./css-modules/SliderRange.module.css";

export default function SliderRange({
  min = 0,
  max = 100,
  step = 10,
  initial = 50,
  value,
  setValue,
}) {
  // const [value, setValue] = useState(initial);
  const [percent, setPercent] = useState(((initial - min) / (max - min)) * 100); // 👈 initialize correctly
  const sliderRef = useRef();

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setValue(val);
    const newPercent = ((val - min) / (max - min)) * 100;
    setPercent(newPercent);
  };

  // Update CSS variable for the gradient
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--percent", `${percent}%`);
    }
  }, [percent]);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWrapper}>
        {/* <div
          className={styles.valueLabel}
          style={{
            left: `calc(${percent}% )`,
          }}
        >
          {value} Words
        </div> */}
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={styles.slider}
        />
      </div>
    </div>
  );
}
