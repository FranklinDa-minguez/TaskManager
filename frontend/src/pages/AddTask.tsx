import { useState } from 'react';
import httpClient from "../httpClient";

const AddTask: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('5');

    const submitTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resp = await httpClient.post("//localhost:5000/tasks", {
                title,
                description,
                Priority: parseInt(priority)
            });
            window.location.href = "/";
        } catch (error) {
            console.error("Error submitting task:", error);
        }
    }

    return (
        <>
            <h1>Add a task</h1>
            <form onSubmit={submitTask}>
                <div>
                    <label>Task: </label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description: </label>
                    <input 
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Priority</label>
                    <input 
                        type="range"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        min="1"
                        max="10"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default AddTask;