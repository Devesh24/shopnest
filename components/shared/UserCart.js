"use client"

import { useState } from 'react'
import Cart from './Cart'
import Header from './Header'

const UserCart = ({userId}) => {
    const [cartCount, setCartCount] = useState(0) // to lift state up and send to navbar, for cart size updation
  return (
    <div>
        <Header cartCount={cartCount} />
        <div className='relative top-0 w-full h-[80vh] bg-cover md:bg-center text-white flex-center' style={{backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/images/cart.jpg')"}}>
            <div className="text-center mt-12">
                <p className="h1-bolder">SHOPNEST</p>
                <p className="h2-bold tracking-widest">Your Cart</p>
            </div>
        </div>
        <Cart userId={userId} setCartCount={setCartCount} />
    </div>
  )
}

export default UserCart