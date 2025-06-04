import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";

export default function LoginPage (){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log(data?.user);

        if (error) {
            setError(error.message);
        } else {
            setError(null);
            navigate("/Home");
        }
        setLoading(false);
    }


    return(
        <>
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col w-full h-full items-center lg:justify-center">

                <div className="w-full px-4">
                    <h1 className="text-slate-800 dark:text-white">Welcome to Blogs!</h1>
                </div>

                    {/*Login Form*/}
                    <form onSubmit = { handleLogin } className="flex flex-col justify-center items-center bg-white w-full max-w-md p-6 rounded shadow-lg mt-5">

                        <input type = "email"
                            placeholder="Email"
                            value = {email}
                            onChange={(e) => {setEmail(e.target.value.trim()); setError(null);}} 
                            className="w-full p-2 rounded border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>

                        <input type = "password"
                            placeholder="Password"
                            value = {password}
                            onChange={(e) => {setPassword(e.target.value); setError(null);}}
                            className="w-full p-2 mt-5 rounded border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>

                        
                        <button type="submit" disabled={loading} className="w-full p-2 mt-5 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition duration-300 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-600">
                            {loading ? "Please wait..." : "Log In"}
                        </button>
                        {error && <p style={{color: "red"}}>{error}</p>}

                        <Link to = "/" className="text-blue-500 mt-2 hover:underline transition duration-300 ease-in-out">Forgot Password?</Link>
                    
                        <div className="flex flex-col justify-center items-start w-full mt-5">
                            <a className="text-left text-black">New to Blogs?</a>
                            <Link to = '/Register' className="w-full">
                                <button  className="w-full p-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition duration-300 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-600">Create an Account</button>
                            </Link>
                        </div>
                    </form>

            </div>
        </div>
        </>
    )
}