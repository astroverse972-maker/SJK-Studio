import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/config';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // The Supabase client library automatically handles the session from the URL hash.
        // We just need to wait for the user session to be established and then redirect.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // Once signed in, redirect to the admin page.
                navigate('/admin', { replace: true });
            }
        });

        return () => {
            // Cleanup subscription on unmount
            subscription.unsubscribe();
        };
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-4">Authenticating...</h2>
                <p className="text-text-dim">Please wait while we log you in.</p>
            </div>
        </div>
    );
};

export default AuthCallback;