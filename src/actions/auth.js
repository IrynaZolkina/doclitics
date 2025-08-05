"use server";

import { getCollection } from "@/lib/db";

export async function register(state, formData) {
  //   await new Promise((resolve) => setTimeout(resolve, 3000));
  const email = formData.get("email");
  const password = formData.get("password");

  // validate data

  const userCollection = await getCollection("users1");
  const result = await userCollection.insertOne({ email, password });

  console.log("result---", result);
  //   console.log("userCollection---", userCollection);

  return (
    <div>
      {console.log("Register action called")}
      {console.log(email)}
      {console.log(password)}
    </div>
  );
}
