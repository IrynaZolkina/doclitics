"use client";
import { register } from "../../../actions/auth";
import React, { useActionState } from "react";

const Register = () => {
  const [state, action, isPending] = useActionState(register, undefined);

  return (
    <div>
      <h1>Register</h1>
      <form action={action}>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" />
        <label htmlFor="password">password</label>
        <input type="text" name="password" />
        {/* <label htmlFor="email">Email</label>
      <input type='text' name='email'/> */}

        <button disabled={isPending}>
          {isPending ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
