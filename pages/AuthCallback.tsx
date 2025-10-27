import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/config';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Proactively check for a session as soon as the component loads.
        // This handles cases where the session is established before the listener is attached.
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/admin', { replace: true });
            }
        });

        // Also set up a listener as a reliable fallback. The `SIGNED_IN` event
        // will fire once the session is established from the URL hash.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                // Once we have a session, we can redirect.
                navigate('/admin', { replace: true });
            }
        });

        // The cleanup function will run when the component unmounts to prevent memory leaks.
        return () => {
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
