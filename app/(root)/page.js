"use client"

import Banner from '@/components/shared/Banner';
import Header from '@/components/shared/Header';
import Products from '@/components/shared/Products';
import { useState } from 'react'

export default function HomePage() {

  const [cartCount, setCartCount] = useState(0) // to lift state up and send to navbar, for cart size updation
  return (
    <div>
        <Header cartCount={cartCount} />
        <Banner />
        <Products setCartCount={setCartCount} />
    </div>
  );
}
