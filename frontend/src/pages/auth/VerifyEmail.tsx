import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const { verifyEmail, user } = useAuth();

    // Get redirect URL from query params
    const redirectUrl = searchParams.get('redirect') || '/';

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            setError('Invalid verification link');
            return;
        }
        setToken(tokenParam);
    }, [searchParams]);

    const handleVerify = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            setError(null);
            await verifyEmail(token);
            setIsVerified(true);
            toast.success('Email verified successfully!');
        } catch (error: any) {
            setError(error.message || 'Failed to verify email');
            toast.error(error.message || 'Failed to verify email');
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerified) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 max-w-md">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-merriweather text-2xl text-center text-green-600">
                                Email Verified!
                            </CardTitle>
                            <CardDescription className="font-poppins text-center">
                                Your email has been successfully verified
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="mb-6">
                                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                                <p className="font-poppins text-sm text-muted-foreground">
                                    You can now access all features of your account.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => navigate(redirectUrl)}
                                    className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins"
                                >
                                    Continue
                                </Button>
                                <Link to="/login">
                                    <Button variant="outline" className="w-full font-poppins">
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 max-w-md">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-merriweather text-2xl text-center text-red-600">
                                Verification Failed
                            </CardTitle>
                            <CardDescription className="font-poppins text-center">
                                {error}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="mb-6">
                                <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                                <p className="font-poppins text-sm text-muted-foreground">
                                    The verification link may be invalid or expired.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins"
                                >
                                    Back to Login
                                </Button>
                                <Link to="/register/customer">
                                    <Button variant="outline" className="w-full font-poppins">
                                        Register New Account
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4 max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-merriweather text-2xl text-center">
                            Verify Your Email
                        </CardTitle>
                        <CardDescription className="font-poppins text-center">
                            Click the button below to verify your email address
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="mb-6">
                            <Mail className="h-16 w-16 mx-auto text-burnt-orange mb-4" />
                            <p className="font-poppins text-sm text-muted-foreground">
                                {user?.email && `We'll verify the email address: ${user.email}`}
                            </p>
                        </div>

                        <Button
                            onClick={handleVerify}
                            className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins"
                            disabled={isLoading || !token}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Verify Email
                                </>
                            )}
                        </Button>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="font-poppins text-sm text-primary hover:text-primary/80 inline-flex items-center"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VerifyEmail;
