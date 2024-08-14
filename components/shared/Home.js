"use client"

import { useState } from 'react'
import Banner from './Banner'
import Header from './Header'
import Products from './Products'

const Home = ({userId}) => {
    const [cartCount, setCartCount] = useState(0) // to lift state up and send to navbar, for cart size updation
  return (
    <div>
        <Header cartCount={cartCount} />
        <Banner />
        <Products userId={userId} setCartCount={setCartCount} />
    </div>
  )
}

export default Home