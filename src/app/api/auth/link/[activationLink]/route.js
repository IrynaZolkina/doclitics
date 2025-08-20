// import { NextResponse } from "next/server";
// import { getCollection } from "@/lib/db";
// import { ObjectId } from "mongodb";

// export async function GET(req, { params }) {
//   const { activationLink } = await params;

//   const users = await getCollection("users");

//   const user = await users.findOne({
//     activationLink: activationLink,
//     isActivated: false,
//   });

//   if (!user) {
//     return NextResponse.json(
//       { error: "Invalid activation link" },
//       { status: 400 }
//     );
//   }

//   if (new Date() > user.activationExpires) {
//     await users.deleteOne({ _id: user._id });
//     return NextResponse.json(
//       { error: "Activation link expired" },
//       { status: 400 }
//     );
//   }

//   await users.updateOne(
//     { _id: user._id },
//     {
//       $set: { isActivated: true },
//       $unset: { activationLink: "", activationExpires: "" },
//     }
//   );

//   const result = await users.updateOne(
//     { _id: new ObjectId(user._id) },
//     {
//       $set: {
//         isActivated: true,
//       },
//       $unset: { activationLink: "", activationExpires: "" },
//     }
//   );
//   console.log("-----result-----", result);

//   return NextResponse.json({ message: "Account activated successfully" });
// }
