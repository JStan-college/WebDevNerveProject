import { useState} from "react";
import { Link } from "react-router";
import toast from "react-hot-toast"
import { ArrowLeftIcon } from "lucide-react";

const CreatePage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(title);
        console.log(content);

        if(!title.trim() || !content.trim()){
            toast.error("All fields are required")
            return;
        }

        //placeholder id until challenge id and user id is implemented
        const tempUserid = "123abc";
        const tempChallengeid = "125abc";

        const newPost = {title, content, userId: tempUserid, challengeId: tempChallengeid};

        try {
            const response = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost),
            });

            const result = await response.json();
            console.log("Post created", result);

            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Link to="/" className="btn btn-ghost mb-4">
                        <ArrowLeftIcon className="size-5 mr-2" />
                        Back to Home
                    </Link>
                    <div className="card bg-base-100">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">Create New Post</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Title</span>
                                    </label>
                                    <input type="text"
                                        placeholder="Post Title"
                                        className="input input-bordered"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Content</span>
                                    </label>
                                    <textarea 
                                        placeholder="Write about your challenge here..."
                                        className="textarea textarea-bordered h-32"
                                        value={content}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="card-actions justify-end">
                                    <button type="submit" className="btn btn-primary">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;