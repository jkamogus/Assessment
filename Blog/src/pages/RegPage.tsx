import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";

export default function RegPage (){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

    if (password !== confirmPassword){
        setError("Passwords do not match.");
        setLoading(false);
        return;
    }

    const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: { username }
        }
    });

    console.log(data?.user);

    if (error) {
        setError(error.message);
        setMessage(null);
    } else {
        setError(null);
        setMessage("Registration successful!")
    
    
    setTimeout(() => {
       navigate("/home") 
    }, 1500);

    }
    setLoading(false);
}

    return(
        <>
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col w-full h-full items-center lg:justify-center">

                <div className="w-full px-4">
                    <h1>Create an Account. It's easy and fast!</h1>
                </div>

                    {/*Registration Form*/}
                    <form onSubmit={handleRegister} className="flex flex-col justify-center items-center bg-white w-full max-w-md p-6 rounded shadow-lg mt-5">
                        <input type = "text" 
                            value = {username} 
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value.trim())} 
                            className="w-full p-2 rounded border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>

                        <input type = "email" 
                            value = {email} 
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value.trim())} 
                            className="w-full p-2 mt-5 rounded border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>

                        <input type = "password" 
                            value = {password} 
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}  
                            className="w-full p-2 mt-5 rounded border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>

                        <input type = "password" 
                            value = {confirmPassword} 
                            placeholder="Confirm Password" 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 mt-5 rounded border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>

                        {/* Button changed for better UX. Disabled until registration process has finished. */}
                        <button type="submit" disabled={loading} className="w-full p-2 mt-5 rounded bg-gray-700 text-white hover:bg-gray-500 transition duration-300 ease-in-out">
                            {loading ? "Please wait..." : "Register"}
                        </button>
                        
                        <Link to = "/" className="text-blue-500 mt-2 hover:underline transition duration-300 ease-in-out">Already have an account?</Link>
                        {error && <p style={{color: "red"}}>{error}</p>}
                        {message && <p style={{color: "green"}}>{message}</p>}
                    </form>


            </div>
        </div>
        </>
    );
}