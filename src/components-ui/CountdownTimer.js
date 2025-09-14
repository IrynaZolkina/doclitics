import { useState, useEffect } from "react";

export default function CountdownTimer({ initialMinutes = 10, onEnd }) {
  const [time, setTime] = useState(initialMinutes * 60); // in seconds

  useEffect(() => {
    if (time <= 0) {
      if (onEnd) onEnd(); // callback when timer ends
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [time, onEnd]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <span style={{ fontSize: "18px", fontWeight: "bold" }}>
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
}
