import "./Create.scss";
import { useState } from "react";

const Create = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(title);
        console.log(content);
    };

    return (
        <div className="create">
            <div className="card">
                <h1>Create A New Post</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} />

                    <textarea  
                    placeholder="Write about your challenge here..."
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}  />
                    <button>Create Post</button>
                </form>
            </div>
        </div>
    );
}

export default Create;
