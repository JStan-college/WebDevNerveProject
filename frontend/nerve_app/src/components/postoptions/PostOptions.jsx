import "./postOptions.scss";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';


const PostOptions = ({ postId, ownerId, onDeleted, onHide }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const isOwner = user && (user.id?.toString() === ownerId?.toString() || user._id?.toString() === ownerId?.toString());

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
        navigate(`/post/${postId}`);
    };

    const handleHide = () => {
        if (onHide) onHide(postId);
    };

    return (
        <div className="item post-options">
            <button onClick={handleHide} className="hide-button">{/* toggles hide/unhide in parent */}Hide Post</button>
            {isOwner && (
                <>
                    <button onClick={handleEdit} className="edit-button">Edit Post</button>
                    <button onClick={handleDelete} className="delete-button">Delete Post</button>
                </>
            )}
        </div>
    );
};

export default PostOptions;