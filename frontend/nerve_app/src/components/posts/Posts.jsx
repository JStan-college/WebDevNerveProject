import "./posts.scss";
import PostCard from "../post/PostCard";
import { useState, useEffect } from "react";

const Posts = ({ posts: propPosts }) => {
    const [posts, setPosts] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [challengeMap, setChallengeMap] = useState({});

    useEffect(() => {
        // If posts are passed as prop (e.g., from search results), use those
        if (Array.isArray(propPosts)) {
            setPosts(propPosts);
            fetchUsernames(propPosts);
            fetchChallenges(propPosts);
            return;
        }

        // Otherwise fetch all posts
        const getPosts = async () => {
            const url = "http://localhost:8080/api/posts";
            try {
                const response = await fetch(url, {
                    method: "GET",
                });
                const result = await response.json();
                setPosts(result || []);
                fetchUsernames(result || []);
                fetchChallenges(result || []);
            } catch (error) {
                console.error("error fetching posts");
            }
        };

        getPosts();
    }, [propPosts]);

    const fetchUsernames = async (postsToFetch) => {
        // batch-fetch unique users for these posts
        const userIds = Array.from(new Set(postsToFetch.map(p => p.user_id).filter(Boolean)));
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
    };

    const fetchChallenges = async (postsToFetch) => {
        const ids = Array.from(new Set(postsToFetch.map(p => p.challengeId).filter(Boolean)));
        // only keep 24-hex ids
        const hex24 = /^[0-9a-fA-F]{24}$/;
        const validIds = ids.filter(id => typeof id === 'string' && hex24.test(id));
        const invalid = ids.filter(id => !(typeof id === 'string' && hex24.test(id)));
        if (invalid.length > 0) {
            console.debug('Posts contain invalid/non-string challengeIds (will skip):', invalid.slice(0,10));
        }
        if (validIds.length === 0) return;
        try {
            const fetches = validIds.map(id => fetch(`http://localhost:8080/api/challenges/${id}`).then(r => r.ok ? r.json() : null));
            const results = await Promise.all(fetches);
            const map = {};
            results.forEach(ch => { if (ch && (ch._id || ch.id)) map[ch._id || ch.id] = ch; });
            setChallengeMap(map);
        } catch (err) {
            console.error('Failed to batch fetch challenges', err);
        }
    };

    const handlePostDeleted = (id) => {
        setPosts(prev => prev.filter(p => p._id !== id));
    };

    return <div className="posts">
        {posts && posts.length > 0 ? posts.map(post=>(
                <PostCard post={post} key={post._id} onPostDeleted={handlePostDeleted} username={userMap[post.user_id]} challenge={challengeMap[post.challengeId]} />
        )) : <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No posts found</div>}
    </div>;

};

export default Posts;