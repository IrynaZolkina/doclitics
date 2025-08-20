import "../app/globals.css";
import styles from "./css-modules/inputsection.module.css";
import { GoogleIcon } from "./svg-components/GoogleIcon";
import { GreenCheckIcon } from "./svg-components/GreenCheckIcon";
import { RedXIcon } from "./svg-components/RedXIcon";

export default function InputSection(props) {
  const {
    id,
    enteredValue,
    setEnteredValue,
    labelText,
    touched,
    setTouched,
    inputType,
    validation,
    validationCheck,
    fieldLength,
    inputText,
    placeholder = "",
    correctMessage,
  } = props;

  const enteredValueIsValid = enteredValue.trim() !== "";

  console.log("-----enteredValue.lenght-----", enteredValue.lenght);
  const inputChangeHandler = (e) => {
    // if (enteredValue.lenght < fieldLength) {
    setEnteredValue(e.target.value);
    validation(e.target.value);
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
        <h3>{labelText}</h3>
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

          <span>
            {validationCheck === 1 ? (
              <GreenCheckIcon stroke={"rgba(93, 150, 246, 1)"} />
            ) : validationCheck === 2 ? (
              <RedXIcon />
            ) : (
              <GreenCheckIcon stroke={"#0e1625"} />
              // <GoogleIcon size={20} />
            )}
          </span>
        </div>
        <p>{validationCheck === 2 ? correctMessage : " "}</p>
        {inputText && <p className={styles.errorText}>Enter {inputText}</p>}
        {!enteredValueIsValid && touched && (
          <p className={styles.errorText}></p>
        )}
      </div>
    </div>
  );
}
