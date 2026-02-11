// "use server";

export const validateUserName = (value) => {
  const u = value?.trim() || "";
  if (!u) return "Username is required";
  if (!/^[a-zA-Z0-9_]{3,}$/.test(u))
    return "Username must be at least 3 characters and contain only letters, numbers, or underscores";
  return "";
};

export const validateEmail = (value) => {
  const e = value?.trim() || "";
  if (!e) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "Invalid email address";
  return "";
};

export const validatePassword = (value) => {
  const p = value?.trim() || "";
  if (!p) return "Password is required";
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/.test(p)
  )
    return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character, with no spaces";
  return "";
};
// import { v4 as uuidv4 } from "uuid";
// import bcrypt from "bcrypt";
// import { getCollection } from "@/lib/db";
// import { sendActivationMail } from "./mailservice";
// import { generateTokens, saveTokenToDB } from "./tokenservice";

// export async function register(state, formData) {
//   const email = formData.get("email");
//   const password = formData.get("password");
//   const enteredUsername = formData.get("enteredUsername");

//   const userCollection = await getCollection("users");

//   const candidate = await userCollection.findOne({ email: email });
//   console.log("candidate---", candidate);
//   if (candidate) {
//     console.log(`User already exists ${email}---`);
//     return;
//   }

//   const hashedPassword = await bcrypt.hash(password, 3);
//   const activationLink = uuidv4();
//   const result = await userCollection.insertOne({
//     email,
//     password: hashedPassword,
//     activationLink,
//     isActivated: false,
//   });
//   await sendActivationMail(
//     email,
//     `${process.env.API_URL}/activated/${activationLink}`
//   );
//   const tokens = await generateTokens({
//     userId: result.insertedId,
//     email,
//     activationLink,
//   });
//   const refreshToken = tokens.refreshToken;

//   saveTokenToDB(result.insertedId, refreshToken);

//   return enteredUsername;
// }
