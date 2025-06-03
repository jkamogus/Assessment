import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { deletePost, fetchPosts, setPage } from "../redux/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState} from "../redux/store";

export default function HomePage(){
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();

    const { posts, page, pageSize, loading: loadingPosts, hasMore, error} = useSelector(
        (state: RootState) => state.blog
    );
    
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user ?? null);
            setLoading(false);
        };
        getUser();
    }, []);
    
    useEffect(() => {
        if(user){
            dispatch(fetchPosts({ page, pageSize, userId: user.id}));
        }
    }, [dispatch, page, pageSize, user]);
    

    const handleNextPage = () => {
        if (hasMore) {
            dispatch(setPage(page + 1));
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            dispatch(setPage(page - 1));
        }
    }

    const handleLogout = async () => { 
        await supabase.auth.signOut();
        navigate("/");
    }
    
    const handleDelete = (id: number) => {
        if(confirm("Are you sure do you want to delete this blog?")){
            dispatch(deletePost(id));
        }
    };

    if (loading) return <p>Fetching your blogs...</p>
    return(
        <>
        <div className="min-h-screen flex flex-col">
            <nav className="sticky top-0 w-full text-white shadow-md z-50">
                <div className="w-full max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
                    <p className="font-bold text-2xl">Welcome, {user?.user_metadata?.username}</p>
                    <button onClick = { handleLogout } 
                            className="p-2 rounded bg-gray-700 text-white hover:bg-gray-500 transition duration-300 ease-in-out"
                    >
                        Log Out
                    </button>
                </div>
            </nav>

            <div className="w-full flex flex-col items-center justify-center">
                <Link to = '/create-post' className="w-full">
                    <button  className="p-2 mt-5 rounded bg-gray-700 text-white hover:bg-gray-500 transition duration-300 ease-in-out">Create Blog</button>
                </Link>
            </div>

            {loadingPosts && <p className="mt-4"> Loading Posts...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            {!loadingPosts && !error && posts.length === 0 && (
                <p className="mt-4">No blogs yet.</p>
            )}

            <div className="w-full flex flex-col justify-center items-center">

                <div className="flex justify-between max-w-md w-full mt-6 px-4">
                    <button onClick = {handlePrevPage}
                            disabled = {page === 1 || loadingPosts}
                            className = "px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                    >
                    {"<"}
                    </button>

                    <span className="flex items-center justify-center px-4 py-2">Page {page}</span>

                    <button onClick = {handleNextPage}
                            disabled = {!hasMore || loadingPosts}
                            className = "px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                    >
                    {">"}
                    </button>
                </div>

                <div className="w-full max-w-md flex flex-col items-center">
                    <ul className="w-full max-w-md mt-6 space-y-4">
                        {posts.map((post) => (
                            <li key={post.id} className="p-4 mt-2 border rounded shadow">
                                <Link to = {`/update-post/${post.id}`} className="block">
                                    <h2 className="font-bold text-lg">{post.title}</h2>
                                    <p className="text-white text-left mt-1">{post.content}</p>
                                    <p className="text-sm text-white mt-2">
                                        Created at: {new Date(post.created_at).toLocaleString()}
                                    </p>
                                </Link>

                                <button onClick={() => handleDelete(post.id)}
                                        className="w-full p-2 mt-5 rounded bg-red-500 text-white hover:bg-red-400 transition duration-300 ease-in-out">
                                    Delete Blog
                                </button>
                            </li>
                        ))}
                    </ul>

                    
                </div>
            </div>
        </div>
        </>
    )
}