"use client";

import type React from "react";

import { useState } from "react";
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
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { AuthenticationService } from "@/lib/api/services/AuthenticationService";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await AuthenticationService.postAuthRequestPasswordReset({ email });
            setSuccess(true);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Failed to send reset email. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <CheckCircle2 className='h-6 w-6 text-green-600' />
                        <CardTitle className='text-2xl'>
                            Check your email
                        </CardTitle>
                    </div>
                    <CardDescription>
                        We've sent a password reset link to {email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>
                        Click the link in the email to reset your password. If
                        you don't see the email, check your spam folder.
                    </p>
                </CardContent>
                <CardFooter>
                    <Link href='/auth/login' className='w-full'>
                        <Button
                            variant='outline'
                            className='w-full bg-transparent'
                        >
                            Back to sign in
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className='w-full max-w-md'>
            <CardHeader>
                <CardTitle className='text-2xl'>Reset your password</CardTitle>
                <CardDescription>
                    Enter your email address and we'll send you a link to reset
                    your password
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className='space-y-4'>
                    {error && (
                        <Alert variant='destructive'>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className='space-y-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            type='email'
                            placeholder='you@example.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter className='flex flex-col gap-4'>
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Sending...
                            </>
                        ) : (
                            "Send reset link"
                        )}
                    </Button>
                    <Link href='/auth/login' className='w-full'>
                        <Button variant='ghost' className='w-full'>
                            Back to sign in
                        </Button>
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}
