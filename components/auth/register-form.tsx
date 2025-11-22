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
    CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { AuthenticationService } from "@/lib/api/services/AuthenticationService";
import { signIn } from "next-auth/react";
import Image from "next/image";

export function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            await AuthenticationService.postAuthRegister({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            // Auto sign in after registration
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                console.log(result.error);
                setError(
                    "Registration successful, but login failed. Please try logging in."
                );
            } else {
                router.push("/dashboard/projects");
                router.refresh();
            }
        } catch (err: any) {
            console.log(err?.body?.message);

            setError(
                err.body?.message || "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full max-w-md space-y-8'>
            <div className='flex flex-col items-center space-y-4'>
                <div className='relative w-[200px] h-[60px]'>
                    <Image
                        src='/logo-text-dark.png'
                        alt='Logo'
                        fill
                        className='object-contain'
                        priority
                    />
                </div>
                <div className='text-center space-y-2'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Create an account
                    </h1>
                    <p className='text-muted-foreground'>
                        Get started with your free account today
                    </p>
                </div>
            </div>

            <Card className='border-border/40 shadow-lg'>
                <form onSubmit={handleSubmit}>
                    <CardContent className='space-y-5 pt-6'>
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
                                htmlFor='name'
                                className='text-sm font-medium'
                            >
                                Full name
                            </Label>
                            <Input
                                id='name'
                                type='text'
                                placeholder='John Doe'
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                required
                                disabled={isLoading}
                                className='h-11'
                            />
                        </div>
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
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                required
                                disabled={isLoading}
                                className='h-11'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label
                                htmlFor='password'
                                className='text-sm font-medium'
                            >
                                Password
                            </Label>
                            <div className='relative'>
                                <Input
                                    id='password'
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Min. 8 characters'
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
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
                        <div className='space-y-2'>
                            <Label
                                htmlFor='confirmPassword'
                                className='text-sm font-medium'
                            >
                                Confirm password
                            </Label>
                            <div className='relative'>
                                <Input
                                    id='confirmPassword'
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder='Re-enter your password'
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
                                    Creating account...
                                </>
                            ) : (
                                "Create account"
                            )}
                        </Button>
                        <div className='text-sm text-center text-muted-foreground'>
                            Already have an account?{" "}
                            <Link
                                href='/auth/login'
                                className='text-primary font-medium hover:underline underline-offset-4'
                            >
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
