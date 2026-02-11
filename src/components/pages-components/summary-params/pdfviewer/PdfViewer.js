"use client";

import styles from "./PdfViewer.module.css";
import ArrLeft from "./ArrLeft";
import ArrRight from "./ArrRight";
import Arrowleft from "./Arrowleft";
import Arrowright from "./Arrowright";

export function PdfViewer({ viewer }) {
if (!viewer.open) return null;

  return (
    <div className={styles.viewerWrapper}>
      <div className={styles.controls}>
        <button
          onClick={() => viewer.setPage((p) => Math.max(1, p - 1))}
          disabled={viewer.page <= 1}
        >
          <ArrLeft />
        </button>

        <span>
          {viewer.page} / {viewer.totalPages}
        </span>

        <button
          onClick={() =>
            viewer.setPage((p) =>
              Math.min(viewer.totalPages, p + 1),
            )
          }
          disabled={viewer.page >= viewer.totalPages}
        >
          <ArrRight />
        </button>

        <div className={styles.divider} />

        <button onClick={viewer.rotateCCW}>
          <Arrowright />
        </button>
        <button onClick={viewer.rotateCW}>
          <Arrowleft />
        </button>
        <button onClick={viewer.zoomOut} title="Zoom out">
  −
</button>

<span>{Math.round(viewer.scale * 100)}%</span>

<button onClick={viewer.zoomIn} title="Zoom in">
  +
</button>
<button onClick={viewer.resetZoom} title="Reset zoom">
  ⤾
</button>
      </div>

      <div className={styles.canvasContainer}>
        <canvas ref={viewer.canvasRef} />
      </div>
    </div>
  );
}
