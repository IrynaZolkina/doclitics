import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <h1 style={{ marginTop: "120px", textAlign: "center", display: "st" }}>
        Ready to Summarize Smarter?
      </h1>
      {children}
    </div>
  );
};

export default Layout;
