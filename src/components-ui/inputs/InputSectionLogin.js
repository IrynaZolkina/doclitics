"use client";

import styles from "./inputsection.module.css";
// import { GreenCheckIcon } from "./svg-components/GreenCheckIcon";
// import { RedXIcon } from "./svg-components/RedXIcon";

export default function InputSectionLogin(props) {
  const {
    id,
    enteredValue,
    setEnteredValue,
    labelText,
    touched,
    setTouched,
    inputType,

    fieldLength,
    inputText,
    placeholder = "",
  } = props;

  const enteredValueIsValid = enteredValue.trim() !== "";

  // console.log("-----enteredValue.lenght-----", enteredValue.lenght);
  const inputChangeHandler = (e) => {
    // if (enteredValue.lenght < fieldLength) {
    setEnteredValue(e.target.value);

    // }
    setTouched(true);
  };

  const inputBlurHandler = (e) => {
    setTouched(true);
  };

  return (
    <div className={`${styles.controlGroup} ${props.className}`}>
      <div
        className={`${styles.formControl} ${
          !enteredValueIsValid && touched && styles.formControlInvalid
        }`}

        // className={
        //   !enteredTitleIsValid && touched
        //     ? styles.formControlInvalid
        //     : styles.formControl
        // }
      >
        <h3 style={{ textAlign: "left" }}>{labelText}</h3>
        {/* <label htmlFor={enteredValue}>{labelText}</label> */}
        <div className={styles.inputAndIcon}>
          <input
            id={id}
            type={inputType}
            value={enteredValue}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler}
            maxLength={fieldLength}
            placeholder={placeholder}
          />
        </div>

        {inputText && <p className={styles.errorText}>Enter {inputText}</p>}
        {!enteredValueIsValid && touched && (
          <p className={styles.errorText}></p>
        )}
      </div>
    </div>
  );
}
