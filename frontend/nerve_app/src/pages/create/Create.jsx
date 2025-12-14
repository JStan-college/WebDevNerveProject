import "./Create.scss";
import { useState, useContext, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';


const Create = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    const { user, todaysChallenge, loadingChallenge, reload } = useContext(AuthContext);
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
        // Client-side validation
        if (!title || !content) {
            toast.error('Title and content are required');
            return;
        }

        // Ensure user exists (server will also verify token)
        if (!user) {
            toast.error('You must be logged in to create a post');
            return;
        }

        const token = localStorage.getItem("token");
        // Use today's challenge from AuthContext when available
        const challengeId = (todaysChallenge && todaysChallenge._id) ? todaysChallenge._id : undefined;
        // Do NOT send userId from client - server derives author from token
        const newPost = { title, content, ...(challengeId ? { challengeId } : {}) };

        const hadChallenge = Boolean(todaysChallenge);
        try {
            const response = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(newPost),
            });

            const result = await response.json();
            if (!response.ok) {
                console.error('Create failed', result);
                toast.error(result?.message || 'Failed to create post');
                return;
            }

            toast.success('Post created successfully');
            console.log("Post created", result);

            setTitle("");
            setContent("");
            // If the server returned an updated user, check if the challenge was cleared
            if (hadChallenge && result.user && !result.user.challengeToday) {
                toast.success("Great job — you completed today's challenge!");
            }
            // Update auth state (reload will fetch fresh challenge)
            if (reload) await reload();
            // navigate back to home after successful creation
            navigate('/');
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    

    const { darkMode } = useContext(DarkModeContext);

        return (
                <div className={`theme-${darkMode ? "dark" : "light"}`}>
                    <div className="create">
                        <div className="card">
                                <button className="back-button" onClick={() => navigate('/')} aria-label="Close">
                                    <CloseOutlinedIcon />
                                </button>
                                <h1>Create A New Post</h1>
                                {loadingChallenge ? (
                                    <div className="challenge-box loading">Loading today's challenge...</div>
                                ) : todaysChallenge ? (
                                    <div className="challenge-box">
                                        <strong>Today's Challenge:</strong>
                                        <div className="ch-title">{todaysChallenge.title}</div>
                                        <div className="ch-genre">{todaysChallenge.genre}</div>
                                    </div>
                                ) : (
                                    <div className="challenge-box empty">No challenge assigned</div>
                                )}
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
