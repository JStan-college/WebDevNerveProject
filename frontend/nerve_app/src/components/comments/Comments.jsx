import "./comments.scss";
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";


const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        if (!postId) return;
        
        const getComments = async () => {
            const url = `http://localhost:8080/api/comments?postId=${postId}`;
            try {
                const response = await fetch(url, {
                    method: "GET",
                });
                const result = await response.json();
                setComments(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error("error fetching comments", error);
                setComments([]);
            }
        };

        getComments();
    }, [postId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            alert("Please log in to comment");
            navigate('/login');
            return;
        }

        if (!commentText.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:8080/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: commentText,
                    postId: postId
                })
            });

            if (response.ok) {
                const newComment = await response.json();
                setComments([newComment, ...comments]);
                setCommentText("");
            } else {
                alert("Failed to add comment");
            }
        } catch (error) {
            console.error("error adding comment", error);
            alert("Error adding comment");
        }
    };

    return (
        <div className="comments">
            {isLoggedIn ? (
                <form className="write" onSubmit={handleAddComment}>
                    <input 
                        type="text" 
                        placeholder="write a comment" 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button type="submit">Send</button>
                </form>
            ) : (
                <div className="write login-prompt">
                    <p>Log in to comment</p>
                    <button onClick={() => navigate('/login')}>Login</button>
                </div>
            )}
            {comments && comments.length > 0 ? (
                comments.map(comment => (
                    <div className="comment" key={comment._id}>
                        <img src={comment.profilePicture || "https://via.placeholder.com/32"} alt="" />
                        <div className="info">
                            <p>{comment.content}</p>
                        </div>
                        <span className="date">1 hour ago</span>
                    </div>
                ))
            ) : (
                <div className="no-comments">No comments yet</div>
            )}
        </div>
    )
};

export default Comments;