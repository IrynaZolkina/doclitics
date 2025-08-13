import { activate } from "@/actions/userservice";

const Activated = async ({ params }) => {
  const { link } = await params;
  console.log("---  link ---", link);
  activate(link);
  return (
    <div>
      <h1>Activated</h1>
    </div>
  );
};
export default Activated;
