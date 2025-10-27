import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/config';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    // Use a ref to prevent this effect from running twice in React's StrictMode
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const handleAuth = async () => {
            // The URL hash from Supabase + HashRouter looks like: #/auth-callback#access_token=...
            const hash = window.location.hash;
            const secondHashIndex = hash.lastIndexOf('#');

            // Check if we have the Supabase token part in the hash after the router's hash
            if (secondHashIndex > 0) {
                const paramsStr = hash.substring(secondHashIndex + 1);
                const params = new URLSearchParams(paramsStr);
                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');

                if (accessToken && refreshToken) {
                    // Manually set the session with the tokens parsed from the URL
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (!error) {
                        // If session is set successfully, we are logged in. Redirect to admin.
                        navigate('/admin', { replace: true });
                        return; // Exit the function to avoid running the fallback.
                    } else {
                        console.error('Error setting session manually:', error);
                        // If manual setting fails, we can let it fall through to the listener.
                    }
                }
            }
            
            // Fallback listener for other auth flows or if manual parsing fails.
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session) {
                    subscription.unsubscribe();
                    navigate('/admin', { replace: true });
                }
            });

            return () => {
                subscription?.unsubscribe();
            };
        };

        handleAuth();
        
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
