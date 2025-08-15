import "../../../app/globals.css";
import styles from "../../css-modules/loginpage.module.css";

// import { register } from "../../../actions/userservice";
// import React, { useActionState } from "react";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { addToast } from "../../../redux/store";
// import { useSearchParams } from "next/navigation";
import ClientToastHandler from "@/components-ui/ClientToastHandler";

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <ClientToastHandler />
      <h1 className={styles.title}>Login</h1>
      <form className={styles.form}>
        <input className={styles.input} placeholder="Email" />
        <input
          className={styles.input}
          placeholder="Password"
          type="password"
        />
        <button className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
