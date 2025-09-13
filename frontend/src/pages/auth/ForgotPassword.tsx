import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        try {
            setIsLoading(true);
            await forgotPassword(email);
            setIsEmailSent(true);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (isEmailSent) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 max-w-md">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-merriweather text-2xl text-center text-green-600">
                                Check Your Email
                            </CardTitle>
                            <CardDescription className="font-poppins text-center">
                                We've sent a password reset link to your email address
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="mb-6">
                                <Mail className="h-16 w-16 mx-auto text-green-500 mb-4" />
                                <p className="font-poppins text-sm text-muted-foreground mb-4">
                                    If an account with <strong>{email}</strong> exists, you will receive a password reset link shortly.
                                </p>
                                <p className="font-poppins text-sm text-muted-foreground">
                                    The link will expire in 1 hour for security reasons.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => setIsEmailSent(false)}
                                    variant="outline"
                                    className="w-full font-poppins"
                                >
                                    Try Different Email
                                </Button>
                                <Link to="/login">
                                    <Button variant="ghost" className="w-full font-poppins">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
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

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4 max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-merriweather text-2xl text-center">
                            Forgot Password?
                        </CardTitle>
                        <CardDescription className="font-poppins text-center">
                            Enter your email address and we'll send you a link to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="font-poppins">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1"
                                    disabled={isLoading}
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
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-5 w-5 mr-2" />
                                        Send Reset Link
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

export default ForgotPassword;
