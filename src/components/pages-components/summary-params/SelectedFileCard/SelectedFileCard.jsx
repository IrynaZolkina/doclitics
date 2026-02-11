import styles from "./SelectedFileCard.module.css";

import Paper from "@/components-ui/svg-components/Paper";
import Eye1 from "@/components-ui/svg-components/Eye1";
import EyeOff1 from "@/components-ui/svg-components/EyeOff1";
import PulseIndicator from "@/components-ui/z-others/PulseIndicator";
import { formatBytes } from "@/lib/formatBytes";

export default function SelectedFileCard({ fileMeta, openViewer, onToggle }) {
  return (
    <div className={styles.blockWrapper}>
      <div className={styles.blockLargeContainer}>
        <h2>Selected File:</h2>

        <div className={styles.fileBlockSmallContainer}>
          <div className={styles.fileNameContainer}>
            <div className={styles.svgContainer}>
              <Paper width={"50px"} height={"33px"} />
            </div>

            <div>
              <h4>{fileMeta?.name || ""}</h4>

              <div className={styles.fileDetails}>
                {fileMeta?.type === "application/pdf" ? "PDF" : ""}

                <span className={styles.dot} />

                <span className={styles.fileSize}>
                  {fileMeta?.size > 0 ? formatBytes(fileMeta.size) : ""}
                </span>

                <span className={styles.dot} />

                <span className={styles.ready}>
                  <PulseIndicator />
                  Ready
                </span>
              </div>
            </div>
          </div>

          <div>
            <button className={styles.buttonPdfViewer} onClick={onToggle}>
              <span className={styles.buttonInside}>
                {openViewer ? <Eye1 /> : <EyeOff1 />}
                <span className={styles.preview}>
                  {openViewer ? "Close Preview" : "Preview File"}
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className={styles.blueLine} />
      </div>
    </div>
  );
}
