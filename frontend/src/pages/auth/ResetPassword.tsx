import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const { resetPassword } = useAuth();

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            toast.error('Invalid reset link');
            navigate('/forgot-password');
            return;
        }
        setToken(tokenParam);
    }, [searchParams, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid reset token');
            return;
        }

        if (!password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            await resetPassword(token, password);
            setIsSuccess(true);
            toast.success('Password reset successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 max-w-md">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-merriweather text-2xl text-center text-green-600">
                                Password Reset Successfully!
                            </CardTitle>
                            <CardDescription className="font-poppins text-center">
                                Your password has been updated successfully
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="mb-6">
                                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                                <p className="font-poppins text-sm text-muted-foreground">
                                    You can now log in with your new password.
                                </p>
                            </div>

                            <Link to="/login">
                                <Button className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins">
                                    Continue to Login
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 max-w-md">
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burnt-orange mx-auto mb-4"></div>
                            <p className="font-poppins text-muted-foreground">Validating reset link...</p>
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
                            Reset Your Password
                        </CardTitle>
                        <CardDescription className="font-poppins text-center">
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="password" className="font-poppins">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mt-1"
                                    disabled={isLoading}
                                    minLength={6}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Password must be at least 6 characters long
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="font-poppins">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="mt-1"
                                    disabled={isLoading}
                                    minLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-5 w-5 mr-2" />
                                        Reset Password
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
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

export default ResetPassword;
