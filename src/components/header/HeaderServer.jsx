// HeaderServer.jsx (server)
import Header from "./Header";

export default function HeaderServer({ user }) {
  // console.log("HeaderServer rendering with user:", user);
  const safeUser = user ? { ...user, _id: user._id.toString() } : null;
  //const safeUser = user;
  return <Header user={safeUser} />;
}
