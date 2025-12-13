import "./Create.scss";
import { useState, useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";


const Create = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(title);
        console.log(content);
        //placeholder id until challenge id and user id is implemented
        const tempUserid = "123abc";
        const tempChallengeid = "125abc";
        const token = localStorage.getItem("token");

        const newPost = {title, content, userId: tempUserid, challengeId: tempChallengeid};

        try {
            const response = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(newPost),
            });

            const result = await response.json();
            console.log("Post created", result);

            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    

    const { darkMode } = useContext(DarkModeContext);

    return (
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
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
        </div>
    );
}

export default Create;
