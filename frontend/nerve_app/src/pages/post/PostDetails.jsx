import React from 'react';
import "../../components/postoptions/postOptions.scss";
import {useState, useEffect} from 'react';
import { timeAgoOrDate } from '../../utils/date';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (!id) return;
        const fetchPostDetails = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/posts/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setPost(data);
                setTitle(data.title);
                setContent(data.content);
                console.log("Post user_id:", data.user_id);
            } catch (err) {
                setError(err.message || 'Error');
            } finally {
                //setLoading(false);
                console.log("Fetched post details");
            }
        };
        fetchPostDetails();
    }, [id]);

    //get the user info based on the post's user_id for displaying username
    useEffect(() => {
        if (!post) return;
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/users/${post.user_id}`);
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
        console.log("Fetched user for post:", post.user_id);
    }, [post]);

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title, content })
            });
            if (!res.ok) throw new Error('Failed to update');
            const updated = await res.json();
            setPost(updated);
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Update failed');
        }
    }

    if (loading) return <div className="postDetails">Loading...</div>;
    if (error) return <div className="postDetails">Error: {error}</div>;
    if (!post) return <div className="postDetails">No post found</div>;

    return (
        <div className="postDetails">
            {!isEditing ? (
                <>
                    <h1>{post.title}</h1>
                    <div className="meta">By {user?.username || post.user_id || 'Unknown'} • <span className="date">{timeAgoOrDate(post.createdAt)}</span></div>
                    {post.imgurl && <img src={post.imgurl} alt="post" style={{maxWidth: '100%'}}/>}
                    <p>{post.content}</p>
                    <div style={{marginTop: 12}}>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => navigate(-1)} style={{marginLeft:8}}>Back</button>
                    </div>
                </>
            ) : (
                <div className="edit-form">
                    <label>Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} />
                    <label>Content</label>
                    <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} />
                    <div style={{marginTop:12}}>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => { setIsEditing(false); setTitle(post.title); setContent(post.content); }} style={{marginLeft:8}}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetails;