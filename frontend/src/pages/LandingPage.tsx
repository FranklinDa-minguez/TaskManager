import React, {useState, useEffect} from "react";
import { User } from "../types";
import httpClient from "../httpClient";

const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async() => {
      try {
        const resp = await httpClient.get("//localhost:5000/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })()
  }, []);

  const logoutuser = async () => {
    const resp = await httpClient.post("//localhost:5000/logout");
    window.location.href = "/";
    setUser(null);
  }

  return (
    <>
      <h1>Welcome</h1>
      {user !== null ? (
        <div>
          <h2>Logged in</h2>
          <h3>you are logged in as {user.email}</h3>
          <h3>ID: {user.id}</h3>
          <button onClick={logoutuser}>logout</button>
        </div>
      ) : (
        <div>
        <p>you are not logged in</p>
        <div className=" flex">
          <a href="/login">
            <button>login</button>
          </a>
          <a href="register">
            <button>register</button>
          </a>
        </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;