import "./postOptions.scss";
import {useState, useEffect} from 'react';


const PostOptions = ({postId, onDeleted}) => {
    
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
                method: "DELETE",
            });

            const result = await response.json();
            console.log("Deleted:", result);

            if (onDeleted) onDeleted(postId);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className="item">
            <button onClick={handleDelete} className="delete-button">Delete Post</button>
        </div>
    );
};

export default PostOptions;