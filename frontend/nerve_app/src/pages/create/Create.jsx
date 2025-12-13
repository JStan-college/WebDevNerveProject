import "./Create.scss";
import { useState, useContext, useEffect } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";


const Create = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    const { user } = useContext(AuthContext);
    const { loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // If we've finished loading auth and there's no user, redirect to login
        if (loading === false && !user) {
            navigate('/login');
        }
    }, [loading, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(title);
        console.log(content);
        // Ensure user exists (server will also verify token)
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        const token = localStorage.getItem("token");
        const tempChallengeid = "125abc";
        // Do NOT send userId from client - server derives author from token
        const newPost = { title, content, challengeId: tempChallengeid };

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
