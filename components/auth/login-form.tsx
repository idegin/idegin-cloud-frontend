"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                // Redirect based on role will be handled by middleware
                router.push("/dashboard/projects");
                router.refresh();
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full max-w-md space-y-8'>
            <div className='flex flex-col items-center space-y-4'>
                <div className='relative w-[200px] h-[60px]'>
                    <Image
                        src='logo-text-dark.png'
                        alt='Logo'
                        fill
                        className='object-contain'
                        priority
                    />
                </div>
                <div className='text-center space-y-2'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Welcome back
                    </h1>
                    <p className='text-muted-foreground'>
                        Sign in to your account to continue
                    </p>
                </div>
            </div>

            <Card className='border-border/40 shadow-lg'>
                <form onSubmit={handleSubmit}>
                    <CardContent className='space-y-6 pt-6'>
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
                                htmlFor='email'
                                className='text-sm font-medium'
                            >
                                Email address
                            </Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='you@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className='h-11'
                            />
                        </div>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <Label
                                    htmlFor='password'
                                    className='text-sm font-medium'
                                >
                                    Password
                                </Label>
                                <Link
                                    href='/auth/forgot-password'
                                    className='text-sm text-primary hover:underline underline-offset-4'
                                    tabIndex={-1}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className='relative'>
                                <Input
                                    id='password'
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className='h-11 pr-10'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className='h-4 w-4' />
                                    ) : (
                                        <Eye className='h-4 w-4' />
                                    )}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className='flex flex-col gap-4 py-6'>
                        <Button
                            type='submit'
                            className='w-full h-11 text-base'
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                        {/* <div className='text-sm text-center text-muted-foreground'>
                            Don't have an account?{" "}
                            <Link
                                href='/auth/register'
                                className='text-primary font-medium hover:underline underline-offset-4'
                            >
                                Create account
                            </Link>
                        </div> */}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
