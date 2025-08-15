import { activate } from "@/actions/userservice";
import { getCollection } from "@/lib/db";
import { redirect } from "next/navigation";

const Activated = async ({ params }) => {
  const { link } = await params;
  console.log("---  link ---", link);

  const users = await getCollection("users");

  const user = await users.findOne({
    activationLink: link,
    isActivated: false,
  });

  if (!user) {
    redirect("/login?error=invalid_token");
  }

  if (new Date() > user.activationExpires) {
    await users.deleteOne({ _id: user._id });
    return NextResponse.json(
      { error: "Activation link expired" },
      { status: 400 }
    );
  }

  // activate(link);
  redirect("/login?activated=1");
  return (
    <div>
      <h1>Activated</h1>
    </div>
  );
};
export default Activated;
