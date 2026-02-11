import styles from "./DocumentTypeSelector.module.css";

export default function DocumentTypeSelector({
  documentTypes,
  activeIndexType,
  onChange,
}) {
  return (
    <div className={styles.blockWrapper}>
      <div className={styles.blockLargeContainer}>
        <h2>Document Type</h2>
        <p>Select the type that best matches your document</p>

        <div className={styles.typeBlockSmallContainer}>
          {documentTypes.map((item, index) => (
            <div
              key={index}
              onClick={() => onChange(index)}
              className={`${styles.chooseButtonContainer} ${
                activeIndexType === index ? styles.active : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onChange(index);
              }}
            >
              <h6>{item.emoji}</h6>
              <div>{item.title}</div>
              <p>{item.par}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
