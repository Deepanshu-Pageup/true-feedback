"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';



const Navbar = () => {
    const {data: session} = useSession();
    const user: User = session?.user as User


  return (
    <nav className='p-4 md:p-6 border-b-4 border-foreground bg-background sticky top-0 z-50 dark:border-b-primary'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a className='text-2xl font-black uppercase tracking-tighter mb-4 md:mb-0' href="#">Mystry <span className="text-primary">Messages</span></a>
      <div className='flex items-center gap-4'>
      <ThemeToggle />
      {
        session ? (
            <>
           <span className='font-bold hidden sm:inline text-muted-foreground'>Welcome, <span className="text-secondary dark:text-accent">{user?.username || user?.email}</span></span>
           <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
            </>
        ) : (
            <Link href='/sign-in'>
              <Button>Login</Button>
            </Link>
        )
      }
      </div>
        </div>
    </nav>
  )
}

export default Navbar
