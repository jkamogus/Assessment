import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { updatePosts, getPostById, deletePost } from "../redux/blogSlice";

export default function UpdatePost() {
    const { id } = useParams< {id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const selectedPost = useSelector((state: RootState) => state.blog.selectedPost);
    const updating = useSelector((state: RootState) => state.blog.updating);
    const error = useSelector((state: RootState) => state.blog.error)

    useEffect(() => {
        if (id) {
            dispatch(getPostById(Number(id)));
        }
    }, [id]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        if (selectedPost?.title || selectedPost?.content) {
            console.log("Populating form with: ", selectedPost);    
            setTitle(selectedPost.title?? "");
            setContent(selectedPost.content?? "");
        }
    }, [selectedPost]);

    useEffect(() => {
        if (error) {
            if (error.toLowerCase().includes("forbidden") || error.toLowerCase().includes("unauthorized")) {
                setAccessDenied(true);
                setTimeout(() => {
                    navigate("/home");
                }, 3000);
            }
        }
    }, [error, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            dispatch(updatePosts({ id: Number(id), title, content}))
                .unwrap()
                .then(() => navigate("/home"))
                .catch((err) => console.error("Updating blog failed", err))
        }
    }

    const handleDelete = (id: number) => {
        if(confirm("Are you sure do you want to delete this blog?")){
        dispatch(deletePost(id));
        navigate("/home");
        }
    };

    if (accessDenied) {
        return (
            <div className="mt-10 text-center">This blog is inaccessible, redirecting back to home page...</div>
        );
    }
    if (!selectedPost) {
        return <div className="text-center mt-10">Loading post data...</div>
    }
    return(
        <>
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col w-full h-full items-center lg:justify-center">
        
                <div className="w-full px-4">
                    <h1>Update Blog:</h1>
                </div>
        
                {/*Update Blog Form*/}
                <form onSubmit = { handleSubmit } className="flex flex-col justify-center items-center bg-white w-full max-w-md p-6 rounded shadow-lg mt-5">
                    <input type = "text"
                        placeholder="Title"
                        value = {title}
                        onChange={(e) => {setTitle(e.target.value)}} 
                        className="required w-full p-2 rounded border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
        
                    <textarea
                        placeholder="Write your blog here..."
                        value = {content}
                        onChange={(e) => {setContent(e.target.value);}}
                        className="required w-full p-2 mt-5 rounded border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
        
                                
                    <button type="submit" disabled={updating} className="w-full p-2 mt-5 rounded bg-gray-700 text-white hover:bg-gray-500 transition duration-300 ease-in-out">
                        {updating ? "Updating content..." : "Update"}
                    </button>

                    <button onClick={() => handleDelete(selectedPost.id)}
                            className="w-full p-2 mt-5 rounded bg-red-500 text-white hover:bg-red-400 transition duration-300 ease-in-out">
                        Delete Blog
                    </button>
                </form>
        
            </div>
        </div>

        </>
    )
}