import Navbar from "../components/Navbar.jsx";
import {useState, useEffect} from "react"
import PostCard from "../components/PostCard.jsx";

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            } catch (error) {
                console.error("error fetching posts");
            }
        };

        getPosts();
    }, []);

    return ( 
        <div className = "min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto p-4 mt-6">
                {loading && <div className="text-center text-primary py-10"> Loading...</div>}

                <div className="max-w-7xl mx-auto p-4 mt-6">
                    {posts.length > 0 && (
                        <div className="grid grid-cols-1 gap-30">
                            {posts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;