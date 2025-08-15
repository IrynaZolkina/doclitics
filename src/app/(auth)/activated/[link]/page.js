import { activate } from "@/actions/userservice";
import { redirect } from "next/navigation";

const Activated = async ({ params }) => {
  const { link } = await params;
  console.log("---  link ---", link);

  // const users = await getCollection("users");

  // const user = await users.findOne({
  //   activationLink: activationLink,
  //   isActivated: false,
  // });
  // activate(link);
  redirect("/login?activated=1");
  return (
    <div>
      <h1>Activated</h1>
    </div>
  );
};
export default Activated;
