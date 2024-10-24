import React, {useState} from "react";
import httpClient from "../httpClient";

const RegisterPage: React.FC = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const registerUser = async () => {

        try {
            const resp = await httpClient.post("//localhost:5000/register", {
                email,
                password,
            });

            window.location.href = "/";
        }
        catch (error: any) {
            if(error.response.status === 401){ 
                alert("Invalid credentials");
            }
    }
};

    return (
        <>
            <h1>Create an account</h1>
            <form action="">
                <div>
                    <label>Email: </label>
                    <input 
                        type="text" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        id=""
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        id=""
                    />
                </div>
                <button type="button" onClick={() => registerUser()}>Submit</button>
            </form>
        </>
    );
};

export default RegisterPage;