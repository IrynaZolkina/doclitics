"use server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { getCollection } from "@/lib/db";
import { sendActivationMail } from "./mailservice";
import { generateToken, saveTokenToDB } from "./tokenservice";

export async function register(state, formData) {
  //   await new Promise((resolve) => setTimeout(resolve, 3000));
  const email = formData.get("email");
  const password = formData.get("password");
  const enteredUsername = formData.get("enteredUsername");
  console.log("^^^^^^^^^---", enteredUsername);
  // validate data

  const userCollection = await getCollection("users");

  const candidate = await userCollection.findOne({ email: email });
  console.log("candidate---", candidate);
  if (candidate) {
    console.log(`User already exists ${email}---`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 3);
  const activationLink = uuidv4();
  const result = await userCollection.insertOne({
    email,
    password: hashedPassword,
    activationLink,
    isActivated: false,
  });
  await sendActivationMail(
    email,
    `${process.env.API_URL}/activated/${activationLink}`
  );
  // console.log("uuid---", uuid);
  // console.log("result---", result.insertedId);
  //   console.log("userCollection---", userCollection);
  const tokens = await generateToken({
    userId: result.insertedId,
    email,
    activationLink,
  });
  const refreshToken = tokens.refreshToken;

  // const user = { userId: result.insertedId, email, activationLink };
  saveTokenToDB(result.insertedId, refreshToken);

  // console.log("...tokens---", { ...tokens });
  // console.log("...user---", user);

  return enteredUsername;
  // <div>
  //   {console.log("Register action called")}
  //   {console.log(email)}
  //   {console.log(password)}
  // </div>
}
export async function activate(activationLink) {
  // console.log("****n link *****", link);
  // const activationLink = link.lastIndexOf("/") + 1;

  const userCollection = await getCollection("users");
  console.log("****n activationlink *****", activationLink);
  // const candidate = await userCollection.findOne({ email: email });

  // const client = await MongoClient.connect(process.env.MONGODB_URL);

  // const db = client.db();
  const user = await userCollection.findOne({ activationLink });
  // if (!user) {
  //   client.close();
  //   return;
  // }
  await userCollection.updateOne(
    { activationLink },
    { $set: { isActivated: true } }
  );
  // client.close();oll
}
