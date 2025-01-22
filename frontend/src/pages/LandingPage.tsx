import React, {useState, useEffect} from "react";
import { User } from "../types";
import httpClient from "../httpClient";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: string;
};

const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    (async() => {
      try {
        const resp = await httpClient.get("//localhost:5000/@me");
        setUser(resp.data);
        if (resp.data) {
          const tasksResp = await httpClient.get(`//localhost:5000/tasks?user_id=${resp.data.id}`);
          setTasks(tasksResp.data);
        }
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

  const addTask = async () => { 
    window.location.href = "/AddTask";
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
          <button onClick={addTask}>Add Task</button>
          <div>
            <h2>Tasks</h2>
            {tasks.length > 0 ? (
              <ul>
                {tasks.map(task => (
                  <li key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>{task.priority}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks found</p>
            )}
          </div>
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