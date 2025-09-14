"use client";

import Popup from "./Popup";
import { useState } from "react";
import styles from "./Popup.module.css";

export default function Home() {
  const [popup, setPopup] = useState(null);

  const showPopup = () => {
    const newPopup = {
      id: Date.now(),
      message: "This popup will disappear in 10s",
    };
    setPopup(newPopup);

    setTimeout(() => {
      setPopup(null); // remove popup after 10 seconds
    }, 5000);
  };

  return (
    <div style={{ marginTop: "200px" }}>
      <h1>Popup Example</h1>
      <button onClick={showPopup}>Show Popup</button>

      {popup && <div className={styles.popup}>{popup.message}</div>}
    </div>
  );
}
