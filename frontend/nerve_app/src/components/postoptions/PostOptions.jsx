import "./postOptions.scss";
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


const PostOptions = ({postId, onDeleted}) => {
    const navigate = useNavigate();

    
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });

            const result = await response.json();
            console.log("Deleted:", result);

            if (onDeleted) onDeleted(postId);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleEdit = () => {
        // navigate to the post details page where editing is allowed
        navigate(`/post/${postId}`);
    }

    return (
        <div className="item">
            <button onClick={handleDelete} className="delete-button">Delete Post</button>
            <button onClick={handleEdit} className="edit-button">Edit Post</button>
        </div>
    );
};

export default PostOptions;