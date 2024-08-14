"use client"

import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '../ui/button'
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from 'react'
import { getUserCart } from '@/lib/actions/user.actions'

const Header = ({userId, cartCount=null}) => {
    const [shake, setShake] = useState(false) // for triggering shake animation

    const [scrolled, setScrolled] = useState(false); // amount of window scrolled
    useEffect(() => {
        // to change the background of navbar after a certain scroll amount
        const handleScroll = () => {
            const offset = window.scrollY;
            offset > 500 ? setScrolled(true) : setScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);

        return () => { // removing the event listener
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const [cartLen, setCartLen] = useState(0) // cart size
    useEffect(() => {
        if(cartCount !== null) //if cart size is updated from cart or product page
        {
            setCartLen(cartCount)
        }
        else if(userId) //if cart size is not updated from cart or product page, we would not have the cartCount prop
        {
            // fetch the cart size using userId
            const fetchData = async () => {
                try {
                    const data = await getUserCart(userId)
                    setCartLen(data.count)
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData()
        }
        setShake(true); // animate the cart icon each time we update the cart size
        setTimeout(() => setShake(false), 500); // Duration of the shake animation
    },[userId, cartCount])
    

  return (
    <header className={`bg-${scrolled ? 'blue-950' : 'transparent'} text-white z-20 fixed w-full top-0 transition-colors duration-700`}>
        <div className='wrapper flex justify-between items-center'>
            
            {/* Logo */}
            <Link href={"/"}>
                <Image src={"/assets/images/logoCropped.png"} alt='logo' width={200} height={100} className='rounded-lg border-2 w-[45%] lg:w-[60%]' />
            </Link>

            <div className='flex justify-end items-center gap-3'>
                <SignedIn> {/* Only visible when user is logged in */}
                    <div className="flex items-center gap-8 md:gap-12">

                        {/* Cart Icon */}
                        <Link href={"/cart"} className={`relative hover:scale-105 ${shake ? 'shake' : ''} w-[28%] md:w-[20%]`}>
                            <Image src={"/assets/icons/cart.svg"} alt='Cart' width={30} height={30} className='w-[100%] flex-center' />
                            <Badge className="absolute -top-2 -right-4" size="sm">{cartLen}</Badge>
                        </Link>

                        {/* Logged in user */}
                        <UserButton />
                    </div>
                </SignedIn>
                <SignedOut> {/* Only visible when user is logged out */}
                    <Button asChild className="rounded-lg border-2 bg-blue-950 text-yellow-200 uppercase hover:bg-blue-950">
                        <SignInButton />
                    </Button>
                </SignedOut>
            </div>
        </div>
    </header>
  )
}

export default Header