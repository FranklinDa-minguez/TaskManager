import React from "react";

const LandingPage: React.FC = () => {
  return (
    <>
      <h1>Welcome</h1>
      <p>you are not logged in</p>
      <div className=" flex">
        <a href="/login">
          <button>login</button>
        </a>
        <a href="register">
          <button>register</button>
        </a>
      </div>
    </>
  );
};

export default LandingPage;