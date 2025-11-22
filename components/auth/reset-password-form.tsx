"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2 } from "lucide-react";
import { AuthenticationService } from "@/lib/api/services/AuthenticationService";

interface ResetPasswordFormProps {
    token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);

        try {
            await AuthenticationService.postAuthResetPassword({
                token,
                newPassword: formData.password,
            });
            router.push("/auth/login?reset=success");
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Failed to reset password. The link may have expired."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className='w-full max-w-md'>
            <CardHeader>
                <CardTitle className='text-2xl'>Set new password</CardTitle>
                <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className='space-y-4'>
                    {error && (
                        <Alert variant='destructive'>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className='space-y-2'>
                        <Label htmlFor='password'>New Password</Label>
                        <Input
                            id='password'
                            type='password'
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='confirmPassword'>
                            Confirm New Password
                        </Label>
                        <Input
                            id='confirmPassword'
                            type='password'
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    confirmPassword: e.target.value,
                                })
                            }
                            required
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Resetting password...
                            </>
                        ) : (
                            "Reset password"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
