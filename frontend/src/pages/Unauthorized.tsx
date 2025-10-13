import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-3xl font-semibold mb-2">Unauthorized</h1>
            <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
            <div className="space-x-3">
                <Link to="/" className="underline">Go Home</Link>
                <Link to="/login" className="underline">Sign in</Link>
            </div>
        </div>
    );
};

export default Unauthorized;


