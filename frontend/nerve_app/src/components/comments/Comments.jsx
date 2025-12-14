import "./comments.scss";
import {useState, useEffect, useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { timeAgoOrDate } from "../../utils/date";
import { AuthContext } from "../../context/authContext";
import { MoreHoriz } from "@mui/icons-material";


const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userMap, setUserMap] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
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
                const commentsArray = Array.isArray(result) ? result : [];
                setComments(commentsArray);
                fetchUsernames(commentsArray);
            } catch (error) {
                console.error("error fetching comments", error);
                setComments([]);
            }
        };

        getComments();
    }, [postId]);

    const fetchUsernames = async (commentsToFetch) => {
        // batch-fetch unique users for these comments
        const userIds = Array.from(new Set(commentsToFetch.map(c => c.user_id).filter(Boolean)));
        if (userIds.length > 0) {
            try {
                const userFetches = userIds.map(id => fetch(`http://localhost:8080/api/users/${id}`).then(r => r.ok ? r.json() : null));
                const users = await Promise.all(userFetches);
                const map = {};
                users.forEach(u => { if (u && (u.id || u._id)) map[u.id || u._id] = u.username || u.name || null; });
                setUserMap(map);
            } catch (err) {
                console.error('Failed to batch fetch users', err);
            }
        }
    };

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

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setComments(comments.filter(c => c._id !== commentId));
                setOpenMenuId(null);
            } else {
                alert("Failed to delete comment");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editText.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ content: editText })
            });

            if (response.ok) {
                const updatedComment = await response.json();
                setComments(comments.map(c => c._id === commentId ? updatedComment.comment : c));
                setEditingId(null);
                setEditText("");
                setOpenMenuId(null);
            } else {
                alert("Failed to update comment");
            }
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const isOwner = (commentUserId) => {
        return user && (user.id?.toString() === commentUserId?.toString() || user._id?.toString() === commentUserId?.toString());
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
                    <button type="submit">Post</button>
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
                        <div className="comment-content">
                            <div className="info">
                                <span className="username" onClick={() => navigate(`/profile/${comment.user_id}`)} style={{cursor: 'pointer'}}>{userMap[comment.user_id] || "Anonymous"}</span>
                                {editingId === comment._id ? (
                                    <div className="edit-form">
                                        <textarea 
                                            value={editText} 
                                            onChange={(e) => setEditText(e.target.value)}
                                            placeholder="Edit your comment"
                                        />
                                        <div className="edit-buttons">
                                            <button onClick={() => handleEditComment(comment._id)} className="save-btn">Save</button>
                                            <button onClick={() => { setEditingId(null); setEditText(""); }} className="cancel-btn">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p>{comment.content}</p>
                                )}
                            </div>
                            <span className="date">{timeAgoOrDate(comment.createdAt)}</span>
                        </div>
                        {isOwner(comment.user_id) && !editingId && (
                            <div className="comment-options">
                                <button 
                                    className="options-btn"
                                    onClick={() => setOpenMenuId(openMenuId === comment._id ? null : comment._id)}
                                >
                                    <MoreHoriz />
                                </button>
                                {openMenuId === comment._id && (
                                    <div className="menu">
                                        <button 
                                            onClick={() => {
                                                setEditingId(comment._id);
                                                setEditText(comment.content);
                                                setOpenMenuId(null);
                                            }}
                                            className="edit-btn"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="no-comments">No comments yet</div>
            )}
        </div>
    )
};

export default Comments;