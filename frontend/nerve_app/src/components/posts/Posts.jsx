import "./posts.scss";
import Post from "../post/Post";
import { useState, useEffect } from "react";

const Posts = () => {
    const [posts, setPosts] = useState([]);

    //temp data
    /*
    const posts = [
        {
            id: 1,
            name: "John Doe",
            userId: 1,
            profilePic: "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis laborum corporis dicta. Nisi iure sint asperiores explicabo debitis modi dolorum quis praesentium eveniet, molestias dolorem sed? Commodi labore nesciunt deleniti.",
            img: "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
        },
        {
            id: 2,
            name: "John Doe",
            userId: 2,
            profilePic: "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis laborum corporis dicta. Nisi iure sint asperiores explicabo debitis modi dolorum quis praesentium eveniet, molestias dolorem sed? Commodi labore nesciunt deleniti.",
        },
        
    ];
    */

    useEffect(() => {
        const getPosts = async () => {
            const url = "http://localhost:8080/api/posts";
            try {
                const response = await fetch(url, {
                    method: "GET",
                });
                const result = await response.json();
                console.log(result);
                setPosts(result)
            } catch (error) {
                console.error("error fetching posts");
            }
        };

        getPosts();
    }, []);

    //console.log(posts);

    return <div className="posts">
        {posts.map(post=>(
            <Post post={post} key={post._id}/>
        ))}
    </div>;

};

export default Posts;