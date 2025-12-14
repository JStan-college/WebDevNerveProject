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

const PostCard = ({post, onPostDeleted, username}) => {

    const [commentOpen, setCommentOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [optionsOpen, setOptionsOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);

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
                        12 Comments
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