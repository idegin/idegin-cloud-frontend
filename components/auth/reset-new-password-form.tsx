"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import { AuthenticationService } from "@/lib/api/services/AuthenticationService";
import { toast } from "sonner";

export function ResetNewPasswordForm() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                router.push("/dashboard/projects");
            }, 2000);
        }
    }, [success, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("New password must be at least 8 characters long");
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError("New password must be different from current password");
            return;
        }

        setIsLoading(true);

        try {
            await AuthenticationService.putAuthChangePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            // Update session to mark user as no longer first-time login
            await update({
                ...session,
                user: {
                    ...session?.user,
                    isFirstLogin: false,
                },
            });

            setSuccess(true);
            toast.success("Password changed successfully!");
        } catch (err: any) {
            console.error("Error changing password:", err);
            setError(
                err?.response?.data?.message ||
                    "Failed to change password. Please check your current password and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <Card className='w-full max-w-md border-green-200 shadow-lg'>
                <CardHeader className='text-center pb-6'>
                    <div className='flex justify-center mb-4'>
                        <div className='h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center'>
                            <CheckCircle className='h-8 w-8 text-green-500' />
                        </div>
                    </div>
                    <CardTitle className='text-2xl font-bold text-green-700'>
                        Password Changed Successfully!
                    </CardTitle>
                    <CardDescription>
                        Your password has been updated. Redirecting you to the
                        dashboard...
                    </CardDescription>
                </CardHeader>
                <CardContent className='text-center'>
                    <div className='space-y-4'>
                        <Alert className='border-green-200 bg-green-50'>
                            <Shield className='h-4 w-4 text-green-600' />
                            <AlertDescription className='text-green-800'>
                                Your account is now secure. You can access all
                                features of the platform.
                            </AlertDescription>
                        </Alert>
                        <div className='flex items-center justify-center'>
                            <Loader2 className='h-4 w-4 animate-spin text-green-600 mr-2' />
                            <span className='text-sm text-green-600'>
                                Redirecting...
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='w-full max-w-md border-border/40 shadow-lg'>
            <CardHeader className='text-center pb-6'>
                <div className='flex justify-center mb-4'>
                    <div className='h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center'>
                        <Shield className='h-8 w-8 text-primary' />
                    </div>
                </div>
                <CardTitle className='text-2xl font-bold'>
                    Set Your New Password
                </CardTitle>
                <CardDescription>
                    For security reasons, you must change your password before
                    accessing the platform.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className='space-y-5'>
                    {error && (
                        <Alert
                            variant='destructive'
                            className='border-destructive/50'
                        >
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className='space-y-2'>
                        <Label
                            htmlFor='currentPassword'
                            className='text-sm font-medium'
                        >
                            Current Password
                        </Label>
                        <div className='relative'>
                            <Input
                                id='currentPassword'
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder='Enter your current password'
                                value={formData.currentPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        currentPassword: e.target.value,
                                    })
                                }
                                required
                                disabled={isLoading}
                                className='h-11 pr-10'
                            />
                            <button
                                type='button'
                                onClick={() =>
                                    setShowCurrentPassword(!showCurrentPassword)
                                }
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                                tabIndex={-1}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className='h-4 w-4' />
                                ) : (
                                    <Eye className='h-4 w-4' />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label
                            htmlFor='newPassword'
                            className='text-sm font-medium'
                        >
                            New Password
                        </Label>
                        <div className='relative'>
                            <Input
                                id='newPassword'
                                type={showNewPassword ? "text" : "password"}
                                placeholder='Enter your new password'
                                value={formData.newPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        newPassword: e.target.value,
                                    })
                                }
                                required
                                disabled={isLoading}
                                className='h-11 pr-10'
                            />
                            <button
                                type='button'
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                                tabIndex={-1}
                            >
                                {showNewPassword ? (
                                    <EyeOff className='h-4 w-4' />
                                ) : (
                                    <Eye className='h-4 w-4' />
                                )}
                            </button>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Password must be at least 8 characters long
                        </p>
                    </div>

                    <div className='space-y-2'>
                        <Label
                            htmlFor='confirmPassword'
                            className='text-sm font-medium'
                        >
                            Confirm New Password
                        </Label>
                        <div className='relative'>
                            <Input
                                id='confirmPassword'
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder='Confirm your new password'
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                required
                                disabled={isLoading}
                                className='h-11 pr-10'
                            />
                            <button
                                type='button'
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className='h-4 w-4' />
                                ) : (
                                    <Eye className='h-4 w-4' />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className='bg-muted/50 rounded-lg p-4 space-y-2'>
                        <h4 className='text-sm font-medium'>
                            Password Requirements:
                        </h4>
                        <ul className='text-xs text-muted-foreground space-y-1'>
                            <li>• At least 8 characters long</li>
                            <li>
                                • Must be different from your current password
                            </li>
                            <li>
                                • Use a combination of letters, numbers, and
                                symbols for better security
                            </li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className='flex flex-col gap-4 p-6'>
                    <Button
                        type='submit'
                        className='w-full h-11 text-base'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Changing password...
                            </>
                        ) : (
                            <>
                                <Shield className='mr-2 h-4 w-4' />
                                Change Password
                            </>
                        )}
                    </Button>
                    <div className='text-xs text-center text-muted-foreground'>
                        You must complete this step to access the platform
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
