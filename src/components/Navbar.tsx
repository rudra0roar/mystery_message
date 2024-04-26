"use client"
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'
import { Button } from './ui/button'


export default function Navbar() {
    const  { data : session } = useSession()

    const user : User = session?.user
    console.log("ye user aur session hai" , user , session);
  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a href="#" className='text-xl font-bold mb-4 md:mb-0'>Mystery Message</a>
            {
                session ? (
                    <>
                    <span className='mr-4'>Welcome , {user?.username || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick = {() => signOut()}>Logout</Button>
                    </>
                ) : (
                    <Link href="/sign-in">
                        <Button className='w-full md:w-auto'>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}
