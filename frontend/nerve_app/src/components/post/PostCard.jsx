import "./post.scss";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { Link, useNavigate } from "react-router-dom";
import { timeAgoOrDate } from "../../utils/date";
import Comments from "../comments/Comments";
import {useState, useEffect, useContext} from 'react';
import PostOptions from "../postoptions/PostOptions";
import { AuthContext } from "../../context/authContext";

const PostCard = ({post, onPostDeleted, username, challenge: challengeProp}) => {

    const [commentOpen, setCommentOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [optionsOpen, setOptionsOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [challenge, setChallenge] = useState(challengeProp || null);
    const [loadingChallenge, setLoadingChallenge] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    

    // username is passed from parent (Posts) via batch fetch to avoid per-post requests

    useEffect(() => {
        // If parent supplied a challenge object, use it and skip fetching.
        if (challengeProp) {
            setChallenge(challengeProp);
            return;
        }
        let mounted = true;
        async function loadChallenge() {
            if (!post || !post.challengeId) return;
            // Normalize challengeId: sometimes it may come as an object
            let cid = post.challengeId;
            if (typeof cid === 'object' && cid !== null) {
                // try common fields
                cid = cid._id || cid.id || cid.$oid || cid.toString();
            }
            if (!cid || typeof cid !== 'string') {
                // Avoid flooding console with identical messages
                console.debug('Post has invalid challengeId, skipping challenge fetch', { challengeId: post.challengeId, postId: post._id });
                return;
            }

            // only accept Mongo-like hex ids (24 hex chars) to avoid malformed URL issues
            const hex24 = /^[0-9a-fA-F]{24}$/;
            if (!hex24.test(cid)) {
                console.debug('challengeId does not match expected pattern, skipping fetch', { cid, postId: post._id });
                return;
            }

            setLoadingChallenge(true);
            try {
                const res = await fetch(`/api/challenges/${encodeURIComponent(cid)}`);
                if (!res.ok) {
                    if (mounted) setChallenge(null);
                } else {
                    // guard JSON parsing errors
                    const text = await res.text();
                    try {
                        const data = text ? JSON.parse(text) : null;
                        if (mounted) setChallenge(data);
                    } catch (parseErr) {
                        console.error('Failed to parse challenge JSON for post', post._id, parseErr);
                        if (mounted) setChallenge(null);
                    }
                }
            } catch (err) {
                console.error('Failed to load challenge for post', err);
                if (mounted) setChallenge(null);
            } finally {
                if (mounted) setLoadingChallenge(false);
            }
        }
        loadChallenge();
        return () => { mounted = false; };
    }, [post && post.challengeId, challengeProp]);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);

    useEffect(() => {
        // Fetch comment count for this post
        const fetchCommentCount = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/comments?postId=${post._id}`);
                if (response.ok) {
                    const comments = await response.json();
                    setCommentCount(Array.isArray(comments) ? comments.length : 0);
                }
            } catch (err) {
                console.error('Error fetching comment count:', err);
            }
        };

        if (post._id) {
            fetchCommentCount();
        }
    }, [post._id]);

    useEffect(() => {
        // Check if current user has liked this post
        if (user && post.likes) {
            const userId = user._id || user.id;
            setLiked(post.likes.includes(userId));
        }
    }, [post, user]);

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const endpoint = liked ? 'unlike' : 'like';
            const response = await fetch(`http://localhost:8080/api/posts/${post._id}/${endpoint}`, {
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

    return (
        <div className={`post ${hidden ? 'hidden' : ''}`}>
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <div className="details">
                            <Link to={`/profile/${post.user_id}`} style={{textDecoration:"none", color:"inherit"}}>
                            </Link>
                            <span className="username" onClick={() => navigate(`/profile/${post.user_id}`)} style={{cursor: 'pointer'}}>{username || post.user_id}</span>
                            <span className="date">{timeAgoOrDate(post.createdAt)}</span>
                        </div>
                    </div>
                    {challenge && (
                        <div className="challenge-badge" onClick={() => navigate(`/challenge/${challenge._id}`)}>
                            <div className="ch-title">{challenge.title}</div>
                            <div className="ch-genre">{challenge.genre}</div>
                        </div>
                    )}
                    <div className="item" onClick={() => setOptionsOpen(!optionsOpen)}>
                        <MoreHorizIcon/>
                        {optionsOpen && (
                            <PostOptions
                                postId={post._id}
                                ownerId={post.user_id}
                                onDeleted={onPostDeleted}
                                onHide={() => setHidden(h => !h)}
                            />
                        )}
                    </div>
                </div>
                <div className="content">
                    <Link to={`/post/${post._id}`} style={{textDecoration:"none", color:"inherit"}}>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    <img src={post.imgurl} alt="" />
                    </Link>
                </div>
                <div className="info">
                    <div className="item" onClick={handleLike} style={{cursor: 'pointer'}}>
                        {liked ? <FavoriteOutlinedIcon/> : <FavoriteBorderOutlinedIcon/>}
                        {likeCount} Likes
                    </div>
                    <div className="item" onClick={() => navigate(`/post/${post._id}`)}>
                        <TextsmsOutlinedIcon/>
                        {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                    </div>
                    <div className="item">
                        <ShareOutlinedIcon/>
                        Share
                    </div>
                </div>
                {commentOpen && <Comments/>}
            </div>
        </div>
    )
}

export default PostCard;