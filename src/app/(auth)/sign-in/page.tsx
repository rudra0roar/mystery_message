"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

export default function page() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
    console.log("fir se false", isSubmitting);

    // zod Implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        console.log("submit ho rha hai na", isSubmitting);
        const response = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        if (response?.error) {
            toast({
                title: "Login Failed",
                description: "Invalid Username or Password",
                variant: "destructive"
            })
        }

        if (response?.url) {
            router.replace('/dashboard')
        }
        setIsSubmitting(false)
    }


    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Join Mystery Message
                    </h1>
                    <p className='mb-4'>
                        Sign in to Start Your anonymous advanture
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email/username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" type='password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ?
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                </> : ('Signin')}
                        </Button>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Want to Become a Member?{' '}
                        <Link href="/sign-up" className='text-blue-600 hover:text-blue-800'>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
