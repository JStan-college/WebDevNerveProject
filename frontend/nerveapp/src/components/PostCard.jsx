import { DeleteIcon, PenSquareIcon } from "lucide-react";
import {Link } from "react-router";


const PostCard = ({post}) => {
    return ( 
        <Link to={`/post/${post._id}`}
        className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-b
        border-solid border-amber-500">
            <div className="card-body">
                <h3 className="card-title text-base-content">{post.title}</h3>
                <p className="text-base-content/70 line-clamp-3">{post.content}</p>
                <div className="card-actions justify-between items-center mt-4">
                    <span className="text-sm text-base-content/60">{post.createdAt}</span>
                    <div className="flex items-center gap-1">
                        <button>
                            <PenSquareIcon className="size-4"/>
                        </button>
                        <button className="btn btn-ghost btn-xs text-error">
                            <DeleteIcon className="size-4"/>
                        </button>
                    </div>
                </div>

            </div>
        </Link>
    );
};

export default PostCard;