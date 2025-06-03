import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";


export default function PrivateRoute({ children, }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        };
        fetchSession();
    }, []);

    if (loading) return <div>Loading...</div>;

    return session ? children : <Navigate to ="/" />;
}