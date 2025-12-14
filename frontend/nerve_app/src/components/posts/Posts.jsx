import "./posts.scss";
import PostCard from "../post/PostCard";
import { useState, useEffect } from "react";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [userMap, setUserMap] = useState({});

    useEffect(() => {
        const getPosts = async () => {
            const url = "http://localhost:8080/api/posts";
            try {
                const response = await fetch(url, {
                    method: "GET",
                });
                const result = await response.json();
                console.log(result);
                setPosts(result);

                // batch-fetch unique users for these posts
                const userIds = Array.from(new Set(result.map(p => p.user_id).filter(Boolean)));
                if (userIds.length > 0) {
                    try {
                        const userFetches = userIds.map(id => fetch(`http://localhost:8080/api/users/${id}`).then(r => r.ok ? r.json() : null));
                        const users = await Promise.all(userFetches);
                        const map = {};
                        users.forEach(u => { if (u && (u.id || u._id)) map[u.id || u._id] = u.username || u.name || null; });
                        setUserMap(map);
                    } catch (err) {
                        console.error('Failed to batch fetch users', err);
                    }
                }
            } catch (error) {
                console.error("error fetching posts");
            }
        };

        getPosts();
    }, []);

    const handlePostDeleted = (id) => {
        setPosts(prev => prev.filter(p => p._id !== id));
    };

    //console.log(posts);

    return <div className="posts">
        {posts.map(post=>(
            <PostCard post={post} key={post._id} onPostDeleted={handlePostDeleted} username={userMap[post.user_id]} />
        ))}
    </div>;

};

export default Posts;