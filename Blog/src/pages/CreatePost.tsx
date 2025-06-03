import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { createPost } from "../redux/blogSlice";

export default function CreatePost(){
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { creating } = useSelector((state: RootState) => state.blog);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            await dispatch(createPost({ title: title.trim(), content})).unwrap();
            navigate("/home");
        } catch (err: any) {
        console.error(err); // For debugging
        alert("Failed to create post: " + (typeof err === "string" ? err : err?.message || "Unknown error"));
        }

    };

    return(
        <>
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col w-full h-full items-center lg:justify-center">
        
                <div className="w-full px-4">
                    <h1>Create new Blog:</h1>
                </div>
        
                {/*Create Blog Form*/}
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
        
                                
                    <button type="submit" disabled={creating} className="w-full p-2 mt-5 rounded bg-gray-700 text-white hover:bg-gray-500 transition duration-300 ease-in-out">
                        {creating ? "Posting content..." : "Post Blog"}
                    </button>
                </form>
        
            </div>
        </div>
        
        </>
    )
}