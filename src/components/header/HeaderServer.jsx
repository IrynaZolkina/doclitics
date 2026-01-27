// HeaderServer.jsx (server)
import { Suspense } from "react";
import Header from "./Header";

export default function HeaderServer({ user }) {
  // console.log("HeaderServer rendering with user:", user);
  const safeUser = user ? { ...user, _id: user._id.toString() } : null;
  //const safeUser = user;
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Header user={safeUser} />
    </Suspense>
  );
}
