import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginPromptProps {
    title?: string;
    message?: string;
    showRegister?: boolean;
    redirectTo?: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
    title = "Login Required",
    message = "Please login to continue with your order",
    showRegister = true,
    redirectTo = '/login'
}) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        const redirectUrl = redirectTo === '/login' ? '/checkout' : redirectTo;
        navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    };

    const handleRegister = () => {
        const redirectUrl = redirectTo === '/login' ? '/checkout' : redirectTo;
        navigate(`/register/customer?redirect=${encodeURIComponent(redirectUrl)}`);
    };

    return (
        <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
                <CardTitle className="font-merriweather text-xl flex items-center text-orange-800">
                    <LogIn className="h-6 w-6 mr-2" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="font-poppins text-orange-700">
                        {message}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={handleLogin}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            Login
                        </Button>

                        {showRegister && (
                            <Button
                                onClick={handleRegister}
                                variant="outline"
                                className="flex-1 text-orange-800 border-orange-300 hover:bg-orange-100"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Create Account
                            </Button>
                        )}
                    </div>

                    <div className="text-xs text-orange-600 text-center">
                        <p>New to IndiCrafts? Create an account to start shopping!</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LoginPrompt;
