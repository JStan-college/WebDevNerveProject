import "./post.scss";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { Link } from "react-router-dom";
import { timeAgoOrDate } from "../../utils/date";
import Comments from "../comments/Comments";
import {useState} from 'react';
import PostOptions from "../postoptions/PostOptions";

const PostCard = ({post, onPostDeleted}) => {

    const [commentOpen, setCommentOpen] = useState(false);

    const [optionsOpen, setOptionsOpen] = useState(false);
    const [hidden, setHidden] = useState(false);

    //needs to be fixed
    const liked = false;

    

    return (
        <div className={`post ${hidden ? 'hidden' : ''}`}>
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <div className="details">
                            <Link to={`/profile/${post.user_id}`} style={{textDecoration:"none", color:"inherit"}}>
                            </Link>
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
                    <div className="item">
                        {liked ? <FavoriteOutlinedIcon/> : <FavoriteBorderOutlinedIcon/>}
                        {post.score} Likes
                    </div>
                    <div className="item" onClick={()=>setCommentOpen(!commentOpen)}>
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