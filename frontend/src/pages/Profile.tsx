import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
    const { user, updateProfile, isLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            await updateProfile(formData);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || ''
        });
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burnt-orange"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="font-merriweather text-2xl">Profile</CardTitle>
                                <CardDescription className="font-poppins">
                                    Manage your account information
                                </CardDescription>
                            </div>
                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    variant="outline"
                                    className="font-poppins"
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* User Info */}
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 bg-burnt-orange/10 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-burnt-orange" />
                            </div>
                            <div>
                                <h3 className="font-poppins text-lg font-semibold">{user.name}</h3>
                                <div className="flex items-center space-x-2">
                                    <Badge variant={user.role === 'producer' ? 'default' : 'secondary'}>
                                        {user.role === 'producer' ? 'Producer' : 'Customer'}
                                    </Badge>
                                    {user.isEmailVerified ? (
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                            Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                                            Unverified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName" className="font-poppins">First Name</Label>
                                {isEditing ? (
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="mt-1"
                                        disabled={isLoading}
                                    />
                                ) : (
                                    <p className="mt-1 font-poppins text-sm text-muted-foreground">
                                        {user.firstName || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="lastName" className="font-poppins">Last Name</Label>
                                {isEditing ? (
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="mt-1"
                                        disabled={isLoading}
                                    />
                                ) : (
                                    <p className="mt-1 font-poppins text-sm text-muted-foreground">
                                        {user.lastName || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email" className="font-poppins flex items-center">
                                    <Mail className="h-4 w-4 mr-1" />
                                    Email
                                </Label>
                                <p className="mt-1 font-poppins text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="phone" className="font-poppins flex items-center">
                                    <Phone className="h-4 w-4 mr-1" />
                                    Phone
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="mt-1"
                                        disabled={isLoading}
                                    />
                                ) : (
                                    <p className="mt-1 font-poppins text-sm text-muted-foreground">
                                        {user.phone || 'Not provided'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex space-x-2 pt-4">
                                <Button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="font-poppins"
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        )}

                        {/* Security Info */}
                        <div className="border-t pt-6">
                            <h4 className="font-poppins font-semibold mb-4 flex items-center">
                                <Shield className="h-5 w-5 mr-2" />
                                Security Information
                            </h4>
                            <div className="space-y-2">
                                <p className="font-poppins text-sm text-muted-foreground">
                                    Email Verification: {user.isEmailVerified ? 'Verified' : 'Not verified'}
                                </p>
                                <p className="font-poppins text-sm text-muted-foreground">
                                    Account Type: {user.role === 'producer' ? 'Producer Account' : 'Customer Account'}
                                </p>
                                {!user.isEmailVerified && (
                                    <p className="font-poppins text-sm text-orange-600">
                                        Please verify your email address to access all features.
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
