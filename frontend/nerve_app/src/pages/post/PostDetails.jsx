import React from 'react';
import "./PostDetails.scss";
import {useState, useEffect, useContext} from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
import Comments from '../../components/comments/Comments';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { timeAgoOrDate } from '../../utils/date';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [author, setAuthor] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [challenge, setChallenge] = useState(null);
    const [loadingChallenge, setLoadingChallenge] = useState(false);
    const { darkMode } = useContext(DarkModeContext);
    const { user } = useContext(AuthContext);
    const isOwner = user && (user.id?.toString() === post?.user_id?.toString() || user._id?.toString() === post?.user_id?.toString());
    

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
                setLikeCount(data.likes ? data.likes.length : 0);
                
                // Check if current user has liked this post
                if (user && data.likes) {
                    const userId = user._id || user.id;
                    setLiked(data.likes.includes(userId));
                }
                console.log("Post user_id:", data.user_id);
            } catch (err) {
                setError(err.message || 'Error');
            } finally {
                //setLoading(false);
                console.log("Fetched post details");
            }
        };
        fetchPostDetails();
    }, [id, user]);

    //get the user info based on the post's user_id for displaying username
    useEffect(() => {
        if (!post) return;
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/users/${post.user_id}`);
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setAuthor(data);
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
        console.log("Fetched user for post:", post.user_id);
    }, [post]);

    useEffect(() => {
        if (!post || !post.challengeId) {
            setChallenge(null);
            return;
        }

        // Normalize challengeId which may sometimes be an object
        let cid = post.challengeId;
        if (typeof cid === 'object' && cid !== null) {
            cid = cid._id || cid.id || cid.$oid || cid.toString();
        }
        if (!cid || typeof cid !== 'string') {
            console.debug('PostDetails: invalid challengeId, skipping fetch', { challengeId: post.challengeId });
            setChallenge(null);
            return;
        }

        const hex24 = /^[0-9a-fA-F]{24}$/;
        if (!hex24.test(cid)) {
            setChallenge(null);
            return;
        }

        let mounted = true;
        setLoadingChallenge(true);
        (async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/challenges/${encodeURIComponent(cid)}`);
                if (!res.ok) {
                    if (mounted) setChallenge(null);
                } else {
                    const text = await res.text();
                    try {
                        const data = text ? JSON.parse(text) : null;
                        if (mounted) setChallenge(data);
                    } catch (parseErr) {
                        console.error('Failed to parse challenge JSON for post details', parseErr);
                        if (mounted) setChallenge(null);
                    }
                }
            } catch (err) {
                console.error('Failed to load challenge for post details', err);
                if (mounted) setChallenge(null);
            } finally {
                if (mounted) setLoadingChallenge(false);
            }
        })();

        return () => { mounted = false; };
    }, [post && post.challengeId]);

    

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

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const endpoint = liked ? 'unlike' : 'like';
            const response = await fetch(`http://localhost:8080/api/posts/${id}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setLiked(!liked);
                setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }
        } catch (err) {
            console.error('Error updating like:', err);
        }
    };

    if (loading) return <div className="postDetails">Loading...</div>;
    if (error) return <div className="postDetails">Error: {error}</div>;
    if (!post) return <div className="postDetails">No post found</div>;

    return (
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <div className="post-page">
                <div className="postDetails">
                    <button className="back-button" onClick={() => navigate(-1)} aria-label="Close"><CloseOutlinedIcon/></button>
                    {!isEditing ? (
                        <>
                            <h1>{post.title}</h1>
                            <div className="meta">By <span className="username" onClick={() => navigate(`/profile/${post.user_id}`)} style={{cursor: 'pointer'}}>{author?.username || post.user_id || 'Unknown'}</span> • <span className="date">{timeAgoOrDate(post.createdAt)}</span>
                                {challenge && (
                                    <div className="challenge-badge" style={{display: 'inline-block', verticalAlign: 'middle', marginLeft: 8}} onClick={() => navigate(`/search?q=${encodeURIComponent(challenge.title)}&filter=challenge`)}>
                                        <div className="ch-title">{challenge.title}</div>
                                        <div className="ch-genre">{challenge.genre}</div>
                                    </div>
                                )}
                            </div>
                            {post.imgurl && <img src={post.imgurl} alt="post" style={{maxWidth: '100%'}}/>}
                            <p>{post.content}</p>
                            <div className="actions" style={{marginTop: 12}}>
                                <button className="action like" onClick={handleLike}>{liked ? <FavoriteOutlinedIcon/> : <FavoriteBorderOutlinedIcon/>} {likeCount} Likes</button>
                                <button className="action comment"><TextsmsOutlinedIcon/> Comment</button>
                                <button className="action share"><ShareOutlinedIcon/> Share</button>
                                {isOwner && (
                                    <button onClick={() => setIsEditing(true)} className="action edit">Edit</button>
                                )}
                            </div>
                            <div className="comments-section">
                                <h3>Comments</h3>
                                <Comments postId={id} />
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
            </div>
        </div>
    );
};

export default PostDetails;