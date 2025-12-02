import React from 'react';
import "../../components/postoptions/postOptions.scss";
import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (!id) return;
        const fetchPostDetails = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/posts/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setPost(data);
                setTitle(data.title || '');
                setContent(data.content || '');
            } catch (err) {
                setError(err.message || 'Error');
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetails();
    }, [id]);

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
                    <div className="meta">By {post.username || post.author || 'Unknown'}</div>
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